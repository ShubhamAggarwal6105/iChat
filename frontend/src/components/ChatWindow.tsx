"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import {
  Send,
  Bot,
  Copy,
  Shield,
  Calendar,
  Star,
  MoreVertical,
  Phone,
  Video,
  Check,
  X,
  AlertTriangle,
} from "lucide-react"
import type { Chat, Message, User } from "../types"
import { apiService, type TelegramMessage } from "../services/api"
import { GoogleGenerativeAI } from "@google/generative-ai"
import SummaryModal from "./SummaryModal"
import { useToast } from "../hooks/useToast"
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "")

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
  const [isLoading, setIsLoading] = useState(false)
  const [markingMode, setMarkingMode] = useState<"none" | "start" | "end">("none")
  const [markedMessages, setMarkedMessages] = useState<string[]>([])
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [aiSuggestionsHeight, setAiSuggestionsHeight] = useState("auto")
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [summaryContent, setSummaryContent] = useState("")

  const { addToast } = useToast()

  // Use ref to track the current chat ID and prevent duplicate requests
  const currentChatId = useRef<string | null>(null)
  const isLoadingRef = useRef(false)

  const fetchMessages = useCallback(
    async (chatId: string) => {
      // Prevent duplicate requests
      if (isLoadingRef.current || currentChatId.current === chatId) {
        return
      }

      isLoadingRef.current = true
      currentChatId.current = chatId
      setIsLoading(true)

      try {
        console.log(`Fetching messages for chat: ${chatId}`)
        const result = await apiService.getMessages(chatId)

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

          // Sort messages by timestamp (oldest first for display)
          const sortedMessages = convertedMessages.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )

          setMessages(sortedMessages)

          // Show toast for AI-detected important messages and events
          const importantCount = sortedMessages.filter((m) => m.isImportant).length
          const eventCount = sortedMessages.filter((m) => m.hasEvent).length
          const fakeNewsCount = sortedMessages.filter((m) => m.isFakeNews).length

          if (importantCount > 0 || eventCount > 0 || fakeNewsCount > 0) {
            const toastMessage = "AI Analysis Complete: "
            const parts = []
            if (importantCount > 0) parts.push(`${importantCount} important message${importantCount > 1 ? "s" : ""}`)
            if (eventCount > 0) parts.push(`${eventCount} event${eventCount > 1 ? "s" : ""} detected`)
            if (fakeNewsCount > 0) parts.push(`${fakeNewsCount} potential misinformation`)

            addToast({
              type: fakeNewsCount > 0 ? "warning" : "info",
              title: "AI Analysis Complete",
              message: parts.join(", "),
            })
          }

          // Notify parent component if callback provided
          if (onMessagesUpdate) {
            onMessagesUpdate(sortedMessages)
          }
        } else {
          console.error("Failed to fetch messages:", result.error)
          setMessages([])
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
        setMessages([])
      } finally {
        setIsLoading(false)
        isLoadingRef.current = false
      }
    },
    [onMessagesUpdate, addToast],
  )

  useEffect(() => {
    if (chat.id && chat.id !== currentChatId.current) {
      fetchMessages(chat.id)
    }
  }, [chat.id, fetchMessages])

  // Reset when chat changes
  useEffect(() => {
    if (chat.id !== currentChatId.current) {
      setMessages([])
      setSelectedMessage(null)
      setShowAiSuggestions(false)
      setMarkingMode("none")
      setMarkedMessages([])
      currentChatId.current = null
    }
  }, [chat.id])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

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

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setShowAiSuggestions(false)
  }

  const generateAiSuggestions = async (selectedMessage: Message) => {
    try {
      // Get the model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

      // Format chat history for context
      const chatHistory = messages.map((msg) => `${msg.senderName}: ${msg.content}`).join("\n")

      // Create the prompt
      const prompt = `Given the following chat history and the selected message, suggest 3 appropriate responses. Each response should be a complete sentence and start on a new line. Do not include numbers, bullet points, or any other formatting.

Chat History:
${chatHistory}

Selected Message:
${selectedMessage.senderName}: ${selectedMessage.content}

Provide exactly 3 responses, one per line:`

      // Generate content
      const result = await model.generateContent(prompt)
      const response = await result.response
      const suggestions = response
        .text()
        .split("\n")
        .map((s) => s.replace(/^\d+\.\s*|\*\*|^[-•]\s*/g, "").trim())
        .filter((s) => s.length > 0 && s.endsWith("."))

      // Take first 3 suggestions
      setAiSuggestions(suggestions.slice(0, 3))
      setShowAiSuggestions(true)
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
    }
  }

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    // Generate AI suggestions for reply
    generateAiSuggestions(message)
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
          const isImportant = !m.isImportant
          addToast({
            type: isImportant ? "success" : "info",
            title: isImportant ? "Message marked as important" : "Message unmarked as important",
            message: `"${m.content.substring(0, 50)}${m.content.length > 50 ? "..." : ""}"`,
          })
          return { ...m, isImportant }
        }
        return m
      }),
    )
  }

  const toggleCalendar = (message: Message) => {
    setMessages(
      messages.map((m) => {
        if (m.id === message.id) {
          const hasEvent = !m.hasEvent
          addToast({
            type: hasEvent ? "success" : "info",
            title: hasEvent ? "Event added to calendar" : "Event removed from calendar",
            message: `"${m.content.substring(0, 50)}${m.content.length > 50 ? "..." : ""}"`,
          })
          return { ...m, hasEvent }
        }
        return m
      }),
    )
  }

  const checkFakeNews = async (message: Message) => {
    if (message.isFakeNews) {
      addToast({
        type: "warning",
        title: "Potential Misinformation Detected",
        message: "This message has been flagged by AI as potentially containing misinformation",
      })
    } else {
      addToast({
        type: "success",
        title: "Fact Check Result",
        message: "This message appears to be reliable based on AI analysis",
      })
    }
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

    setSummaryContent(summary)
    setShowSummaryModal(true)
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
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span>Analyzing messages with AI...</span>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"} group`}
          >
            {markingMode !== "none" && (
              <div className="flex items-center mr-2">
                <div
                  className={`w-5 h-5 rounded border ${
                    markedMessages.includes(message.id)
                      ? "border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }
              flex items-center justify-center cursor-pointer hover:border-indigo-500`}
                  onClick={() => handleMarkMessage(message.id)}
                >
                  {markedMessages.includes(message.id) && (
                    <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
              </div>
            )}

            <div
              className={`relative max-w-xs lg:max-w-md px-6 py-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg ${
                message.senderId === user?.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : `bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border ${
                      message.isFakeNews
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                        : message.isImportant
                          ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10"
                          : "border-gray-200 dark:border-gray-700"
                    }`
              } ${selectedMessage?.id === message.id ? "ring-2 ring-indigo-500" : ""}`}
              onClick={() => handleMessageClick(message)}
            >
              {message.senderId !== user?.id && (
                <p className="text-xs font-medium mb-2 opacity-70">{message.senderName}</p>
              )}

              {/* AI Detection Badges */}
              {(message.isImportant || message.isFakeNews || message.hasEvent) && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {message.isImportant && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Important
                    </span>
                  )}
                  {message.hasEvent && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Event
                    </span>
                  )}
                  {message.isFakeNews && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded-full flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Potential Misinformation
                    </span>
                  )}
                </div>
              )}

              <p className="text-sm leading-relaxed">{message.content}</p>

              {/* Event Details */}
              {message.hasEvent && message.eventDetails && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                      {message.eventDetails.title}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {message.eventDetails.date.toLocaleDateString()} at {message.eventDetails.time}
                  </div>
                  {message.eventDetails.description && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {message.eventDetails.description}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

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
                    title="Check fact verification status"
                  >
                    <Shield
                      className={`w-3 h-3 ${
                        message.isFakeNews ? "text-red-400" : "text-gray-400 dark:text-gray-500"
                      } hover:text-red-400`}
                    />
                  </button>
                </div>
              </div>

              {markingMode === "start" && markedMessages.length === 0 && (
                <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Mark as Start
                </div>
              )}

              {markingMode === "end" && markedMessages.length === 1 && (
                <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Mark as End
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAiSuggestions && (
        <div
          className="p-6 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800"
          style={{ maxHeight: aiSuggestionsHeight, overflow: "auto" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">AI Suggestions</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAiSuggestionsHeight(aiSuggestionsHeight === "auto" ? "100px" : "auto")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {aiSuggestionsHeight === "auto" ? "Collapse" : "Expand"}
              </button>
              <button
                onClick={() => setShowAiSuggestions(false)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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

      <SummaryModal isOpen={showSummaryModal} onClose={() => setShowSummaryModal(false)} summary={summaryContent} />
    </div>
  )
}

export default ChatWindow
