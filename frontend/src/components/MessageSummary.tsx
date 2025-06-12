import React, { useState } from 'react';
import { Bot, TrendingUp, MessageSquare, Clock } from 'lucide-react';

const MessageSummary: React.FC = () => {
  const [insights] = useState({
    totalMessages: 1247,
    importantMessages: 23,
    averageResponseTime: '12 minutes',
    mostActiveChat: 'Green Meadows Community',
    topKeywords: ['meeting', 'maintenance', 'community', 'schedule'],
    sentiment: 'Positive'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
        </div>
        <p className="text-gray-600 mt-1">
          Smart analysis of your community conversations
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Message Stats */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Message Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Messages</span>
                <span className="font-semibold text-gray-900">{insights.totalMessages}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Important Messages</span>
                <span className="font-semibold text-red-600">{insights.importantMessages}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="font-semibold text-green-600">{insights.averageResponseTime}</span>
              </div>
            </div>
          </div>

          {/* Activity Insights */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Activity Insights</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Most Active Chat</span>
                <p className="font-semibold text-gray-900">{insights.mostActiveChat}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Overall Sentiment</span>
                <p className="font-semibold text-green-600">{insights.sentiment}</p>
              </div>
            </div>
          </div>

          {/* Top Keywords */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {insights.topKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">AI Recommendations</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Consider scheduling a community meeting to address maintenance concerns</li>
            <li>• High engagement in evening hours - optimal time for important announcements</li>
            <li>• Positive sentiment indicates good community cohesion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessageSummary;