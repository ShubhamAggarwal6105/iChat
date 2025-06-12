import type React from "react"
import { Star, Quote } from "lucide-react"

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Manager",
      community: "Green Meadows Residential Complex",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "iChat has revolutionized how we manage our community of 500+ residents. The intelligent filtering helps us instantly identify urgent maintenance requests and community announcements. We've reduced response time by 70%!",
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      community: "Tech Entrepreneurs Hub",
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "The AI summarization feature is a game-changer for our entrepreneur group. Instead of scrolling through hundreds of messages, I get concise summaries of important discussions and opportunities. Absolutely brilliant!",
    },
    {
      name: "Lisa Rodriguez",
      role: "Parent Committee Chair",
      community: "Lincoln Elementary PTA",
      avatar:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "The calendar scheduling feature automatically captures all school events and parent meetings from our group chats. No more missed events or double-booking. It's like having a personal assistant!",
    },
    {
      name: "David Kumar",
      role: "Neighborhood Watch Coordinator",
      community: "Riverside Security Group",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "The fake news detection has been crucial for our security group. We can quickly verify information about local incidents before spreading alerts. It's helped maintain trust and accuracy in our communications.",
    },
    {
      name: "Emily Watson",
      role: "Student Body President",
      community: "University Student Union",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "Managing communication for 3000+ students was chaotic until we found iChat. The AI reply suggestions help us respond professionally and consistently to student queries. Our engagement has increased by 200%!",
    },
    {
      name: "Robert Taylor",
      role: "Event Organizer",
      community: "Local Business Network",
      avatar:
        "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "The proactive AI learns from our interaction patterns and suggests relevant responses for networking events and business inquiries. It's like having an experienced community manager working 24/7.",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Loved by Communities
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how iChat is transforming communication for diverse communities across the globe
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 relative group"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-indigo-200 dark:text-indigo-700 group-hover:text-indigo-300 dark:group-hover:text-indigo-600 transition-colors" />

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">"{testimonial.text}"</p>

              {/* User Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{testimonial.community}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
              98%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
              1000+
            </div>
            <div className="text-gray-600 dark:text-gray-400">Active Communities</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
              70%
            </div>
            <div className="text-gray-600 dark:text-gray-400">Time Saved</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-400">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
