import React, { useState, useEffect } from 'react';
import { Send, Bot, Copy, Shield, Calendar, Star } from 'lucide-react';
import { Chat, Message, User } from '../types';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  user: User | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, messages: initialMessages, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  useEffect(() => {
    // Mock messages for the selected chat
    const mockMessages: Message[] = [
      {
        id: '1',
        chatId: chat.id,
        senderId: 'user1',
        senderName: 'Alice Johnson',
        content: 'Community meeting scheduled for tomorrow at 7 PM in the main hall. Please bring your building maintenance concerns.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isImportant: true,
        hasEvent: true,
        eventDetails: {
          title: 'Community Meeting',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          time: '7:00 PM',
          description: 'Monthly community meeting',
          type: 'meeting'
        }
      },
      {
        id: '2',
        chatId: chat.id,
        senderId: 'user2',
        senderName: 'Bob Smith',
        content: 'The elevator in Building A will be under maintenance this weekend from 9 AM to 5 PM.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isImportant: true
      },
      {
        id: '3',
        chatId: chat.id,
        senderId: 'user3',
        senderName: 'Carol Davis',
        content: 'Has anyone seen my cat? It\'s been missing since yesterday. Orange tabby, very friendly.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '4',
        chatId: chat.id,
        senderId: 'user4',
        senderName: 'David Wilson',
        content: 'Breaking: Local government announces new tax benefits for residential communities.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isFakeNews: false
      }
    ];
    setMessages(mockMessages);
  }, [chat.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: chat.id,
      senderId: user.id,
      senderName: user.name,
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setShowAiSuggestions(false);
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    // Generate AI suggestions for reply
    const suggestions = [
      "Thank you for the update!",
      "I'll be there on time.",
      "Could you provide more details about this?",
      "This is very helpful information."
    ];
    setAiSuggestions(suggestions);
    setShowAiSuggestions(true);
  };

  const handleCopySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion);
    setNewMessage(suggestion);
    setShowAiSuggestions(false);
  };

  const checkFakeNews = async (message: Message) => {
    // Simulate fake news detection
    const isFake = Math.random() > 0.7; // 30% chance of being fake
    alert(`Fact Check Result: This message appears to be ${isFake ? 'potentially misleading' : 'reliable'}`);
  };

  const addToCalendar = (message: Message) => {
    if (message.eventDetails) {
      alert(`Event "${message.eventDetails.title}" added to your calendar for ${message.eventDetails.date.toLocaleDateString()} at ${message.eventDetails.time}`);
    } else {
      alert('No event information found in this message');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {chat.avatar ? (
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {chat.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="font-semibold text-gray-900">{chat.name}</h2>
            {chat.type === 'group' && chat.members && (
              <p className="text-sm text-gray-500">{chat.members} members</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                message.senderId === user?.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              } ${selectedMessage?.id === message.id ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => handleMessageClick(message)}
            >
              {message.senderId !== user?.id && (
                <p className="text-xs font-medium mb-1 opacity-70">
                  {message.senderName}
                </p>
              )}
              
              <p className="text-sm">{message.content}</p>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                
                <div className="flex items-center space-x-1">
                  {message.isImportant && (
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  )}
                  {message.hasEvent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCalendar(message);
                      }}
                      className="p-1 hover:bg-black/10 rounded"
                    >
                      <Calendar className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      checkFakeNews(message);
                    }}
                    className="p-1 hover:bg-black/10 rounded"
                  >
                    <Shield className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Suggestions */}
      {showAiSuggestions && (
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">AI Suggestions</span>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-2 rounded border"
              >
                <span className="text-sm text-gray-700">{suggestion}</span>
                <button
                  onClick={() => handleCopySuggestion(suggestion)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;