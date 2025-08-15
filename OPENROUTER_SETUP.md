# OpenRouter AI Integration Setup Guide

## 🚀 Enable AI Chatbot Responses

Your chat application now supports real AI responses from OpenRouter! Here's how to set it up:

## 📋 Prerequisites

1. **OpenRouter Account** - [openrouter.ai](https://openrouter.ai)
2. **API Key** - Get your free API key from OpenRouter

## 🔑 Step 1: Get OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai)
2. Sign up for a free account
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the API key (starts with `sk-or-`)

## ⚙️ Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# OpenRouter AI Configuration
VITE_OPENROUTER_API_KEY=sk-or-your-actual-api-key-here

# Nhost Configuration (if not already set)
VITE_NHOST_SUBDOMAIN=tsbwjtsnekcocprbjdtr
VITE_NHOST_REGION=ap-south-1
```

## 🧪 Step 3: Test the Integration

1. **Start your development server**: `npm run dev`
2. **Open the chat application** in your browser
3. **Click on any chatbot user** (Bob Smith, Alice Johnson, etc.)
4. **Send a message** - you should see:
   - Your message appears immediately
   - "AI is typing..." indicator
   - Real AI response from OpenRouter

## 🔧 How It Works

### Message Flow:
1. **User types message** → Message appears in chat
2. **AI typing indicator** → Shows "AI is typing..."
3. **OpenRouter API call** → Sends message to AI model
4. **AI response** → Real response appears in chat
5. **Conversation continues** → Full AI chatbot experience

### Features:
- ✅ **Real AI Responses** from GPT-3.5-turbo
- ✅ **Typing Indicators** while AI is thinking
- ✅ **Error Handling** with fallback messages
- ✅ **Conversation History** maintained locally
- ✅ **Professional Chat Interface** matching your screenshots

## 🎯 Supported AI Models

Currently configured for:
- **Model**: `openai/gpt-3.5-turbo`
- **Max Tokens**: 500
- **Temperature**: 0.7 (balanced creativity)

## 🔍 Troubleshooting

### Common Issues:

1. **"OpenRouter API Key Required" notification**
   - Solution: Add your API key to `.env.local`

2. **"Failed to get AI response" error**
   - Check your internet connection
   - Verify API key is correct
   - Check OpenRouter account status

3. **Slow responses**
   - Normal for first few requests
   - OpenRouter may have rate limits on free tier

### Debug Steps:

1. **Check browser console** for error messages
2. **Verify API key** in your `.env.local` file
3. **Test API key** directly with OpenRouter
4. **Check network tab** for failed requests

## 💰 Pricing & Limits

- **Free Tier**: Limited requests per month
- **Paid Plans**: Higher limits and faster responses
- **Model Costs**: Vary by AI model used

## 🚀 Next Steps

Once OpenRouter is working:

1. **Test different conversation types**
2. **Customize AI personality** in the system prompt
3. **Integrate with Hasura** for persistent storage
4. **Add conversation memory** for context-aware responses
5. **Deploy to production** with proper API key management

## 🔒 Security Notes

- **Never commit API keys** to version control
- **Use environment variables** for all sensitive data
- **Monitor API usage** to prevent unexpected charges
- **Consider rate limiting** for production use

Your AI chatbot is now ready to provide intelligent, helpful responses! 🎉
