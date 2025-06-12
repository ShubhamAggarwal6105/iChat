// 4. Fix the AI recommendations overflow issue
import type React from "react"
import { Bot } from "lucide-react"

const MessageSummary: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Recommendations</h2>
        </div>
      </div>

      <div className="p-6 max-h-[300px] overflow-y-auto">
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="min-w-4 h-4 mt-1 mr-2 text-indigo-600 dark:text-indigo-400">•</div>
            <p className="text-gray-700 dark:text-gray-300">
              Consider scheduling a community meeting to address maintenance concerns
            </p>
          </li>
          <li className="flex items-start">
            <div className="min-w-4 h-4 mt-1 mr-2 text-indigo-600 dark:text-indigo-400">•</div>
            <p className="text-gray-700 dark:text-gray-300">
              High engagement in evening hours - optimal time for important announcements
            </p>
          </li>
          <li className="flex items-start">
            <div className="min-w-4 h-4 mt-1 mr-2 text-indigo-600 dark:text-indigo-400">•</div>
            <p className="text-gray-700 dark:text-gray-300">Positive sentiment indicates good community cohesion</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MessageSummary
