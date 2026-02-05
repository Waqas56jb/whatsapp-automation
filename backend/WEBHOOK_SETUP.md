# Twilio Webhook Configuration Guide

## Quick Setup Steps

### 1. Get Your Public URL

For local development, use **ngrok**:
```bash
# Install ngrok from https://ngrok.com/download
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 2. Configure Webhook in Twilio Console

1. Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. Find the section: **"When a message comes in"**
3. Enter your webhook URL: `https://your-ngrok-url.ngrok.io/webhook/whatsapp`
4. Select **HTTP POST** method
5. Click **Save**

### 3. Test the Webhook

1. Send a WhatsApp message to your Twilio number: `+14155238886`
2. Join the sandbox first (if using sandbox):
   - Send: `join [your-sandbox-keyword]` to the Twilio number
3. Send any message to test
4. Check your server logs to see incoming messages

## Your Configuration

- **Account SID**: [Get from Twilio Console]
- **WhatsApp Number**: `whatsapp:+14155238886`
- **Webhook Endpoint**: `/webhook/whatsapp`

## Webhook URL Format

```
https://your-domain.com/webhook/whatsapp
```

For local development with ngrok:
```
https://abc123.ngrok.io/webhook/whatsapp
```

## Testing

1. Start your server: `node server.js`
2. Start ngrok: `ngrok http 3000`
3. Update Twilio webhook URL with ngrok URL
4. Send a test message to your Twilio WhatsApp number
5. Check server logs for incoming messages

## Production Deployment

For production, use a permanent domain:
- Deploy backend to Heroku, Railway, AWS, etc.
- Use your production domain: `https://yourdomain.com/webhook/whatsapp`
- Update webhook URL in Twilio Console
