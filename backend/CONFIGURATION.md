# Configuration Summary

## Your Twilio Configuration

- **Account SID**: [Get from Twilio Console]
- **WhatsApp Number**: `whatsapp:+14155238886`
- **Auth Token**: [Set in .env file]

## Environment Variables (.env)

Make sure your `backend/.env` file contains:

```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

## Webhook Configuration

### Step 1: Get Public URL (for local development)

Use ngrok:
```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 2: Configure in Twilio Console

1. Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. Find **"When a message comes in"**
3. Enter: `https://your-ngrok-url.ngrok.io/webhook/whatsapp`
4. Method: **HTTP POST**
5. Click **Save**

### Step 3: Test

1. Join Twilio Sandbox (if using sandbox):
   - Send `join [your-sandbox-keyword]` to `+14155238886`
2. Send a test message to `+14155238886`
3. Check server logs for incoming messages

## API Endpoints

### Webhook (Twilio → Your Server)
- **POST** `/webhook/whatsapp` - Receives incoming WhatsApp messages

### Frontend API
- **GET** `/api/status` - Get bot status and webhook URL
- **GET** `/api/test-twilio` - Test Twilio connection
- **POST** `/api/send-message` - Send message manually

### Send Message Examples

**Regular Text Message:**
```json
POST /api/send-message
{
  "to": "+923477603854",
  "message": "Hello from the bot!"
}
```

**Content Template Message:**
```json
POST /api/send-message
{
  "to": "+923477603854",
  "contentSid": "HXb5b62575e6e4ff6129ad7c8efe1f983e",
  "contentVariables": "{\"1\":\"12/1\",\"2\":\"3pm\"}"
}
```

## How It Works

1. **Incoming Message Flow:**
   - User sends WhatsApp message → Twilio → Webhook (`/webhook/whatsapp`) → OpenAI → Response sent back

2. **Manual Message Flow:**
   - Frontend → `/api/send-message` → Twilio → WhatsApp

## Testing Checklist

- [ ] `.env` file created with all credentials
- [ ] Server starts without errors: `node server.js`
- [ ] Twilio connection test passes: `GET /api/test-twilio`
- [ ] Webhook URL configured in Twilio Console
- [ ] ngrok running (for local testing)
- [ ] Joined Twilio Sandbox (if using sandbox)
- [ ] Test message sent and received

## Troubleshooting

### Webhook not receiving messages
- Verify webhook URL in Twilio Console matches your server URL
- Check ngrok is running (for local)
- Ensure server is running and accessible
- Check server logs for incoming requests

### Messages not sending
- Verify Auth Token in `.env` is correct
- Check Twilio account has sufficient credits
- Verify phone number format: `+1234567890` or `whatsapp:+1234567890`
- Check server logs for error messages
