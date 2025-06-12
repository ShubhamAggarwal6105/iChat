import type React from "react"
import { Filter, MessageSquare, Calendar, Shield, Brain, Sparkles } from "lucide-react"

const Features: React.FC = () => {
  const features = [
    {
      icon: Filter,
      title: "Intelligent Filtering & Highlighting",
      description:
        "Advanced NLP algorithms automatically identify and prioritize relevant messages based on context, not just keywords. Filter by date, importance, or custom criteria.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: MessageSquare,
      title: "Smart Summarization",
      description:
        "Get concise, AI-generated summaries of your group conversations. Choose your timeframe and receive intelligently crafted summaries with beautiful UI presentation.",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Brain,
      title: "Proactive AI Assistant",
      description:
        "Self-learning AI provides contextual reply suggestions and personalized recommendations. Copy suggestions or let AI frame your thoughts into meaningful responses.",
      gradient: "from-green-500 to-teal-600",
    },
    {
      icon: Shield,
      title: "Fake News Detection",
      description:
        "Multi-modal AI system powered by advanced models detects and flags potentially false information, helping maintain community trust and accuracy.",
      gradient: "from-red-500 to-orange-600",
    },
    {
      icon: Calendar,
      title: "Auto Calendar Scheduling",
      description:
        "Automatically extracts meeting invites, calls, and important tasks from messages to generate a user-friendly schedule. Never miss important community events.",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: Sparkles,
      title: "Seamless Integration",
      description:
        "Works as a wrapper around existing platforms like Telegram and WhatsApp. Continue using your preferred chat apps with enhanced AI capabilities.",
      gradient: "from-yellow-500 to-orange-600",
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful AI Features for
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Modern Communities
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the future of community communication with our comprehensive suite of AI-powered tools
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <button className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    Learn More →
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Community Communication?</h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of communities already using iChat to enhance their messaging experience
            </p>
            <button className="bg-white dark:bg-gray-100 text-indigo-600 dark:text-indigo-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors shadow-lg">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
