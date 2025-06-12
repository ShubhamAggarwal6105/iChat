import React, { useState, useEffect } from 'react';
import { Calendar, MessageSquare, TrendingUp, Shield, Clock, Users } from 'lucide-react';
import { User, Chat, Message, EventDetails } from '../types';
import CalendarView from '../components/CalendarView';
import MessageSummary from '../components/MessageSummary';

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    importantMessages: 0,
    upcomingEvents: 0
  });
  const [recentActivity, setRecentActivity] = useState<Message[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventDetails[]>([]);

  useEffect(() => {
    // Simulate loading dashboard data
    setStats({
      totalChats: 12,
      totalMessages: 1247,
      importantMessages: 23,
      upcomingEvents: 5
    });

    // Mock recent activity
    setRecentActivity([
      {
        id: '1',
        chatId: 'chat1',
        senderId: 'user1',
        senderName: 'Alice Johnson',
        content: 'Community meeting scheduled for tomorrow at 7 PM',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isImportant: true,
        hasEvent: true
      },
      {
        id: '2',
        chatId: 'chat2',
        senderId: 'user2',
        senderName: 'Bob Smith',
        content: 'Maintenance work will be done on the elevator this weekend',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isImportant: true
      }
    ]);

    // Mock upcoming events
    setUpcomingEvents([
      {
        title: 'Community Meeting',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        time: '7:00 PM',
        description: 'Monthly community meeting to discuss upcoming projects',
        type: 'meeting'
      },
      {
        title: 'Maintenance Work',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: '9:00 AM',
        description: 'Elevator maintenance - Building A',
        type: 'task'
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your communities today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChats}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Important Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.importantMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((message) => (
                    <div key={message.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{message.senderName}</p>
                          {message.isImportant && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Important
                            </span>
                          )}
                          {message.hasEvent && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Event
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{message.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {event.date.toLocaleDateString()} at {event.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8">
          <MessageSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;