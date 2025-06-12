import type React from "react"
import { Sparkles, ArrowRight, MessageCircle, Users, Zap } from "lucide-react"

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-300"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Community Messaging</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Smart Messaging for
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smarter Communities
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Filter noise, highlight importance, and enhance communication with AI-powered intelligent messaging designed
            for modern community groups.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Communities</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Messages Processed</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all duration-300 text-lg font-semibold">
              Watch Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Trusted by communities worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">Green Meadows</div>
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">Tech Hub</div>
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">Student Union</div>
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">Neighborhood Watch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
