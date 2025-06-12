"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send, Bot, Copy, Shield, Calendar, Star, MoreVertical, Phone, Video, Check } from "lucide-react"
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
  const [markingMode, setMarkingMode] = useState<"none" | "start" | "end">("none")
  const [markedMessages, setMarkedMessages] = useState<string[]>([])
  const messagesContainerRef = useRef<HTMLDivElement>(null)

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

  const toggleImportant = (message: Message) => {
    setMessages(
      messages.map((m) => {
        if (m.id === message.id) {
          return { ...m, isImportant: !m.isImportant }
        }
        return m
      }),
    )
  }

  const toggleCalendar = (message: Message) => {
    setMessages(
      messages.map((m) => {
        if (m.id === message.id) {
          return { ...m, hasEvent: !m.hasEvent }
        }
        return m
      }),
    )
  }

  const checkFakeNews = async (message: Message) => {
    // Simulate fake news detection
    const isFake = Math.random() > 0.7 // 30% chance of being fake
    alert(`Fact Check Result: This message appears to be ${isFake ? "potentially misleading" : "reliable"}`)
  }

  const handleMarkMessage = (messageId: string) => {
    if (markingMode === "none") return

    if (markingMode === "start") {
      setMarkedMessages([messageId])
      setMarkingMode("end")
    } else if (markingMode === "end") {
      const startMessageIndex = messages.findIndex((m) => m.id === markedMessages[0])
      const endMessageIndex = messages.findIndex((m) => m.id === messageId)

      if (startMessageIndex !== -1 && endMessageIndex !== -1) {
        const start = Math.min(startMessageIndex, endMessageIndex)
        const end = Math.max(startMessageIndex, endMessageIndex)
        const selectedIds = messages.slice(start, end + 1).map((m) => m.id)
        setMarkedMessages(selectedIds)
      } else {
        setMarkedMessages([...markedMessages, messageId])
      }
      setMarkingMode("none")
    }
  }

  const toggleMarkMessage = (messageId: string) => {
    if (markedMessages.includes(messageId)) {
      setMarkedMessages(markedMessages.filter((id) => id !== messageId))
    } else {
      setMarkedMessages([...markedMessages, messageId])
    }
  }

  const handleSummarize = () => {
    if (markedMessages.length === 0) return

    const selectedMessages = messages.filter((m) => markedMessages.includes(m.id))
    const summary = `Summary of ${selectedMessages.length} messages:
    
${selectedMessages
  .map((m) => `- ${m.senderName}: ${m.content.substring(0, 50)}${m.content.length > 50 ? "..." : ""}`)
  .join("\n")}

Key points:
- Community meeting scheduled for tomorrow at 7 PM
- Elevator maintenance this weekend
- Missing cat reported
- New tax benefits announced

AI generated summary based on selected messages.`

    alert(summary)
    setMarkedMessages([])
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
            <button
              onClick={() => setMarkingMode(markingMode === "none" ? "start" : "none")}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                markingMode !== "none" || markedMessages.length > 0
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {markingMode === "none" && markedMessages.length === 0
                ? "Mark Messages"
                : markingMode === "start"
                  ? "Select Start"
                  : markingMode === "end"
                    ? "Select End"
                    : `${markedMessages.length} Selected`}
            </button>

            <button
              onClick={handleSummarize}
              disabled={markedMessages.length === 0}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-purple-600 dark:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Summarize
            </button>

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
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/50"
        style={{ height: "400px" }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"} group`}
          >
            {markedMessages.includes(message.id) && (
              <div className="flex items-center mr-2">
                <div
                  className="w-5 h-5 rounded border border-indigo-500 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 cursor-pointer"
                  onClick={() => toggleMarkMessage(message.id)}
                >
                  <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            )}

            <div
              className={`relative max-w-xs lg:max-w-md px-6 py-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg ${
                message.senderId === user?.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700"
              } ${selectedMessage?.id === message.id ? "ring-2 ring-indigo-500" : ""}`}
              onClick={() => handleMessageClick(message)}
              onMouseEnter={() => {
                if (markingMode === "start" && markedMessages.length === 0) {
                  // Show "Mark as Start" tooltip
                } else if (markingMode === "end" && markedMessages.length === 1) {
                  // Show "Mark as End" tooltip
                }
              }}
            >
              {message.senderId !== user?.id && (
                <p className="text-xs font-medium mb-2 opacity-70">{message.senderName}</p>
              )}

                <p className="text-sm leading-relaxed">{message.content}</p>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleImportant(message)
                    }}
                    className="p-1 hover:bg-black/10 rounded group"
                    title={message.isImportant ? "Marked as important" : "Mark as important"}
                  >
                    <Star
                      className={`w-3 h-3 ${
                        message.isImportant ? "text-yellow-400 fill-current" : "text-gray-400 dark:text-gray-500"
                      } group-hover:text-yellow-400`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCalendar(message)
                    }}
                    className="p-1 hover:bg-black/10 rounded group"
                    title={message.hasEvent ? "Added to calendar" : "Add to calendar"}
                  >
                    <Calendar
                      className={`w-3 h-3 ${
                        message.hasEvent ? "text-blue-400" : "text-gray-400 dark:text-gray-500"
                      } group-hover:text-blue-400`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      checkFakeNews(message)
                    }}
                    className="p-1 hover:bg-black/10 rounded"
                    title="Check if this is fake news"
                  >
                    <Shield className="w-3 h-3 text-gray-400 dark:text-gray-500 hover:text-red-400" />
                  </button>
                </div>
              </div>

              {markingMode === "start" && markedMessages.length === 0 && (
                <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Mark as Start
                </div>
              )}

              {markingMode === "end" && markedMessages.length === 1 && (
                <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Mark as End
                </div>
              )}
            </div>

            {!markedMessages.includes(message.id) && markingMode !== "none" && (
              <div className="flex items-center ml-2">
                <div
                  className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400"
                  onClick={() => handleMarkMessage(message.id)}
                ></div>
              </div>
            )}
          </div>
        ))}
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