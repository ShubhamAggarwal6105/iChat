"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { MessageCircle, User, LogOut, ChevronDown, Sun, Moon } from "lucide-react"
import type { User as UserType } from "../types"
import { useTheme } from "../contexts/ThemeContext"
import LoginModal from "./LoginModal"

interface NavbarProps {
  isLoggedIn: boolean
  user: UserType | null
  onLogin: (user: UserType) => void
  onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, user, onLogin, onLogout }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const isActivePage = (path: string) => {
    return location.pathname === path
  }

  return (
    <>
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                iChat
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-medium transition-colors ${
                  isActivePage("/")
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                Home
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    to="/dashboard"
                    className={`font-medium transition-colors ${
                      isActivePage("/dashboard")
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/chats"
                    className={`font-medium transition-colors ${
                      isActivePage("/chats")
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    Chats
                  </Link>
                </>
              )}
            </div>

            {/* Theme Toggle and Auth Section */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {!isLoggedIn ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Login
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <span className="font-medium">{user?.name || "User"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">{user?.name || "User"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
                      </div>
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={onLogin} />
    </>
  )
}

export default Navbar
