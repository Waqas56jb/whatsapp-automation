# How to Update Ngrok URL

## Quick Update

When your ngrok URL changes, simply update the `.env` file:

1. **Open:** `backend/.env`

2. **Find the line:**
   ```env
   NGROK_WEBHOOK_URL=https://your-ngrok-url.ngrok-free.app
   ```

3. **Update with your new ngrok URL:**
   ```env
   NGROK_WEBHOOK_URL=https://your-new-ngrok-url.ngrok-free.app
   ```

4. **Restart your server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   node server.js
   ```

5. **Update Twilio Console:**
   - Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
   - Update webhook URL to: `https://your-new-ngrok-url.ngrok-free.app/webhook/whatsapp`
   - Method: POST
   - Save

## Example

**Old URL:**
```env
NGROK_WEBHOOK_URL=https://old-url.ngrok-free.app
```

**New URL (after ngrok restart):**
```env
NGROK_WEBHOOK_URL=https://new-url.ngrok-free.app
```

## The server will automatically use the URL from .env

When you start the server, it will:
- Read `NGROK_WEBHOOK_URL` from `.env`
- Display it in the startup message
- Use it in the status API endpoint
- Show it in all webhook-related logs

## Verify

After updating, check:
1. Server startup message shows the correct URL
2. Visit `/api/status` - should show the webhook URL
3. Test endpoint: `https://your-ngrok-url.ngrok-free.app/webhook/test`
