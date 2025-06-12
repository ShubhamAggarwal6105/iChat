import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, User, LogOut, ChevronDown } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  isLoggedIn: boolean;
  user: UserType | null;
  onLogin: (user: UserType) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, user, onLogin, onLogout }) => {
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const handleTelegramLogin = () => {
    // Simulate Telegram login - in real app, this would integrate with Telegram API
    const mockUser: UserType = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      telegramId: '123456789'
    };
    onLogin(mockUser);
    setIsLoginDropdownOpen(false);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
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
                isActivePage('/') 
                  ? 'text-indigo-600' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium transition-colors ${
                    isActivePage('/dashboard') 
                      ? 'text-indigo-600' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/chats" 
                  className={`font-medium transition-colors ${
                    isActivePage('/chats') 
                      ? 'text-indigo-600' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Chats
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {!isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <span>Login</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isLoginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                    <button 
                      onClick={handleTelegramLogin}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Login with Telegram</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-400 cursor-not-allowed flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Login with WhatsApp (Coming Soon)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <span className="font-medium">{user?.name || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500">@{user?.username}</p>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
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
  );
};

export default Navbar;