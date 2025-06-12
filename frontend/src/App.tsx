"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import Chats from "./pages/Chats"
import type { User } from "./types"
import { apiService } from "./services/api"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const result = await apiService.checkAuthentication()
      if (result.success && result.data?.is_authenticated && result.data.user_data) {
        const userData = {
          id: result.data.user_data.id,
          name: result.data.user_data.name,
          username: result.data.user_data.username,
          avatar: result.data.user_data.avatar,
          telegramId: result.data.user_data.phone,
        }
        setUser(userData)
        setIsLoggedIn(true)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem("ichat_user", JSON.stringify(userData))
  }

  const handleLogout = async () => {
    await apiService.logout()
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("ichat_user")
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <Navbar isLoggedIn={isLoggedIn} user={user} onLogin={handleLogin} onLogout={handleLogout} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/" />} />
              <Route path="/chats" element={isLoggedIn ? <Chats user={user} /> : <Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
