import React from 'react';
import { MessageCircle, Mail, Shield, Users, Zap, Calendar } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">iChat</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Revolutionizing community communication with AI-powered intelligent messaging. 
              Filter, highlight, and enhance your group conversations with cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-gray-300">Trusted by 1000+ Communities</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-300">Smart Filtering</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-300">Fake News Detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-300">Auto Scheduling</span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-300">AI Summaries</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@ichat.com" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>support@ichat.com</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 iChat. Built with ❤️ for smarter community communication.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;