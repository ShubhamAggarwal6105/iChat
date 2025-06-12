"use client"

import type React from "react"
import { useState } from "react"
import { X, Bot, Calendar, MessageSquare } from "lucide-react"
import type { Chat, SummaryOptions } from "../types"

interface SummarizeModalProps {
  isOpen: boolean
  onClose: () => void
  chats: Chat[]
  onGenerateSummary: (options: SummaryOptions) => void
}

const SummarizeModal: React.FC<SummarizeModalProps> = ({ isOpen, onClose, chats, onGenerateSummary }) => {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedChatId, setSelectedChatId] = useState("")
  const [summary, setSummary] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handleGenerate = async () => {
    if (!dateFrom || !dateTo) {
      alert("Please select both start and end dates")
      return
    }

    setIsGenerating(true)

    // Simulate API call to generate summary
    setTimeout(() => {
      const mockSummary = `
**Summary for ${selectedChatId ? chats.find((c) => c.id === selectedChatId)?.name : "All Chats"}**
*${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()}*

**Key Highlights:**
• Community meeting scheduled for tomorrow at 7 PM in the main hall
• Elevator maintenance in Building A this weekend (9 AM - 5 PM)
• New tax benefits announced for residential communities
• Missing cat report from Carol Davis - orange tabby

**Important Announcements:** 3
**Events Scheduled:** 2
**Maintenance Updates:** 1
**Community Concerns:** 1

**Action Items:**
• Attend community meeting tomorrow
• Plan alternative access for Building A residents during elevator maintenance
• Keep an eye out for missing cat

This summary was generated using AI analysis of ${Math.floor(Math.random() * 100) + 50} messages.
      `
      setSummary(mockSummary)
      setIsGenerating(false)
    }, 2000)

    const options: SummaryOptions = {
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
      chatId: selectedChatId || undefined,
    }
    onGenerateSummary(options)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Summarization</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Select Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Chat Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Select Chat (Optional)
            </label>
            <select
              value={selectedChatId}
              onChange={(e) => setSelectedChatId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Chats</option>
              {chats.map((chat) => (
                <option key={chat.id} value={chat.id}>
                  {chat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !dateFrom || !dateTo}
          className="w-full bg-purple-600 dark:bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed mb-6 flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating Summary...</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>Generate AI Summary</span>
            </>
          )}
        </button>

        {/* Summary Display */}
        {summary && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Generated Summary</h3>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">{summary}</pre>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Close
          </button>
          {summary && (
            <button
              onClick={() => navigator.clipboard.writeText(summary)}
              className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
            >
              Copy Summary
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SummarizeModal
