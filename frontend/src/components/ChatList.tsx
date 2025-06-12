"use client"

import type React from "react"
import { Users, User } from "lucide-react"
import type { Chat } from "../types"

interface ChatListProps {
  chats: Chat[]
  selectedChat: Chat | null
  onSelectChat: (chat: Chat) => void
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChat, onSelectChat }) => {
  return (
    <div className="space-y-1 p-3">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
            selectedChat?.id === chat.id
              ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700"
              : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              {chat.avatar ? (
                <img
                  src={chat.avatar || "/placeholder.svg"}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  {chat.type === "group" ? (
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
              )}
              {chat.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {chat.lastMessage.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>

              {chat.lastMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                  {chat.lastMessage.senderName}: {chat.lastMessage.content}
                </p>
              )}

              {chat.type === "group" && chat.members && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{chat.members} members</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ChatList
