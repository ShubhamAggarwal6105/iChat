"use client"

import type React from "react"
import { useState } from "react"
import { X, MessageCircle, ArrowLeft } from "lucide-react"
import type { User } from "../types"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: User) => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [step, setStep] = useState<"platform" | "phone" | "otp">("platform")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleTelegramLogin = () => {
    setStep("phone")
  }

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a valid phone number")
      return
    }
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")
    }, 1500)
  }

  const handleOtpSubmit = async () => {
    if (!otp.trim() || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP")
      return
    }
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: "1",
        name: "John Doe",
        username: "johndoe",
        avatar:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        telegramId: phoneNumber,
      }
      onLogin(mockUser)
      setIsLoading(false)
      onClose()
      // Reset state
      setStep("platform")
      setPhoneNumber("")
      setOtp("")
    }, 1500)
  }

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone")
    } else if (step === "phone") {
      setStep("platform")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {step !== "platform" && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to iChat</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {step === "platform" && "Sign in to access your smart messaging experience"}
            {step === "phone" && "Enter your phone number to continue"}
            {step === "otp" && "Enter the verification code sent to your phone"}
          </p>
        </div>

        {/* Platform Selection */}
        {step === "platform" && (
          <div className="space-y-4">
            <button
              onClick={handleTelegramLogin}
              className="w-full flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Continue with Telegram</span>
            </button>

            <div className="relative">
              <button
                disabled
                className="w-full flex items-center justify-center space-x-3 bg-gray-100 dark:bg-gray-800 text-gray-400 py-4 px-6 rounded-xl font-medium cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Continue with WhatsApp</span>
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-900 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 rounded-full">
                  COMING SOON
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              By continuing, you agree to our{" "}
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        )}

        {/* Phone Number Input */}
        {step === "phone" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                "Send Verification Code"
              )}
            </button>
          </div>
        )}

        {/* OTP Input */}
        {step === "otp" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                maxLength={6}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Code sent to {phoneNumber}</p>
            </div>

            <button
              onClick={handleOtpSubmit}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                "Verify & Login"
              )}
            </button>

            <button
              onClick={() => setStep("phone")}
              className="w-full text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
            >
              Resend Code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginModal
