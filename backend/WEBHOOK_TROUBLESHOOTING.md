# Webhook Troubleshooting Guide

## Problem: Messages Not Being Received

If users send messages to your Twilio WhatsApp number but they're not appearing in your app, follow these steps:

## Step 1: Verify Server is Running

```bash
cd backend
node server.js
```

You should see:
```
🚀 WhatsApp Bot Server Started
📡 Server running on port 3000
```

## Step 2: Make Webhook Publicly Accessible

**For Local Development, you MUST use ngrok:**

1. **Install ngrok:**
   - Download from: https://ngrok.com/download
   - Or install via: `npm install -g ngrok`

2. **Start ngrok:**
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL:**
   - You'll see something like: `https://abc123.ngrok.io`
   - **IMPORTANT:** Use the HTTPS URL, not HTTP

4. **Your webhook URL will be:**
   ```
   https://abc123.ngrok.io/webhook/whatsapp
   ```

## Step 3: Configure Webhook in Twilio Console

1. **Go to Twilio Console:**
   - https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox

2. **Find "When a message comes in" section**

3. **Enter your webhook URL:**
   ```
   https://your-ngrok-url.ngrok.io/webhook/whatsapp
   ```

4. **Select HTTP method:** `POST` (not GET)

5. **Click "Save"**

## Step 4: Test Webhook Connectivity

### Test 1: Test Endpoint (Any Request)
Visit in browser or use curl:
```bash
curl https://your-ngrok-url.ngrok.io/webhook/test
```

You should see a JSON response confirming the webhook is accessible.

### Test 2: Check Server Logs
When you access the test endpoint, check your server console. You should see:
```
=== TEST WEBHOOK HIT ===
```

### Test 3: Simulate Twilio Request
```bash
curl -X POST https://your-ngrok-url.ngrok.io/webhook/whatsapp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+1234567890&Body=Test message&MessageSid=test123"
```

Check your server logs - you should see:
```
=== WEBHOOK RECEIVED FROM TWILIO ===
```

## Step 5: Verify Twilio Sandbox (If Using Sandbox)

1. **Join the Sandbox:**
   - Send a WhatsApp message to: `+14155238886`
   - Send: `join [your-sandbox-keyword]`
   - You'll receive a confirmation message

2. **Only joined numbers can send messages**

3. **Check if you're joined:**
   - Go to Twilio Console → Monitor → Logs
   - Look for your join message

## Step 6: Check Twilio Console Logs

1. **Go to:** https://console.twilio.com/us1/monitor/logs/sms

2. **Look for:**
   - Incoming messages from users
   - Webhook delivery attempts
   - Any error messages

3. **Check webhook status:**
   - Look for "200 OK" responses (success)
   - Look for error codes (4xx, 5xx) which indicate problems

## Step 7: Common Issues & Solutions

### Issue: "Cannot GET /webhook/whatsapp"
**Solution:** This is normal. Twilio uses POST, not GET. The GET endpoint is just for testing.

### Issue: No logs when message sent
**Possible causes:**
- Webhook URL not configured in Twilio
- ngrok not running
- Wrong webhook URL format
- Server not accessible from internet

**Solution:**
1. Verify ngrok is running: `ngrok http 3000`
2. Check webhook URL in Twilio Console matches ngrok URL
3. Test with `/webhook/test` endpoint

### Issue: Webhook receives but messages not stored
**Solution:**
- Check server logs for errors
- Verify OpenAI API key is set
- Check if message format is correct

### Issue: "Missing required fields" error
**Solution:**
- Twilio might be sending data in different format
- Check server logs to see actual body structure
- Update webhook handler to match Twilio's format

## Step 8: Verify Webhook is Working

When a user sends a message, you should see in server logs:

```
═══════════════════════════════════════
=== WEBHOOK RECEIVED FROM TWILIO ===
═══════════════════════════════════════
From: whatsapp:+1234567890
Message: Hello
=== Incoming WhatsApp Message ===
✓ Stored incoming message. Total incoming: 1
```

## Step 9: Production Deployment

For production, you need a permanent domain:

1. **Deploy backend to:**
   - Heroku
   - Railway
   - AWS
   - DigitalOcean
   - Any cloud provider

2. **Update webhook URL in Twilio:**
   ```
   https://your-production-domain.com/webhook/whatsapp
   ```

3. **Ensure HTTPS is enabled** (required by Twilio)

## Quick Checklist

- [ ] Server is running (`node server.js`)
- [ ] ngrok is running (`ngrok http 3000`)
- [ ] Webhook URL configured in Twilio Console
- [ ] Webhook URL uses HTTPS (not HTTP)
- [ ] Webhook method is POST
- [ ] Test endpoint works (`/webhook/test`)
- [ ] Joined Twilio Sandbox (if using sandbox)
- [ ] Checked Twilio Console logs
- [ ] Server logs show webhook requests

## Still Not Working?

1. **Check ngrok status:**
   - Visit: http://localhost:4040 (ngrok web interface)
   - See all incoming requests

2. **Check server logs:**
   - Look for any error messages
   - Verify webhook is being called

3. **Test manually:**
   ```bash
   curl -X POST http://localhost:3000/webhook/whatsapp \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "From=whatsapp:+1234567890&Body=Test&MessageSid=test123"
   ```

4. **Verify environment variables:**
   - Check `.env` file has correct values
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - TWILIO_WHATSAPP_NUMBER
   - OPENAI_API_KEY

## Need Help?

Check:
- Server console logs
- Browser console (F12)
- Twilio Console → Monitor → Logs
- ngrok web interface (http://localhost:4040)
