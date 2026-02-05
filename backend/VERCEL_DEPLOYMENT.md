# Deploying Backend to Vercel

## Important Notes

**Vercel provides HTTPS URLs automatically - you DON'T need ngrok!**

When you deploy to Vercel, you'll get a URL like:
- `https://your-project.vercel.app`

You can use this URL directly in Twilio webhook configuration.

## Deployment Steps

### Option 1: Deploy to Vercel (Recommended for Production)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Enter a name or press Enter for default)
   - Directory? **./** (current directory)
   - Override settings? **No**

5. **Set Environment Variables**:
   ```bash
   vercel env add TWILIO_ACCOUNT_SID
   vercel env add TWILIO_AUTH_TOKEN
   vercel env add TWILIO_WHATSAPP_NUMBER
   vercel env add OPENAI_API_KEY
   vercel env add PORT
   ```
   
   Or set them in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add all variables from your `.env` file

6. **Get Your Vercel URL**:
   After deployment, Vercel will show you a URL like:
   ```
   https://your-project.vercel.app
   ```

7. **Configure Twilio Webhook**:
   - Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
   - Set "When a message comes in" to: `https://your-project.vercel.app/webhook/whatsapp`
   - Method: **HTTP POST**
   - Click **Save**

8. **Test Your Webhook**:
   Visit: `https://your-project.vercel.app/webhook/test`
   You should see a success message.

### Option 2: Use Ngrok for Local Development

If you want to test locally with ngrok (NOT on Vercel):

1. **Run your backend locally**:
   ```bash
   cd backend
   node server.js
   ```

2. **In a new terminal, start ngrok**:
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Update your `.env` file**:
   ```env
   NGROK_WEBHOOK_URL=https://abc123.ngrok-free.app
   ```

5. **Configure Twilio webhook** with the ngrok URL:
   - `https://abc123.ngrok-free.app/webhook/whatsapp`

## Important Considerations

### ⚠️ State Management on Vercel

**Vercel is serverless** - this means:
- Each request may run on a different server
- In-memory storage (`messageStore`, `activeStreams`) will be lost between requests
- **This is NOT suitable for production with current implementation**

### Solutions:

1. **Use a Database** (Recommended):
   - Replace in-memory storage with a database (MongoDB, PostgreSQL, etc.)
   - Use Redis for active streams

2. **Use a Different Hosting** (For current code):
   - **Railway**: https://railway.app (supports persistent servers)
   - **Render**: https://render.com (supports persistent servers)
   - **Heroku**: https://heroku.com (supports persistent servers)

3. **Hybrid Approach**:
   - Deploy frontend to Vercel
   - Deploy backend to Railway/Render (keeps in-memory storage working)

## Recommended Setup

### For Production:
1. **Frontend**: Deploy to Vercel
2. **Backend**: Deploy to Railway or Render
3. **Database**: Add MongoDB/PostgreSQL for message storage

### For Development:
1. Run backend locally: `node server.js`
2. Use ngrok: `ngrok http 3000`
3. Configure Twilio with ngrok URL

## Quick Deploy Commands

```bash
# Deploy to Vercel
cd backend
vercel

# Set environment variables (one by one)
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_WHATSAPP_NUMBER
vercel env add OPENAI_API_KEY

# Or deploy with environment variables from .env
vercel --prod
```

## After Deployment

1. Get your Vercel URL: `https://your-project.vercel.app`
2. Test webhook: `https://your-project.vercel.app/webhook/test`
3. Configure in Twilio: `https://your-project.vercel.app/webhook/whatsapp`
4. Send a test message to your Twilio WhatsApp number

## Troubleshooting

- **Webhook not receiving requests?**
  - Check Vercel function logs in dashboard
  - Verify environment variables are set
  - Test webhook URL manually in browser

- **Messages not persisting?**
  - This is expected on Vercel (serverless)
  - Consider migrating to a database or different hosting
