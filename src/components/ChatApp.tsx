import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { useAuthenticationStatus } from "@nhost/react";
import { client } from "../lib/apolloClient";
import { ChatList } from "./ChatList";
import { MessageView } from "./MessageView";
import { LoadingSpinner } from "./LoadingSpinner";

export const ChatApp: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the chat application.</p>
        </div>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <div className="h-screen bg-gray-50">
        <div className="h-full flex">
          {/* Chat List Sidebar */}
          <div className="w-80 flex-shrink-0">
            <ChatList 
              onSelect={setSelectedChat} 
              selectedChatId={selectedChat}
            />
          </div>
          
          {/* Message View */}
          <div className="flex-1">
            {selectedChat ? (
              <MessageView 
                chatId={selectedChat} 
                chatTitle="Chat Conversation"
              />
            ) : (
              <div className="h-full bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat to start messaging</h3>
                  <p className="text-gray-600">Choose a conversation from the list to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
};
