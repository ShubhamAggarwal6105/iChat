"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, MessageSquare, TrendingUp, Shield, Users, ChevronLeft, ChevronRight, X, Clock } from "lucide-react"
import type { User, Message, EventDetails } from "../types"
import MessageSummary from "../components/MessageSummary"

interface DashboardProps {
  user: User | null
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<"messages" | "events">("messages")
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    importantMessages: 0,
    upcomingEvents: 0,
  })
  const [recentActivity, setRecentActivity] = useState<Message[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<EventDetails[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())

  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)

  // Mock events for calendar highlighting
  const calendarEvents = [
    { date: new Date(), event: upcomingEvents[0] },
    { date: new Date(Date.now() + 24 * 60 * 60 * 1000), event: upcomingEvents[1] },
    { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), event: upcomingEvents[2] },
  ]

  const getEventForDate = (day: number) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return calendarEvents.find(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear(),
    )
  }

  const handleDateClick = (day: number) => {
    const eventForDate = getEventForDate(day)
    if (eventForDate) {
      setSelectedEvent(eventForDate.event)
      setShowEventModal(true)
    }
  }

  useEffect(() => {
    // Simulate loading dashboard data
    setStats({
      totalChats: 12,
      totalMessages: 1247,
      importantMessages: 23,
      upcomingEvents: 5,
    })

    // Mock recent activity
    setRecentActivity([
      {
        id: "1",
        chatId: "chat1",
        senderId: "user1",
        senderName: "Alice Johnson",
        content: "Community meeting scheduled for tomorrow at 7 PM in the main hall",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isImportant: true,
        hasEvent: true,
      },
      {
        id: "2",
        chatId: "chat2",
        senderId: "user2",
        senderName: "Bob Smith",
        content: "Maintenance work will be done on the elevator this weekend",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isImportant: true,
      },
      {
        id: "3",
        chatId: "chat3",
        senderId: "user3",
        senderName: "Carol Davis",
        content: "Weekend barbecue event planning discussion",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        hasEvent: true,
      },
    ])

    // Mock upcoming events
    setUpcomingEvents([
      {
        title: "Community Meeting",
        date: new Date(),
        time: "6:00 PM",
        description: "Building A, Conference Room",
        type: "meeting",
      },
      {
        title: "Maintenance Notice",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        time: "9:00 AM - 12:00 PM",
        description: "All Buildings",
        type: "task",
      },
      {
        title: "Weekend Barbecue",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: "4:00 PM",
        description: "Community Garden",
        type: "event",
      },
    ])
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const today = new Date()

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear()

      const hasEvent = getEventForDate(day)

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-8 flex items-center justify-center text-sm cursor-pointer rounded-lg transition-all ${
            isToday
              ? "bg-indigo-600 text-white"
              : hasEvent
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          } ${hasEvent ? "font-semibold" : ""}`}
        >
          {day}
          {hasEvent && <div className="absolute w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full mt-6"></div>}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Here's what's happening in your communities today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalChats}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Important Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.importantMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("messages")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "messages"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Recent Messages
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "events"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Upcoming Events
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "messages" ? (
          <div className="grid grid-cols-1 gap-8">
            {/* Recent Activity */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900 dark:text-white">{message.senderName}</p>
                            {message.isImportant && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs rounded-full">
                                Important
                              </span>
                            )}
                            {message.hasEvent && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                                Event
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{message.content}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div>
              <MessageSummary />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Events List */}
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {event.date.toDateString() === new Date().toDateString() ? "Today" : "Tomorrow"}, {event.time}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Calendar</h2>
                  <p className="text-gray-600 dark:text-gray-400">View and manage your schedule</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Details</h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedEvent.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedEvent.description}</p>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedEvent.date.toLocaleDateString()}</span>
                </div>

                {selectedEvent.time && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{selectedEvent.time}</span>
                  </div>
                )}

                <div className="pt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      selectedEvent.type === "meeting"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        : selectedEvent.type === "task"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                    }`}
                  >
                    {selectedEvent.type}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors">
                  Remove from Calendar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard