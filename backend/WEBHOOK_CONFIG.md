# Webhook Configuration

## Your Webhook URL

**Full Webhook URL:**
```
https://your-ngrok-url.ngrok-free.app/webhook/whatsapp
```

## Twilio Console Configuration

1. **Go to Twilio Console:**
   - https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox

2. **Find "When a message comes in" section**

3. **Enter this URL (replace with your actual ngrok URL):**
   ```
   https://your-ngrok-url.ngrok-free.app/webhook/whatsapp
   ```

4. **Select HTTP method:** `POST`

5. **Click "Save"**

## Test Your Webhook

### Test 1: Test Endpoint
Visit in browser (replace with your actual ngrok URL):
```
https://your-ngrok-url.ngrok-free.app/webhook/test
```

You should see a JSON response confirming the webhook is accessible.

### Test 2: Check Server Logs
When you access the test endpoint, check your server console. You should see:
```
=== TEST WEBHOOK HIT ===
```

### Test 3: Verify Webhook is Configured
After saving in Twilio Console, send a test message to your Twilio WhatsApp number. Check your server logs for:
```
=== WEBHOOK RECEIVED FROM TWILIO ===
```

## Important Notes

- ✅ Make sure your backend server is running (`node server.js`)
- ✅ Make sure ngrok is running and forwarding to port 3000
- ✅ The webhook URL must be HTTPS (which it is)
- ✅ The webhook URL must end with `/webhook/whatsapp`
- ✅ Twilio must use POST method (not GET)

## Troubleshooting

If messages still don't arrive:

1. **Check ngrok is running:**
   ```bash
   ngrok http 3000
   ```
   Verify the URL matches your ngrok URL

2. **Check server is running:**
   ```bash
   cd backend
   node server.js
   ```

3. **Test webhook manually:**
   ```bash
   curl -X POST https://your-ngrok-url.ngrok-free.app/webhook/whatsapp \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "From=whatsapp:+1234567890&Body=Test&MessageSid=test123"
   ```

4. **Check Twilio Console Logs:**
   - Go to: https://console.twilio.com/us1/monitor/logs/sms
   - Look for webhook delivery attempts
   - Check for any error codes

## Current Configuration

- **ngrok URL:** [Your ngrok URL from `ngrok http 3000`]
- **Webhook Endpoint:** `/webhook/whatsapp`
- **Full URL:** `https://your-ngrok-url.ngrok-free.app/webhook/whatsapp`
- **Method:** POST
- **Backend Port:** 3000
