import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CHATS, CREATE_CHAT } from "../lib/graphql";
import { Search, Plus, MoreVertical, User } from "lucide-react";
import { NewChatModal } from "./NewChatModal";
import { fakeUsers, FakeUser } from "../lib/fakeUsers";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  lastMessage?: string;
  unreadCount?: number;
  user?: FakeUser;
}

interface ChatListProps {
  onSelect: (chatId: string) => void;
  selectedChatId?: string | null;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelect, selectedChatId }) => {
  const { data, loading } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create fake chats with the 4 chatbot users
  const fakeChats: Chat[] = fakeUsers.map((user, index) => ({
    id: `fake-${user.id}`,
    title: user.name,
    created_at: new Date(Date.now() - (index + 1) * 15 * 60 * 1000).toISOString(), // 15 min apart
    lastMessage: getRandomMessage(user.name),
    unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
    user: user
  }));

  // Combine real chats with fake chats
  const allChats = [...fakeChats, ...(data?.chats || [])];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleCreate = async () => {
    setIsModalOpen(true);
  };

  const handleUserSelect = async (user: FakeUser) => {
    try {
      const res = await createChat({
        variables: { title: `Chat with ${user.name}` }
      });
      onSelect(res.data.insert_chats_one.id);
    } catch (error) {
      console.error("Failed to create chat:", error);
      // If real chat creation fails, create a fake chat
      const fakeChatId = `fake-new-${user.id}`;
      onSelect(fakeChatId);
    }
  };

  const filteredChats = allChats.filter((chat: Chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-full bg-white border-r border-gray-200 flex flex-col">
        {/* Current User Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Current User</p>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCreate}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? "No chats found" : "No chats yet"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChats.map((chat: Chat) => (
                <div
                  key={chat.id}
                  onClick={() => onSelect(chat.id)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedChatId === chat.id ? "bg-blue-50 border-r-2 border-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                      {chat.user?.avatar || <User className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {chat.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(chat.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount && chat.unreadCount > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                            {chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleUserSelect}
      />
    </>
  );
};

// Helper function to format time ago
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "now";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
}

// Helper function to get random messages
function getRandomMessage(userName: string): string {
  const messages = [
    "Hi there! How are you?",
    "That's interesting!",
    "I see what you mean.",
    "Thanks for the update!",
    "Don't forget about our lunch plans!",
    "I'll get back to you on that.",
    "What time is it?",
    "How's your day going?",
    "Nice to meet you!",
    "See you later!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
