import React, { useState, useEffect, useRef } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { SUBSCRIBE_MESSAGES, SEND_MESSAGE, SEND_MESSAGE_ACTION } from "../lib/graphql";
import { Phone, Video, MoreVertical, Paperclip, Smile, Send, User } from "lucide-react";
import { fakeUsers } from "../lib/fakeUsers";
import { openRouterService, OpenRouterMessage } from "../lib/openRouter";

interface Message {
  id: string;
  sender: string;
  content: string;
  created_at: string;
}

interface MessageViewProps {
  chatId: string;
  chatTitle?: string;
}

export const MessageView: React.FC<MessageViewProps> = ({ chatId, chatTitle = "Chat" }) => {
  const { data, loading } = useSubscription(SUBSCRIBE_MESSAGES, {
    variables: { chat_id: chatId }
  });
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if this is a fake chat
  const isFakeChat = chatId.startsWith('fake-');
  const fakeUser = isFakeChat ? fakeUsers.find(u => `fake-${u.id}` === chatId) : null;
  const displayTitle = fakeUser ? fakeUser.name : chatTitle;
  const displayAvatar = fakeUser ? fakeUser.avatar : null;

  // Generate fake messages for fake chats
  const generateFakeMessages = (): Message[] => {
    if (!fakeUser) return [];
    
    const messages: Message[] = [
      {
        id: 'fake-1',
        sender: 'bot',
        content: `Hello! I'm ${fakeUser.name}. How can I help you today?`,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 min ago
      },
      {
        id: 'fake-2',
        sender: 'user',
        content: 'Hi there! How are you?',
        created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString() // 25 min ago
      },
      {
        id: 'fake-3',
        sender: 'bot',
        content: "I'm doing great, thank you for asking! I'm here to assist you with any questions or help you need.",
        created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString() // 20 min ago
      }
    ];
    
    return messages;
  };

  // Initialize local messages for fake chats
  useEffect(() => {
    if (isFakeChat) {
      setLocalMessages(generateFakeMessages());
    }
  }, [chatId, isFakeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, data?.messages]);

  if (loading && !isFakeChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!text.trim() || isSending || isAiResponding) return;
    
    const userMessage = text.trim();
    setText("");
    setIsSending(true);

    try {
      if (isFakeChat) {
        // For fake chats, add user message immediately
        const newUserMessage: Message = {
          id: `user-${Date.now()}`,
          sender: 'user',
          content: userMessage,
          created_at: new Date().toISOString()
        };

        setLocalMessages(prev => [...prev, newUserMessage]);

        // Show AI is typing indicator
        setIsAiResponding(true);

        // Get AI response from OpenRouter
        try {
          console.log('MessageView: Calling OpenRouter for AI response...');
          const aiResponse = await openRouterService.sendMessage(userMessage);
          console.log('MessageView: OpenRouter response received:', aiResponse);
          
          const newBotMessage: Message = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            content: aiResponse,
            created_at: new Date().toISOString()
          };

          setLocalMessages(prev => [...prev, newBotMessage]);
        } catch (error) {
          console.error('MessageView: Failed to get AI response:', error);
          
          // Fallback response if AI fails
          const fallbackMessage: Message = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            created_at: new Date().toISOString()
          };

          setLocalMessages(prev => [...prev, fallbackMessage]);
        } finally {
          setIsAiResponding(false);
        }
      } else {
        // For real chats, use the existing flow
        await sendMessage({
          variables: { 
            chat_id: chatId, 
            content: userMessage 
          }
        });

        await sendMessageAction({
          variables: { 
            chat_id: chatId, 
            content: userMessage 
          }
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Use local messages for fake chats, real messages for real chats
  const messages = isFakeChat ? localMessages : (data?.messages || []);
  const groupedMessages = messages.reduce((groups: any[], message: Message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, []);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
              {displayAvatar || <User className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{displayTitle}</h3>
              <p className="text-sm text-gray-500">
                {fakeUser ? "Online" : "Last seen recently"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]: [string, any]) => (
          <div key={date}>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-200 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-600 font-medium">{date}</span>
              </div>
            </div>
            <div className="space-y-3">
              {dateMessages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* AI Typing Indicator */}
        {isAiResponding && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isSending || isAiResponding}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Smile className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim() || isSending || isAiResponding}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
