import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Users, Bot, Calendar, Shield } from 'lucide-react';
import { User, Chat, Message } from '../types';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import FilterModal from '../components/FilterModal';
import SummarizeModal from '../components/SummarizeModal';

interface ChatsProps {
  user: User | null;
}

const Chats: React.FC<ChatsProps> = ({ user }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);

  useEffect(() => {
    // Mock chat data
    const mockChats: Chat[] = [
      {
        id: 'chat1',
        name: 'Green Meadows Community',
        type: 'group',
        avatar: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        unreadCount: 3,
        members: 245,
        lastMessage: {
          id: 'msg1',
          chatId: 'chat1',
          senderId: 'user1',
          senderName: 'Alice Johnson',
          content: 'Community meeting scheduled for tomorrow at 7 PM',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isImportant: true
        }
      },
      {
        id: 'chat2',
        name: 'Tech Entrepreneurs Hub',
        type: 'group',
        avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        unreadCount: 7,
        members: 89,
        lastMessage: {
          id: 'msg2',
          chatId: 'chat2',
          senderId: 'user2',
          senderName: 'Bob Smith',
          content: 'New startup funding opportunities available',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      },
      {
        id: 'chat3',
        name: 'Neighborhood Watch',
        type: 'group',
        avatar: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        unreadCount: 1,
        members: 156,
        lastMessage: {
          id: 'msg3',
          chatId: 'chat3',
          senderId: 'user3',
          senderName: 'Carol Davis',
          content: 'Security patrol schedule updated',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        }
      }
    ];
    setChats(mockChats);
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">
                Manage your community conversations with AI-powered features
              </p>
            </div>
            
            {/* AI Feature Buttons */}
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Smart Filter</span>
              </button>
              
              <button
                onClick={() => setShowSummarizeModal(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span>Summarize</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Auto Schedule</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                <Shield className="w-4 h-4" />
                <span>Fact Check</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                <ChatList
                  chats={filteredChats}
                  selectedChat={selectedChat}
                  onSelectChat={setSelectedChat}
                />
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              {selectedChat ? (
                <ChatWindow
                  chat={selectedChat}
                  messages={messages}
                  user={user}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a chat to start messaging
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the sidebar to view messages
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilter={(filters) => {
            console.log('Applying filters:', filters);
            setShowFilterModal(false);
          }}
        />
      )}

      {showSummarizeModal && (
        <SummarizeModal
          isOpen={showSummarizeModal}
          onClose={() => setShowSummarizeModal(false)}
          chats={chats}
          onGenerateSummary={(options) => {
            console.log('Generating summary:', options);
            setShowSummarizeModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Chats;