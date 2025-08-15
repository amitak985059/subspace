# Complete Chat Application Setup Guide

## 🚀 Full-Stack + Automation Integration Challenge

This project combines:
- **Nhost** (Auth + Hasura backend)
- **Hasura GraphQL** (queries, mutations, subscriptions, RLS)
- **n8n** (automation server to connect to OpenRouter)
- **OpenRouter API** (AI chatbot)
- **Bolt + Netlify** (frontend deployment)

## 📋 Prerequisites

1. **Nhost Account** - [app.nhost.io](https://app.nhost.io)
2. **OpenRouter API Key** - [openrouter.ai](https://openrouter.ai)
3. **n8n Instance** - [n8n.cloud](https://n8n.cloud) or local setup
4. **Netlify Account** - [netlify.com](https://netlify.com)

## 🗄️ 1. Database Setup (Hasura)

### Create Tables

#### `chats` table
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `messages` table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'bot')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enable Row-Level Security (RLS)

#### For `chats` table:
```sql
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);
```

#### For `messages` table:
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );
```

## 🔧 2. Hasura Actions Setup

### Create `sendMessage` Action

In Hasura Console → Actions:

```graphql
type Mutation {
  sendMessage(chat_id: uuid!, content: String!): Message
}
```

**Action Definition:**
- **Action Type:** `synchronous`
- **Handler:** `{{n8n_webhook_url}}`
- **Forward client headers:** ✅ Enable
- **Forward client headers to:** `X-Hasura-User-Id, X-Hasura-Role`

## 🤖 3. n8n Workflow Setup

### Workflow Structure

1. **Webhook Trigger** (POST)
2. **Validate Chat Ownership** (Hasura Query)
3. **Save User Message** (Hasura Mutation)
4. **Call OpenRouter API** (AI Response)
5. **Save Bot Response** (Hasura Mutation)
6. **Return Response** (Webhook Response)

### Step-by-Step n8n Setup

#### Step 1: Webhook Trigger
- **Node Type:** Webhook
- **HTTP Method:** POST
- **Path:** `/chat-message`
- **Response Mode:** Respond to Webhook

#### Step 2: Validate Chat Ownership
- **Node Type:** HTTP Request
- **Method:** POST
- **URL:** `{{hasura_graphql_endpoint}}`
- **Headers:**
  ```
  Content-Type: application/json
  x-hasura-admin-secret: {{your_admin_secret}}
  ```
- **Body:**
  ```json
  {
    "query": "query GetChat($chat_id: uuid!, $user_id: uuid!) { chats(where: {id: {_eq: $chat_id}, user_id: {_eq: $user_id}}) { id } }",
    "variables": {"chat_id": "{{$json.chat_id}}", "user_id": "{{$json['X-Hasura-User-Id']}}"}
  }
  ```

#### Step 3: Save User Message
- **Node Type:** HTTP Request
- **Method:** POST
- **URL:** `{{hasura_graphql_endpoint}}`
- **Headers:** Same as Step 2
- **Body:**
  ```json
  {
    "query": "mutation InsertMessage($chat_id: uuid!, $content: String!) { insert_messages_one(object: {chat_id: $chat_id, sender: \"user\", content: $content}) { id } }",
    "variables": {"chat_id": "{{$json.chat_id}}", "content": "{{$json.content}}"}
  }
  ```

#### Step 4: Call OpenRouter API
- **Node Type:** HTTP Request
- **Method:** POST
- **URL:** `https://openrouter.ai/api/v1/chat/completions`
- **Headers:**
  ```
  Authorization: Bearer {{openrouter_api_key}}
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "model": "openai/gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "{{$json.content}}"}
    ]
  }
  ```

#### Step 5: Save Bot Response
- **Node Type:** HTTP Request
- **Method:** POST
- **URL:** `{{hasura_graphql_endpoint}}`
- **Headers:** Same as Step 2
- **Body:**
  ```json
  {
    "query": "mutation InsertBotMessage($chat_id: uuid!, $content: String!) { insert_messages_one(object: {chat_id: $chat_id, sender: \"bot\", content: $content}) { id content created_at sender } }",
    "variables": {"chat_id": "{{$json.chat_id}}", "content": "{{$('Step 4').json.choices[0].message.content}}"}
  }
  ```

#### Step 6: Webhook Response
- **Node Type:** Respond to Webhook
- **Response Body:**
  ```json
  {
    "success": true,
    "message": "{{$('Step 5').json.data.insert_messages_one}}"
  }
  ```

## 🔑 4. Environment Variables

### Frontend (.env.local)
```bash
VITE_NHOST_SUBDOMAIN=your_subdomain
VITE_NHOST_REGION=your_region
```

### n8n Credentials
- **OpenRouter API Key**
- **Hasura Admin Secret**
- **Hasura GraphQL Endpoint**

## 🚀 5. Deployment

### Frontend (Netlify)
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: Add your Nhost credentials

### n8n
1. **n8n.cloud** (Recommended for production)
2. **Local setup** with ngrok tunnel for development

## 🧪 6. Testing

### Test Authentication
1. Sign up/sign in through the frontend
2. Verify JWT tokens are generated
3. Check Hasura permissions work

### Test Chat Flow
1. Create a new chat
2. Send a message
3. Verify AI response comes through
4. Check real-time updates via subscriptions

## 🔍 7. Troubleshooting

### Common Issues

1. **CORS Errors**: Check Hasura CORS settings
2. **Authentication Failures**: Verify JWT token format
3. **n8n Webhook Failures**: Check webhook URL and authentication
4. **OpenRouter API Errors**: Verify API key and rate limits

### Debug Steps

1. Check browser console for frontend errors
2. Monitor n8n workflow execution
3. Verify Hasura logs for permission issues
4. Test GraphQL queries in Hasura console

## 📱 8. Features Implemented

✅ **Beautiful Chat UI** - Modern design matching your screenshots
✅ **Real-time Messaging** - GraphQL subscriptions
✅ **User Authentication** - Nhost integration
✅ **AI Chatbot** - OpenRouter integration
✅ **Secure Backend** - Hasura with RLS
✅ **Automation Workflow** - n8n integration
✅ **Responsive Design** - Mobile-friendly interface

## 🎯 Next Steps

1. **Set up your Nhost project** with the correct subdomain
2. **Create the database tables** in Hasura
3. **Configure the n8n workflow** with your credentials
4. **Test the complete flow** end-to-end
5. **Deploy to production** on Netlify

Your chat application is now ready to compete with the best! 🚀
