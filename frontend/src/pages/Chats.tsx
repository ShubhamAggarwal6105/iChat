"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, MessageSquare, Bot, Plus } from "lucide-react"
import type { User, Chat, Message } from "../types"
import ChatList from "../components/ChatList"
import ChatWindow from "../components/ChatWindow"
import FilterModal from "../components/FilterModal"
import SummarizeModal from "../components/SummarizeModal"
import { apiService, type TelegramGroup } from "../services/api"

interface ChatsProps {
  user: User | null
}

const Chats: React.FC<ChatsProps> = ({ user }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSummarizeModal, setShowSummarizeModal] = useState(false)
  const [markedMessages, setMarkedMessages] = useState<string[]>([])

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoadingChats(true)
      try {
        const result = await apiService.getGroups()
        if (result.success && result.data) {
          // Convert Telegram groups to Chat format
          const convertedChats: Chat[] = result.data.groups.map((group: TelegramGroup) => ({
            id: group.id,
            name: group.name,
            type: group.type,
            avatar: group.avatar,
            unreadCount: group.unreadCount,
            members: group.members,
            lastMessage: group.lastMessage
              ? {
                  ...group.lastMessage,
                  timestamp: new Date(group.lastMessage.timestamp),
                }
              : undefined,
          }))
          setChats(convertedChats)
        } else {
          console.error("Failed to fetch groups:", result.error)
        }
      } catch (error) {
        console.error("Error fetching groups:", error)
      } finally {
        setIsLoadingChats(false)
      }
    }

    if (user) {
      fetchGroups()
    }
  }, [user])

  const handleMessagesUpdate = (updatedMessages: Message[]) => {
    setMessages(updatedMessages)
  }

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your community conversations with AI-powered features
              </p>
            </div>

            {/* AI Feature Buttons */}
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Filter className="w-4 h-4" />
                <span>Smart Filter</span>
              </button>

              <button
                onClick={() => setShowSummarizeModal(true)}
                disabled={markedMessages.length === 0}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Bot className="w-4 h-4" />
                <span>Summarize</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col overflow-hidden">
              {/* Chat List Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chats</h2>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingChats ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading chats...</span>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No chats found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {searchTerm ? "Try a different search term" : "Join some groups to get started"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <ChatList chats={filteredChats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
                )}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] overflow-hidden">
              {selectedChat ? (
                <ChatWindow
                  chat={selectedChat}
                  messages={messages}
                  user={user}
                  onMessagesUpdate={handleMessagesUpdate}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Select a chat to start messaging
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                      Choose a conversation from the sidebar to view messages and start chatting with your community
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
            console.log("Applying filters:", filters)
            setShowFilterModal(false)
          }}
        />
      )}

      {showSummarizeModal && (
        <SummarizeModal
          isOpen={showSummarizeModal}
          onClose={() => setShowSummarizeModal(false)}
          chats={chats}
          onGenerateSummary={(options) => {
            console.log("Generating summary:", options)
            setShowSummarizeModal(false)
          }}
        />
      )}
    </div>
  )
}

export default Chats
