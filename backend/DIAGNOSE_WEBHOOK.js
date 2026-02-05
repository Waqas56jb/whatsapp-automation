// Quick diagnostic script to check webhook setup
const axios = require('axios');

const NGROK_URL = process.env.NGROK_WEBHOOK_URL || 'https://your-ngrok-url.ngrok-free.app';

console.log('\n🔍 Webhook Diagnostic Tool\n');
console.log('='.repeat(50));

// Test 1: Check if webhook endpoint is accessible
async function testWebhookAccessibility() {
  console.log('\n1. Testing webhook accessibility...');
  try {
    const response = await axios.get(`${NGROK_URL}/webhook/test`);
    console.log('✅ Webhook is accessible!');
    console.log('   Response:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Webhook is NOT accessible');
    console.log('   Error:', error.message);
    console.log('   Make sure:');
    console.log('   - Backend server is running');
    console.log('   - ngrok is running');
    console.log('   - NGROK_WEBHOOK_URL in .env matches ngrok URL');
    return false;
  }
}

// Test 2: Check if webhook can receive POST requests
async function testWebhookPOST() {
  console.log('\n2. Testing webhook POST endpoint...');
  try {
    const response = await axios.post(`${NGROK_URL}/webhook/whatsapp`, {
      From: 'whatsapp:+1234567890',
      Body: 'Test message',
      MessageSid: 'test123'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('✅ Webhook POST endpoint works!');
    return true;
  } catch (error) {
    console.log('❌ Webhook POST endpoint failed');
    console.log('   Error:', error.message);
    return false;
  }
}

// Main diagnostic
async function runDiagnostics() {
  console.log(`\nTesting webhook URL: ${NGROK_URL}`);
  console.log('='.repeat(50));

  const test1 = await testWebhookAccessibility();
  const test2 = await testWebhookPOST();

  console.log('\n' + '='.repeat(50));
  console.log('\n📋 Next Steps:');
  
  if (!test1 || !test2) {
    console.log('1. Fix webhook accessibility issues above');
    console.log('2. Make sure ngrok is running: ngrok http 3000');
    console.log('3. Update NGROK_WEBHOOK_URL in .env file');
  } else {
    console.log('✅ Webhook is working!');
    console.log('\nNow verify in Twilio Console:');
    console.log('1. Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox');
    console.log(`2. Set webhook URL to: ${NGROK_URL}/webhook/whatsapp`);
    console.log('3. Method: POST');
    console.log('4. Save');
    console.log('\n5. Check Twilio Logs: https://console.twilio.com/us1/monitor/logs/sms');
    console.log('   Look for webhook delivery status when messages arrive');
  }
}

runDiagnostics().catch(console.error);
