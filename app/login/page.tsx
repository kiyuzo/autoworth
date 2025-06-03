'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithGoogle, user, setGuestMode } = useAuth();
  const router = useRouter();

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // The redirect will be handled by the useEffect above
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Set guest mode and navigate to home page
    setGuestMode(true);
    router.push('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: darkMode ? '#001233' : 'white' }}>
      {/* Navbar */}
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
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Section - White/Dark */}
        <div className="w-full lg:w-[60%] xl:w-[59.9%] flex flex-col justify-center items-center px-8 lg:px-0 min-h-[calc(100vh-5rem)]">
          <div className="w-full max-w-[600px] flex flex-col items-center">
            {/* Welcome Back Title */}
            <h1 
              className={`font-semibold text-center mb-8 lg:mb-16 ${
                darkMode ? 'text-white' : 'text-black'
              }`}
              style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 4rem)',
                lineHeight: '1.2'
              }}
            >
              Welcome back
            </h1>

            {/* Error Message */}
            {error && (
              <div className="mb-6 text-red-600 text-sm text-center bg-red-50 p-3 rounded-md w-full max-w-[400px]">
                {error}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full max-w-[400px] h-[60px] border rounded-lg flex items-center justify-center px-6 mb-6 transition-colors relative ${
                darkMode 
                  ? 'border-white bg-white text-black hover:bg-gray-100' 
                  : 'border-gray-300 bg-transparent hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span 
                className={`font-semibold ${darkMode ? 'text-black' : 'text-black'}`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.25rem'
                }}
              >
                Google Login
              </span>
              {isLoading ? (
                <div className="animate-spin rounded-full h-[24px] w-[24px] border-b-2 border-current absolute right-6"></div>
              ) : (
                <img src="/google.svg" alt="Google" className="w-[24px] h-[24px] absolute right-6" />
              )}
            </button>

            {/* OR Divider */}
            <div className="w-full max-w-[400px] flex items-center justify-center mb-6">
              <div className={`h-[1px] flex-1 ${darkMode ? 'bg-white' : 'bg-gray-300'}`}></div>
              <span 
                className={`mx-4 ${darkMode ? 'text-white' : 'text-black'}`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  fontWeight: '400'
                }}
              >
                OR
              </span>
              <div className={`h-[1px] flex-1 ${darkMode ? 'bg-white' : 'bg-gray-300'}`}></div>
            </div>

            {/* Guest Button */}
            <button
              onClick={handleGuestAccess}
              className={`w-full max-w-[400px] h-[60px] border rounded-lg flex items-center justify-center px-6 transition-colors relative ${
                darkMode 
                  ? 'border-white bg-white text-black hover:bg-gray-100' 
                  : 'border-gray-300 bg-transparent hover:bg-gray-50'
              }`}
            >
              <span 
                className={`font-semibold ${darkMode ? 'text-black' : 'text-black'}`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.25rem'
                }}
              >
                Guest
              </span>
              <img src="/person.svg" alt="Person" className="w-[24px] h-[24px] absolute right-6" />
            </button>
          </div>
        </div>

        {/* Right Section - Blue/Dark Blue - Hidden on mobile */}
        <div className={`hidden lg:flex lg:w-[40%] xl:w-[40.1%] flex-col justify-center items-start px-8 ${
          darkMode ? 'bg-[#010E27]' : 'bg-[#9EDDEF]'
        }`}>
          <div className="text-start ml-8">
            <h2 
              className="leading-tight"
              style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 4.5rem)',
                fontWeight: '600'
              }}
            >
              <span className={darkMode ? 'text-[#9EDDEF]' : 'text-[#001233]'}>
                Save your car searches,{' '}
              </span>
              <br />
              <span className={darkMode ? 'text-white' : 'text-[#023E7D]'}>
                get the full experience.
              </span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}