'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { user, logout, dbUser, isGuest } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setShowProfileDropdown(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav 
      className="shadow-lg"
      style={{ backgroundColor: darkMode ? '#002855' : '#283B4C' }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center h-14 sm:h-16 md:h-18 lg:h-20 relative">
          {/* Left side - Dark mode toggle */}
          <div className="absolute left-0">
            <button
              onClick={toggleDarkMode}
              className="p-1 sm:p-2"
            >
              <img 
                src={darkMode ? '/toggle/dark.svg' : '/toggle/light.svg'} 
                alt="Toggle theme" 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
              />
            </button>
          </div>
          
          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <img 
                src="/logo.svg" 
                alt="AutoWorth" 
                className="h-6 sm:h-7 md:h-8 lg:h-10"
              />
            </Link>
          </div>
          
          {/* Right side - Profile, Login, or Guest indicator */}
          <div className="absolute right-0">
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-white hover:opacity-80"
                >
                  <span className="hidden sm:block text-white text-sm md:text-base truncate max-w-32 md:max-w-none">
                    {dbUser?.name || user.displayName || user.email}
                  </span>
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full"
                    />
                  )}
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 sm:w-48 md:w-52 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {dbUser && (
                        <div className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                          User ID: {dbUser.user_id}
                        </div>
                      )}
                      <Link
                        href="/history"
                        className="block px-4 py-2 text-sm sm:text-base text-black hover:bg-gray-100 border-t"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        History
                      </Link>
                      <div className="m-2">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full text-center py-2 px-4 text-sm sm:text-base text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                        >
                          {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : isGuest ? (
              <Link
                href="/landing"
                className="text-white hover:opacity-80 font-medium text-sm md:text-base"
              >
                Login
              </Link>
            ) : (
              <Link
                href="/landing"
                className="text-white hover:opacity-80 font-medium text-sm md:text-base"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}