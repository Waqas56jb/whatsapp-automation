# Troubleshooting: Messages Not Showing

## Quick Checks

### 1. Verify Backend is Running
```bash
cd backend
node server.js
```
You should see: "🚀 WhatsApp Bot Server Started"

### 2. Check Webhook Configuration in Twilio

1. Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. Verify "When a message comes in" is set to your webhook URL
3. Format: `https://your-domain.com/webhook/whatsapp`
4. Method: **HTTP POST**

### 3. Test Webhook Accessibility

**For Local Development (using ngrok):**
```bash
# Terminal 1: Start backend
cd backend
node server.js

# Terminal 2: Start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use this in Twilio: https://abc123.ngrok.io/webhook/whatsapp
```

**Test the webhook:**
```bash
# Test if webhook is accessible
curl https://your-ngrok-url.ngrok.io/webhook/whatsapp
```

### 4. Check Server Logs

When a message arrives, you should see in the server console:
```
=== Webhook Received ===
=== Incoming WhatsApp Message ===
From: whatsapp:+1234567890
Message: Hello
```

**If you DON'T see these logs:**
- Webhook URL is not configured correctly in Twilio
- ngrok is not running (for local)
- Server is not accessible from internet

### 5. Debug Stored Messages

Visit in browser or use curl:
```
http://localhost:3000/api/debug/messages
```

This shows:
- How many messages are stored
- Last 10 incoming messages
- Last 10 outgoing messages
- All messages combined

### 6. Common Issues

#### Issue: No logs when message sent
**Solution:**
- Check Twilio Console → Monitor → Logs
- Verify webhook URL is correct
- Ensure ngrok is running (for local)
- Check if webhook URL is accessible (use curl or browser)

#### Issue: Webhook receives but messages not stored
**Solution:**
- Check server logs for errors
- Verify `.env` file has correct credentials
- Check OpenAI API key is valid

#### Issue: Messages stored but not showing in UI
**Solution:**
- Check browser console for errors
- Verify frontend is calling correct API URL
- Check `/api/messages` endpoint returns data
- Verify CORS is enabled

### 7. Manual Test

Send a test message using curl:
```bash
curl -X POST http://localhost:3000/webhook/whatsapp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+1234567890&Body=Test message&MessageSid=test123"
```

You should see logs in server console.

### 8. Verify Twilio Sandbox

If using Twilio Sandbox:
1. Join the sandbox first:
   - Send `join [your-sandbox-keyword]` to `+14155238886`
2. Only messages from joined numbers will be received
3. Check Twilio Console → Monitor → Logs for delivery status

### 9. Check Environment Variables

Verify `.env` file has:
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_actual_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
OPENAI_API_KEY=your_openai_key
PORT=3000
```

### 10. Test Twilio Connection

Visit: `http://localhost:3000/api/test-twilio`

Should return:
```json
{
  "success": true,
  "accountName": "...",
  "status": "active"
}
```

If it fails, check your Twilio credentials.

## Still Not Working?

1. **Check Twilio Console → Monitor → Logs**
   - See if webhook is being called
   - Check for error messages
   - Verify message delivery status

2. **Check Server Logs**
   - Look for any error messages
   - Verify webhook is receiving requests
   - Check for OpenAI API errors

3. **Test Webhook Manually**
   - Use Postman or curl to send test request
   - Verify webhook endpoint responds

4. **Verify Network**
   - Ensure server is accessible
   - Check firewall settings
   - Verify ngrok is running (for local)
