import { gql } from "@apollo/client";

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
      user_id
      messages(order_by: { created_at: desc }, limit: 1) {
        content
        created_at
      }
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { 
      title: $title,
      user_id: "{{X-Hasura-User-Id}}"
    }) {
      id
      title
      created_at
    }
  }
`;

export const SUBSCRIBE_MESSAGES = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }, 
      order_by: { created_at: asc }
    ) {
      id
      sender
      content
      created_at
      chat_id
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: {
      chat_id: $chat_id,
      sender: "user",
      content: $content
    }) {
      id
      content
      created_at
    }
  }
`;

// Hasura Action for AI responses
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessageAction($chat_id: uuid!, $content: String!) {
    sendMessage(chat_id: $chat_id, content: $content) {
      id
      content
      created_at
      sender
    }
  }
`;
