"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const FAQ: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  const faqs = [
    {
      question: "How does iChat integrate with existing messaging platforms?",
      answer:
        "iChat works as an intelligent wrapper around popular platforms like Telegram and WhatsApp. You continue using your preferred chat applications, while iChat enhances them with AI-powered features like filtering, summarization, and smart replies. Our integration is seamless and doesn't require changing your existing workflow.",
    },
    {
      question: "What makes iChat's AI filtering different from simple keyword searches?",
      answer:
        "Our advanced NLP (Natural Language Processing) algorithms understand context, sentiment, and relevance rather than just matching keywords. This means iChat can identify important messages even when they don't contain obvious keywords, and it learns from your community's communication patterns to improve accuracy over time.",
    },
    {
      question: "How accurate is the fake news detection feature?",
      answer:
        "Our multi-modal AI system combines text analysis, source verification, and pattern recognition to achieve 95% accuracy in detecting potentially false information. The system is continuously updated with the latest misinformation patterns and works across multiple languages and content types.",
    },
    {
      question: "Can iChat handle large community groups with thousands of members?",
      answer:
        "Absolutely! iChat is designed to scale from small neighborhood groups to large communities with thousands of members. Our infrastructure can process millions of messages daily while maintaining real-time performance. Larger communities actually benefit more from our AI features due to the higher volume of content to filter and organize.",
    },
    {
      question: "How does the calendar scheduling feature work?",
      answer:
        "iChat automatically scans your group messages for date/time references, meeting invites, and event mentions. It extracts this information using advanced text processing and creates calendar entries with relevant details. You can review and approve these entries before they're added to your calendar, ensuring accuracy and control.",
    },
    {
      question: "Is my community's data secure and private?",
      answer:
        "Data security is our top priority. All messages are processed using end-to-end encryption, and we never store personal conversations. Our AI processing happens in secure, isolated environments, and we comply with GDPR, CCPA, and other privacy regulations. You maintain full control over your data at all times.",
    },
    {
      question: "How does the self-learning AI improve over time?",
      answer:
        "Our AI learns from user interactions, feedback, and community-specific patterns while maintaining privacy. It adapts to your community's communication style, frequently discussed topics, and member preferences to provide increasingly relevant suggestions and filtering. The more you use iChat, the smarter it becomes for your specific community.",
    },
    {
      question: "What pricing plans are available?",
      answer:
        "We offer flexible pricing tiers: Free for small communities (up to 50 members), Pro for growing communities (up to 500 members), and Enterprise for large organizations. All plans include core AI features, with advanced analytics and custom integrations available in higher tiers. Contact us for custom pricing on enterprise solutions.",
    },
    {
      question: "How quickly can we get started with iChat?",
      answer:
        "Getting started is incredibly simple! Most communities are up and running within 5 minutes. Just sign up, connect your existing messaging platform (Telegram or WhatsApp), and our AI immediately begins analyzing and enhancing your communications. No complex setup or technical expertise required.",
    },
    {
      question: "Does iChat work in multiple languages?",
      answer:
        "Yes! iChat supports over 50 languages and can handle multilingual communities seamlessly. Our AI understands context and nuance across different languages, and features like summarization and filtering work effectively regardless of the primary language used in your community.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about iChat and how it can transform your community communication
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </div>
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-6">Still have questions?</p>
          <button className="bg-indigo-600 dark:bg-indigo-700 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors font-semibold">
            Contact Our Team
          </button>
        </div>
      </div>
    </section>
  )
}

export default FAQ