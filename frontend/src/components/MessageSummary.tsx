"use client"

import type React from "react"
import { useState } from "react"
import { Bot } from "lucide-react"

const MessageSummary: React.FC = () => {
  const [insights] = useState({
    totalMessages: 1247,
    importantMessages: 23,
    averageResponseTime: "12 minutes",
    mostActiveChat: "Green Meadows Community",
    topKeywords: ["meeting", "maintenance", "community", "schedule"],
    sentiment: "Positive",
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Insights</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Smart analysis of your community conversations</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Message Stats */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white text-lg">Message Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{insights.totalMessages}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Important Messages</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">{insights.importantMessages}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {insights.averageResponseTime}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30 h-full">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-lg">AI Recommendations</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>Consider scheduling a community meeting to address maintenance concerns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>High engagement in evening hours - optimal time for important announcements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>Positive sentiment indicates good community cohesion</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Activity Insights */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white text-lg">Activity Insights</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                    Most Active Chat
                  </span>
                  <p className="font-semibold text-gray-900 dark:text-white">{insights.mostActiveChat}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                    Overall Sentiment
                  </span>
                  <p className="font-semibold text-green-600 dark:text-green-400">{insights.sentiment}</p>
                </div>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white text-lg">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {insights.topKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm rounded-full font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageSummary