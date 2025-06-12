"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, Bot, Copy, Shield, Calendar, Star, MoreVertical, Phone, Video } from "lucide-react"
import type { Chat, Message, User } from "../types"
import { apiService, type TelegramMessage } from "../services/api"

interface ChatWindowProps {
  chat: Chat
  messages: Message[]
  user: User | null
  onMessagesUpdate?: (messages: Message[]) => void
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, messages: propMessages, user, onMessagesUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat.id) return

      setIsLoading(true)
      try {
        const result = await apiService.getMessages(chat.id)
        if (result.success && result.data) {
          // Convert Telegram messages to Message format
          const convertedMessages: Message[] = result.data.messages.map((msg: TelegramMessage) => ({
            id: msg.id,
            chatId: msg.chatId,
            senderId: msg.senderId,
            senderName: msg.senderName,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            isImportant: msg.isImportant,
            hasEvent: msg.hasEvent,
            eventDetails: msg.eventDetails
              ? {
                  ...msg.eventDetails,
                  date: new Date(msg.eventDetails.date),
                }
              : undefined,
            isFakeNews: msg.isFakeNews,
          }))

          // Sort messages by timestamp (newest first, then reverse for display)
          const sortedMessages = convertedMessages.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )

          setMessages(sortedMessages)

          // Notify parent component if callback provided
          if (onMessagesUpdate) {
            onMessagesUpdate(sortedMessages)
          }
        } else {
          console.error("Failed to fetch messages:", result.error)
          // Fallback to prop messages if API fails
          setMessages(propMessages)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
        // Fallback to prop messages if API fails
        setMessages(propMessages)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [chat.id, propMessages, onMessagesUpdate])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Date.now().toString(),
      chatId: chat.id,
      senderId: user.id,
      senderName: user.name,
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
    setShowAiSuggestions(false)
  }
  const generateAiSuggestions = async (selectedMessage: Message) => {
    try {
      // Get the model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Format chat history for context
      const chatHistory = messages
        .map(msg => `${msg.senderName}: ${msg.content}`)
        .join('\n');

      // Create the prompt
      const prompt = `Given the following chat history and the selected message, suggest 3 appropriate responses. Each response should be a complete sentence and start on a new line. Do not include numbers, bullet points, or any other formatting.

Chat History:
${chatHistory}

Selected Message:
${selectedMessage.senderName}: ${selectedMessage.content}

Provide exactly 3 responses, one per line:`;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text()
      .split('\n')
      .map(s => s.replace(/^\d+\.\s*|\*\*|^[-•]\s*/g, '').trim())
      .filter(s => s.length > 0 && s.endsWith('.'));

      // Take first 3 suggestions
      setAiSuggestions(suggestions.slice(0, 3));
      setShowAiSuggestions(true);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Fallback to default suggestions if API call fails
      // setAiSuggestions([
      //   "Thank you for the update!",
      //   "I'll be there on time.",
      //   "Could you provide more details about this?"
      // ]);
      // setShowAiSuggestions(true);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    // Generate AI suggestions for reply
    generateAiSuggestions(message);
  }

  const handleCopySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion)
    setNewMessage(suggestion)
    setShowAiSuggestions(false)
  }

  const checkFakeNews = async (message: Message) => {
    // Simulate fake news detection
    const isFake = Math.random() > 0.7 // 30% chance of being fake
    alert(`Fact Check Result: This message appears to be ${isFake ? "potentially misleading" : "reliable"}`)
  }

  const addToCalendar = (message: Message) => {
    if (message.eventDetails) {
      alert(
        `Event "${message.eventDetails.title}" added to your calendar for ${message.eventDetails.date.toLocaleDateString()} at ${message.eventDetails.time}`,
      )
    } else {
      alert("No event information found in this message")
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const messageDate = new Date(timestamp)
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else if (diffInHours < 48) {
      return (
        "Yesterday " +
        messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    } else {
      return (
        messageDate.toLocaleDateString() +
        " " +
        messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {chat.avatar ? (
              <img
                src={chat.avatar || "/placeholder.svg"}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                  {chat.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{chat.name}</h2>
              {chat.type === "group" && chat.members && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{chat.members} members • Online</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg ${
                  message.senderId === user?.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700"
                } ${selectedMessage?.id === message.id ? "ring-2 ring-indigo-500" : ""}`}
                onClick={() => handleMessageClick(message)}
              >
                {message.senderId !== user?.id && (
                  <p className="text-xs font-medium mb-2 opacity-70">{message.senderName}</p>
                )}

                <p className="text-sm leading-relaxed">{message.content}</p>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>

                  <div className="flex items-center space-x-1">
                    {message.isImportant && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                    {message.hasEvent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCalendar(message)
                        }}
                        className="p-1 hover:bg-black/10 rounded"
                        title="Add to calendar"
                      >
                        <Calendar className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        checkFakeNews(message)
                      }}
                      className="p-1 hover:bg-black/10 rounded"
                      title="Fact check"
                    >
                      <Shield className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Event Details */}
                {message.hasEvent && message.eventDetails && (
                  <div className="mt-3 p-3 bg-black/10 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-medium">{message.eventDetails.title}</span>
                    </div>
                    <p className="text-xs opacity-80">{message.eventDetails.description}</p>
                    {message.eventDetails.time && (
                      <p className="text-xs opacity-80 mt-1">Time: {message.eventDetails.time}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Suggestions */}
      {showAiSuggestions && (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-4">
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">AI Suggestions</span>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
                <button
                  onClick={() => handleCopySuggestion(suggestion)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
