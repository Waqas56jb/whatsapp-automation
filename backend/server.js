const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();

// Middleware to log all requests (for debugging)
app.use((req, res, next) => {
  if (req.path === '/webhook/whatsapp' || req.path === '/webhook/test') {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('IP:', req.ip || req.connection.remoteAddress);
    console.log('User-Agent:', req.get('user-agent'));
    console.log('Content-Type:', req.get('content-type'));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For Twilio webhook (Twilio sends form-encoded data)

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Twilio Client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

// Ngrok Webhook URL (from .env file)
const NGROK_WEBHOOK_URL = process.env.NGROK_WEBHOOK_URL || 'https://your-ngrok-url.ngrok-free.app';
const WEBHOOK_FULL_URL = `${NGROK_WEBHOOK_URL}/webhook/whatsapp`;

// Store incoming and outgoing messages
const messageStore = {
  incoming: [], // Messages received from users
  outgoing: []   // Messages sent by bot
};

// Get AI response from OpenAI
async function getAIResponse(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful WhatsApp assistant. Keep responses concise and friendly."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 150
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "Sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

// Twilio Webhook - Receives incoming WhatsApp messages
// Configure this URL in Twilio Console: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
app.post('/webhook/whatsapp', async (req, res) => {
  try {
    // Log full request for debugging
    console.log('\n═══════════════════════════════════════');
    console.log('=== WEBHOOK RECEIVED FROM TWILIO ===');
    console.log('═══════════════════════════════════════');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('IP Address:', req.ip || req.connection.remoteAddress);
    console.log('User-Agent:', req.get('user-agent'));
    console.log('Content-Type:', req.get('content-type'));
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', JSON.stringify(req.query, null, 2));
    console.log('═══════════════════════════════════════');
    
    const incomingMessage = req.body.Body || req.body.body;
    const from = req.body.From || req.body.from; // Format: whatsapp:+1234567890
    const messageSid = req.body.MessageSid || req.body.messageSid;
    const profileName = req.body.ProfileName || req.body.profileName || 'Unknown';

    // Validate required fields
    if (!incomingMessage || !from) {
      console.error('Missing required fields:', { incomingMessage: !!incomingMessage, from: !!from });
      console.error('Full body:', req.body);
      return res.status(400).send('Missing required fields');
    }

    const timestamp = new Date();
    
    console.log(`\n=== Incoming WhatsApp Message ===`);
    console.log(`From: ${from} (${profileName})`);
    console.log(`Message: ${incomingMessage}`);
    console.log(`Message SID: ${messageSid}`);
    console.log(`Timestamp: ${timestamp.toISOString()}`);

    // Ignore if message is from the bot itself
    if (from === TWILIO_WHATSAPP_NUMBER) {
      console.log('Ignoring message from bot itself');
      return res.status(200).send('OK');
    }

    // Store incoming message
    const incomingMsg = {
      id: messageSid || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: from,
      fromNumber: from.replace('whatsapp:', ''),
      profileName: profileName,
      message: incomingMessage,
      timestamp: timestamp.toISOString ? timestamp.toISOString() : new Date(timestamp).toISOString(),
      type: 'incoming'
    };
    messageStore.incoming.unshift(incomingMsg); // Add to beginning
    // Keep only last 1000 messages
    if (messageStore.incoming.length > 1000) {
      messageStore.incoming = messageStore.incoming.slice(0, 1000);
    }
    
    console.log(`✓ Stored incoming message. Total incoming: ${messageStore.incoming.length}`);

    // Get AI response
    console.log('Getting AI response from OpenAI...');
    const aiResponse = await getAIResponse(incomingMessage);
    console.log(`AI Response: ${aiResponse}`);

    // Send response via Twilio
    const sentMessage = await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: from,
      body: aiResponse
    });

    // Store outgoing message
    const outgoingMsg = {
      id: sentMessage.sid,
      to: from,
      toNumber: from.replace('whatsapp:', ''),
      message: aiResponse,
      timestamp: new Date().toISOString(),
      type: 'outgoing',
      status: sentMessage.status
    };
    messageStore.outgoing.unshift(outgoingMsg);
    // Keep only last 1000 messages
    if (messageStore.outgoing.length > 1000) {
      messageStore.outgoing = messageStore.outgoing.slice(0, 1000);
    }
    
    console.log(`✓ Stored outgoing message. Total outgoing: ${messageStore.outgoing.length}`);

    console.log(`✓ Sent AI response to ${from}`);
    console.log(`Message SID: ${sentMessage.sid}`);
    console.log(`===================================\n`);

    // Respond to Twilio webhook (must respond with 200 OK)
    res.status(200).send('OK');
    console.log('Webhook response sent: 200 OK');
  } catch (error) {
    console.error('Error handling webhook:', error);
    console.error('Error stack:', error.stack);
    // Still respond with 200 to prevent Twilio from retrying
    res.status(200).send('Error processing message');
  }
});

// Test webhook endpoint - accepts any request to verify connectivity
app.all('/webhook/test', (req, res) => {
  console.log('\n=== TEST WEBHOOK HIT ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  
  res.json({
    success: true,
    message: 'Webhook is accessible!',
    method: req.method,
    timestamp: new Date().toISOString(),
    received: {
      headers: req.headers,
      body: req.body,
      query: req.query
    },
    note: 'If you see this, your webhook URL is working. Use /webhook/whatsapp for Twilio.'
  });
});

// Test webhook endpoint - to verify webhook is accessible
app.get('/webhook/whatsapp', (req, res) => {
  res.json({
    message: 'Webhook endpoint is accessible',
    method: 'GET',
    note: 'Twilio uses POST method. This is just a test endpoint.',
    webhookUrl: `${req.protocol}://${req.get('host')}/webhook/whatsapp`,
    instructions: 'Configure this URL in Twilio Console. Twilio will send POST requests here.'
  });
});

// Debug endpoint to see stored messages
app.get('/api/debug/messages', (req, res) => {
  const incomingCopy = [...(messageStore.incoming || [])];
  const outgoingCopy = [...(messageStore.outgoing || [])];
  
  console.log('\n[DEBUG] Debug endpoint called');
  console.log('[DEBUG] Store state:', {
    incomingLength: incomingCopy.length,
    outgoingLength: outgoingCopy.length,
    incomingIsArray: Array.isArray(messageStore.incoming),
    outgoingIsArray: Array.isArray(messageStore.outgoing),
    storeReference: messageStore === messageStore
  });
  
  res.json({
    incomingCount: incomingCopy.length,
    outgoingCount: outgoingCopy.length,
    incoming: incomingCopy.slice(0, 10), // Last 10
    outgoing: outgoingCopy.slice(0, 10), // Last 10
    all: [...incomingCopy, ...outgoingCopy]
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeB - timeA;
      })
      .slice(0, 20),
    storeInfo: {
      incomingIsArray: Array.isArray(messageStore.incoming),
      outgoingIsArray: Array.isArray(messageStore.outgoing),
      incomingType: typeof messageStore.incoming,
      outgoingType: typeof messageStore.outgoing
    }
  });
});

// API Routes for Frontend
app.get('/api/status', (req, res) => {
  res.json({
    isReady: true,
    twilioNumber: TWILIO_WHATSAPP_NUMBER,
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    message: 'Twilio WhatsApp bot is ready',
    webhookUrl: `${req.protocol}://${req.get('host')}/webhook/whatsapp`
  });
});

// Test Twilio connection
app.get('/api/test-twilio', async (req, res) => {
  try {
    const account = await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    res.json({
      success: true,
      accountName: account.friendlyName,
      status: account.status,
      twilioNumber: TWILIO_WHATSAPP_NUMBER
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to connect to Twilio. Check your credentials.'
    });
  }
});

app.post('/api/send-message', async (req, res) => {
  try {
    const { to, message, contentSid, contentVariables } = req.body;

    console.log('\n[API] /api/send-message called');
    console.log('[API] Request body:', { to, message: message?.substring(0, 50), contentSid });
    console.log('[API] Current store state - Incoming:', messageStore.incoming.length, 'Outgoing:', messageStore.outgoing.length);

    if (!to) {
      return res.status(400).json({ error: 'To number is required' });
    }

    if (!message && !contentSid) {
      return res.status(400).json({ error: 'Either message or contentSid is required' });
    }

    // Format number (ensure it starts with whatsapp:)
    const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    // Build message payload
    const messagePayload = {
      from: TWILIO_WHATSAPP_NUMBER,
      to: toNumber
    };

    // Use content template if provided, otherwise use regular message
    if (contentSid) {
      messagePayload.contentSid = contentSid;
      if (contentVariables) {
        messagePayload.contentVariables = typeof contentVariables === 'string' 
          ? contentVariables 
          : JSON.stringify(contentVariables);
      }
    } else {
      messagePayload.body = message;
    }

    console.log(`[API] Sending message to ${toNumber}...`);
    const twilioMessage = await twilioClient.messages.create(messagePayload);
    console.log(`[API] Message sent. SID: ${twilioMessage.sid}, Status: ${twilioMessage.status}`);

    // Store outgoing message
    const outgoingMsg = {
      id: twilioMessage.sid,
      to: toNumber,
      toNumber: toNumber.replace('whatsapp:', ''),
      message: message || `[Content Template: ${contentSid}]`,
      timestamp: new Date().toISOString(),
      type: 'outgoing',
      status: twilioMessage.status
    };
    
    console.log('[API] Storing message:', {
      id: outgoingMsg.id,
      to: outgoingMsg.toNumber,
      messageLength: outgoingMsg.message.length,
      timestamp: outgoingMsg.timestamp
    });
    
    messageStore.outgoing.unshift(outgoingMsg);
    if (messageStore.outgoing.length > 1000) {
      messageStore.outgoing = messageStore.outgoing.slice(0, 1000);
    }
    
    console.log(`[API] ✓ Stored manual outgoing message. Total outgoing: ${messageStore.outgoing.length}`);
    console.log('[API] Store verification - First message ID:', messageStore.outgoing[0]?.id);

    console.log(`[API] ✓ Message sent successfully. SID: ${twilioMessage.sid}`);

    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      messageSid: twilioMessage.sid,
      status: twilioMessage.status
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      error: 'Failed to send message', 
      details: error.message,
      code: error.code
    });
  }
});

// Get all messages (incoming and outgoing)
app.get('/api/messages', (req, res) => {
  try {
    const { type, limit = 100 } = req.query;
    
    console.log(`\n[API] Fetching messages - type: ${type || 'all'}, limit: ${limit}`);
    console.log(`[API] Store stats - Incoming: ${messageStore.incoming.length}, Outgoing: ${messageStore.outgoing.length}`);
    console.log(`[API] Store reference check:`, {
      incomingIsArray: Array.isArray(messageStore.incoming),
      outgoingIsArray: Array.isArray(messageStore.outgoing),
      incomingLength: messageStore.incoming?.length,
      outgoingLength: messageStore.outgoing?.length
    });
    
    // Create fresh copies to avoid reference issues
    const incomingCopy = [...(messageStore.incoming || [])];
    const outgoingCopy = [...(messageStore.outgoing || [])];
    
    let messages = [];
    if (type === 'incoming') {
      messages = incomingCopy.slice(0, parseInt(limit));
    } else if (type === 'outgoing') {
      messages = outgoingCopy.slice(0, parseInt(limit));
    } else {
      // Combine and sort by timestamp
      const allMessages = [...incomingCopy, ...outgoingCopy];
      messages = allMessages
        .sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeB - timeA; // Descending order (newest first)
        })
        .slice(0, parseInt(limit));
    }

    console.log(`[API] Returning ${messages.length} messages`);
    if (messages.length > 0) {
      console.log(`[API] Sample message:`, {
        id: messages[0].id,
        type: messages[0].type,
        timestamp: messages[0].timestamp
      });
    }
    
    res.json({
      success: true,
      messages: messages,
      counts: {
        incoming: incomingCopy.length,
        outgoing: outgoingCopy.length,
        total: incomingCopy.length + outgoingCopy.length
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'WhatsApp Bot with Twilio',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 WhatsApp Bot Server Started');
  console.log('========================================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`📱 Twilio Account SID: ${process.env.TWILIO_ACCOUNT_SID}`);
  console.log(`💬 Twilio WhatsApp Number: ${TWILIO_WHATSAPP_NUMBER}`);
  console.log(`\n🔗 Webhook Configuration:`);
  console.log(`   Local: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`   (Use ngrok for public URL: ngrok http ${PORT})`);
  console.log(`\n📋 Configure webhook in Twilio Console:`);
  console.log(`   https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox`);
  console.log(`   Set "When a message comes in" to your webhook URL`);
  console.log(`\n✅ API Endpoints:`);
  console.log(`   GET  /api/status - Check bot status`);
  console.log(`   GET  /api/test-twilio - Test Twilio connection`);
  console.log(`   GET  /api/messages - Get all messages`);
  console.log(`   GET  /api/debug/messages - Debug: View stored messages`);
  console.log(`   POST /api/send-message - Send message manually`);
  console.log(`   POST /webhook/whatsapp - Twilio webhook (auto-reply)`);
  console.log(`   GET  /webhook/whatsapp - Test webhook accessibility`);
  console.log(`   ALL  /webhook/test - Test webhook connectivity (any method)`);
  console.log(`\n🔗 Your Webhook URL (from .env):`);
  console.log(`   ${WEBHOOK_FULL_URL}`);
  console.log(`   Test endpoint: ${NGROK_WEBHOOK_URL}/webhook/test`);
  console.log(`\n🔍 Webhook Setup:`);
  console.log(`   1. Update NGROK_WEBHOOK_URL in .env file if ngrok URL changes`);
  console.log(`   2. Configure in Twilio Console:`);
  console.log(`      https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox`);
  console.log(`   3. Set "When a message comes in" to:`);
  console.log(`      ${WEBHOOK_FULL_URL}`);
  console.log(`   4. Method: POST`);
  console.log(`   5. Test: Visit ${NGROK_WEBHOOK_URL}/webhook/test`);
  console.log(`\n📋 Debugging:`);
  console.log(`   - Check server logs when messages arrive`);
  console.log(`   - Visit /api/debug/messages to see stored messages`);
  console.log(`   - Check ngrok web interface: http://localhost:4040`);
  console.log(`   - See WEBHOOK_TROUBLESHOOTING.md for detailed guide`);
  console.log(`========================================\n`);
});
