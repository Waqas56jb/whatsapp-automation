# Check Why Incoming Messages Aren't Appearing

## Quick Diagnosis

If incoming messages aren't showing in the UI, check these:

### 1. Is the Webhook Being Called?

**Check your server console logs.** When a user sends a message, you should see:
```
=== WEBHOOK RECEIVED FROM TWILIO ===
```

**If you DON'T see this:**
- ❌ Webhook is NOT being called by Twilio
- The webhook URL is not configured correctly
- ngrok might not be running
- Webhook URL in Twilio might be wrong

### 2. Check Twilio Console Logs

1. Go to: https://console.twilio.com/us1/monitor/logs/sms
2. Look for your incoming message
3. Check the webhook delivery status:
   - ✅ **200 OK** = Webhook received successfully
   - ❌ **4xx/5xx** = Webhook failed
   - ⚠️ **No webhook call** = Webhook not configured

### 3. Verify Webhook Configuration

1. Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. Check "When a message comes in":
   - URL should be: `https://your-ngrok-url.ngrok-free.app/webhook/whatsapp`
   - Method should be: **POST**
   - Must be HTTPS (not HTTP)

### 4. Test Webhook Manually

Test if your webhook is accessible:
```bash
curl -X POST https://your-ngrok-url.ngrok-free.app/webhook/whatsapp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+1234567890&Body=Test message&MessageSid=test123"
```

Check your server console - you should see the webhook log.

### 5. Check ngrok Status

1. Make sure ngrok is running: `ngrok http 3000`
2. Check ngrok web interface: http://localhost:4040
3. See if any requests are coming through

### 6. Common Issues

#### Issue: Webhook not configured
**Solution:** Configure webhook URL in Twilio Console

#### Issue: ngrok URL changed
**Solution:** Update webhook URL in Twilio Console with new ngrok URL

#### Issue: Webhook receives but messages not stored
**Solution:** Check server logs for errors in message processing

#### Issue: Wrong webhook format
**Solution:** The code now handles multiple Twilio formats automatically

## Debugging Steps

1. ✅ Check server logs for "=== WEBHOOK RECEIVED ==="
2. ✅ Check Twilio Console → Monitor → Logs
3. ✅ Test webhook manually with curl
4. ✅ Verify ngrok is running
5. ✅ Verify webhook URL in Twilio Console
6. ✅ Check if user joined Twilio Sandbox (if using sandbox)

## Still Not Working?

Share these details:
- Do you see "=== WEBHOOK RECEIVED ===" in server logs?
- What does Twilio Console → Logs show?
- Is ngrok running?
- What webhook URL is configured in Twilio?
