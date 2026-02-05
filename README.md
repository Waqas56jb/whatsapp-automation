# WhatsApp Bot with Twilio and React.js

A WhatsApp automation bot with React.js frontend and Node.js backend, powered by Twilio WhatsApp API and OpenAI for intelligent responses.

## Features

- 🤖 **Twilio WhatsApp Integration** - Receive and send messages via Twilio WhatsApp API
- 🧠 **OpenAI Integration** - Uses GPT-3.5-turbo for intelligent AI responses
- 💻 **React.js Frontend** - Modern web interface to manage and monitor the bot
- 🔄 **Real-time Status** - Monitor bot connection status
- 💬 **Message Management** - Send messages manually through the web interface
- 📝 **Message History** - View sent messages with timestamps

## Project Structure

```
whatsapp-automation/
├── backend/              # Node.js backend server
│   ├── server.js         # Main server file with Twilio webhook
│   ├── package.json      # Backend dependencies
│   └── .env             # Environment variables (create this)
├── frontend/             # React.js frontend
│   ├── src/
│   │   ├── App.js       # Main app component
│   │   ├── App.css      # Styles
│   │   ├── index.js     # Entry point
│   │   └── index.css    # Global styles
│   ├── public/
│   │   └── index.html   # HTML template
│   └── package.json     # Frontend dependencies
└── README.md            # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Twilio Account ([Sign up here](https://www.twilio.com/try-twilio))
- Twilio WhatsApp Sandbox or Approved WhatsApp Business Number
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- A publicly accessible URL for webhooks (use ngrok for local development)

## Setup Instructions

### 1. Twilio Setup

1. **Create a Twilio Account**:
   - Go to [Twilio Console](https://console.twilio.com/)
   - Sign up for a free account

2. **Get Your Twilio Credentials**:
   - Account SID: Found in Twilio Console Dashboard
   - Auth Token: Found in Twilio Console Dashboard
   - WhatsApp Number: Use Twilio Sandbox (for testing) or get an approved WhatsApp Business number

3. **Set Up WhatsApp Sandbox** (for testing):
   - Go to [Twilio Console → Messaging → Try it out → Send a WhatsApp message](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
   - Follow instructions to join the sandbox
   - Your sandbox number will be in format: `whatsapp:+14155238886`

4. **Configure Webhook** (after backend is running):
   - Go to [Twilio Console → Messaging → Settings → WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox)
   - Set "When a message comes in" to: `https://your-domain.com/webhook/whatsapp`
   - For local development, use ngrok: `ngrok http 3000`
   - Use the ngrok URL: `https://your-ngrok-url.ngrok.io/webhook/whatsapp`

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
```

4. Start the backend server:
```bash
node server.js
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

5. **Set up ngrok for local webhook** (if testing locally):
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3000
```
Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and use it in Twilio webhook configuration.

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional) in the frontend directory:
```bash
REACT_APP_API_URL=http://localhost:3000/api
```

4. Start the React development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000` (or another port if 3000 is taken)

## Usage

### How It Works

1. **Automatic Responses**:
   - When someone sends a WhatsApp message to your Twilio WhatsApp number
   - Twilio sends a webhook to `/webhook/whatsapp`
   - The backend processes the message and gets an AI response from OpenAI
   - The bot automatically replies with the AI-generated response

2. **Manual Messaging**:
   - Use the React.js frontend to send messages manually
   - Enter the recipient's WhatsApp number (with country code)
   - Type your message and click "Send Message"

### Testing

1. **Join Twilio Sandbox** (if using sandbox):
   - Send "join [your-sandbox-keyword]" to the Twilio WhatsApp number
   - You'll receive a confirmation message

2. **Send a Test Message**:
   - Send any message to your Twilio WhatsApp number
   - The bot will automatically respond with an AI-generated message

3. **Use the Frontend**:
   - Open `http://localhost:3000` in your browser
   - Check the status to ensure backend is connected
   - Send test messages through the web interface

## API Endpoints

### Webhook (Twilio)
- `POST /webhook/whatsapp` - Receives incoming WhatsApp messages from Twilio

### API (Frontend)
- `GET /api/status` - Get bot connection status
- `POST /api/send-message` - Send a message manually
  ```json
  {
    "to": "+1234567890",
    "message": "Hello!"
  }
  ```
- `GET /api/health` - Health check endpoint

## Configuration

### OpenAI Model

You can change the OpenAI model in `backend/server.js`:
```javascript
model: "gpt-3.5-turbo"  // Change to "gpt-4" for better responses
```

### System Prompt

Customize the bot's behavior by modifying the system prompt in `backend/server.js`:
```javascript
content: "You are a helpful WhatsApp assistant. Keep responses concise and friendly."
```

### Phone Number Format

- Always include country code (e.g., +1 for US, +44 for UK)
- Format: `+1234567890` or `whatsapp:+1234567890`
- The backend will automatically add `whatsapp:` prefix if missing

## Troubleshooting

### Backend Issues

- **Webhook not receiving messages**:
  - Verify webhook URL is correctly set in Twilio Console
  - Ensure your server is publicly accessible (use ngrok for local)
  - Check server logs for incoming requests

- **Twilio authentication errors**:
  - Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` in `.env`
  - Check Twilio Console for correct credentials

- **OpenAI errors**:
  - Verify your API key is correct
  - Check you have sufficient credits in your OpenAI account
  - Review OpenAI API rate limits

### Frontend Issues

- **Cannot connect to backend**:
  - Ensure backend is running on the correct port
  - Check CORS settings if accessing from different origin
  - Verify API URL in frontend settings

- **Messages not sending**:
  - Check browser console for errors
  - Verify phone number format (must include country code)
  - Ensure recipient has joined Twilio Sandbox (if using sandbox)

### Twilio Issues

- **Sandbox limitations**:
  - Sandbox only works with numbers that have joined
  - For production, you need an approved WhatsApp Business number
  - Apply for WhatsApp Business API access in Twilio Console

- **Message delivery failures**:
  - Check Twilio Console → Monitor → Logs for error details
  - Verify recipient number format
  - Ensure you have sufficient Twilio credits

## Production Deployment

1. **Deploy Backend**:
   - Use services like Heroku, Railway, or AWS
   - Set environment variables in your hosting platform
   - Ensure your webhook URL is HTTPS

2. **Deploy Frontend**:
   - Build the React app: `npm run build`
   - Deploy to Netlify, Vercel, or any static hosting
   - Update `REACT_APP_API_URL` to point to your backend

3. **Update Twilio Webhook**:
   - Set webhook URL to your production backend URL
   - Format: `https://your-backend-domain.com/webhook/whatsapp`

## Security Notes

- Never commit your `.env` file with API keys
- Use environment variables for all sensitive data
- Always use HTTPS in production
- Validate and sanitize incoming webhook data
- Implement rate limiting for production use
- Consider adding authentication for the frontend API endpoints

## Dependencies

### Backend
- `express` - Web server framework
- `twilio` - Twilio SDK for WhatsApp
- `openai` - OpenAI API client
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Frontend
- `react` - React library
- `react-dom` - React DOM renderer
- `react-scripts` - Create React App scripts
- `axios` - HTTP client

## License

ISC

## Support

For issues or questions, please check:
- [Twilio WhatsApp API Documentation](https://www.twilio.com/docs/whatsapp)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev/)

## Additional Resources

- [Twilio WhatsApp Sandbox Guide](https://www.twilio.com/docs/whatsapp/sandbox)
- [Twilio WhatsApp Business API](https://www.twilio.com/docs/whatsapp/api)
- [ngrok for Local Development](https://ngrok.com/)
