'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();

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
    // Navigate to home page as guest
    router.push('/');
  };

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Dark mode toggle - positioned absolutely */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-4 right-4 z-10 text-sm px-3 py-2 rounded-md ${
          darkMode 
            ? 'text-white bg-gray-800 hover:bg-gray-700' 
            : 'text-gray-600 bg-white hover:bg-gray-50'
        } border transition-colors`}
      >
        {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
      </button>

      {/* Left Section - White/Dark */}
      <div className={`w-full lg:w-[60%] xl:w-[59.9%] flex flex-col justify-center items-center px-8 lg:px-0 ${
        darkMode ? 'bg-[#001233]' : 'bg-white'
      }`}>
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
            <div className="mb-6 text-red-600 text-sm text-center bg-red-50 p-3 rounded-md w-full max-w-[518px]">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full max-w-[518px] h-[86px] border rounded-md flex items-center justify-center gap-4 mb-8 transition-colors ${
              darkMode 
                ? 'border-white bg-white text-black hover:bg-gray-100' 
                : 'border-gray-300 bg-transparent hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-[42px] w-[42px] border-b-2 border-current"></div>
            ) : (
              <>
                <div className="w-[42px] h-[42px] flex items-center justify-center">
                  <svg className="w-[42px] h-[42px]" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.18-1.36 3.463-5.262 3.463-3.167 0-5.75-2.62-5.75-5.841s2.583-5.841 5.75-5.841c1.805 0 3.017.77 3.713 1.432l2.54-2.47C17.07 3.71 15.13 2.75 12.625 2.75c-5.02 0-9.09 4.07-9.09 9.09s4.07 9.09 9.09 9.09c5.24 0 8.715-3.68 8.715-8.88 0-.6-.07-1.06-.16-1.53z"/>
                    <path fill="#EA4335" d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.18-1.36 3.463-5.262 3.463-3.167 0-5.75-2.62-5.75-5.841s2.583-5.841 5.75-5.841c1.805 0 3.017.77 3.713 1.432l2.54-2.47C17.07 3.71 15.13 2.75 12.625 2.75c-5.02 0-9.09 4.07-9.09 9.09s4.07 9.09 9.09 9.09c5.24 0 8.715-3.68 8.715-8.88 0-.6-.07-1.06-.16-1.53z"/>
                    <path fill="#FBBC05" d="M12.625 21.25c2.505 0 4.445-.83 5.927-2.26l-2.73-2.23c-.74.5-1.7.8-3.197.8-2.45 0-4.53-1.65-5.27-3.87l-3.23 2.5c1.29 2.97 4.13 5.06 8.5 5.06z"/>
                    <path fill="#34A853" d="M3.535 11.591c0-.88.155-1.73.43-2.52l-3.23-2.5C.26 8.15 0 9.82 0 11.591s.26 3.44.735 4.98l3.23-2.5c-.275-.79-.43-1.64-.43-2.52z"/>
                  </svg>
                </div>
                <span 
                  className={`font-semibold ${darkMode ? 'text-black' : 'text-black'}`}
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(1.25rem, 2vw, 2rem)'
                  }}
                >
                  Google Login
                </span>
              </>
            )}
          </button>

          {/* OR Divider */}
          <div className="w-full max-w-[518px] flex items-center justify-center mb-8">
            <div className={`h-[1px] flex-1 max-w-[288px] ${darkMode ? 'bg-white' : 'bg-gray-300'}`}></div>
            <span 
              className={`mx-4 ${darkMode ? 'text-white' : 'text-black'}`}
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                fontWeight: '400'
              }}
            >
              OR
            </span>
            <div className={`h-[1px] flex-1 max-w-[288px] ${darkMode ? 'bg-white' : 'bg-gray-300'}`}></div>
          </div>

          {/* Guest Button */}
          <button
            onClick={handleGuestAccess}
            className={`w-full max-w-[518px] h-[86px] border rounded-md flex items-center justify-center gap-4 transition-colors ${
              darkMode 
                ? 'border-white bg-white text-black hover:bg-gray-100' 
                : 'border-gray-300 bg-transparent hover:bg-gray-50'
            }`}
          >
            <div className="w-[42px] h-[42px] flex items-center justify-center">
              <svg className="w-[42px] h-[42px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span 
              className={`font-semibold ${darkMode ? 'text-black' : 'text-black'}`}
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1.25rem, 2vw, 2rem)'
              }}
            >
              Guest
            </span>
          </button>
        </div>
      </div>

      {/* Right Section - Blue/Dark Blue */}
      <div className={`hidden lg:flex lg:w-[40%] xl:w-[40.1%] flex-col justify-center items-center px-8 ${
        darkMode ? 'bg-[#010E27]' : 'bg-[#9EDDEF]'
      }`}>
        <div className="text-center">
          <h2 
            className="leading-tight"
            style={{ 
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 6rem)',
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

      {/* Mobile version of right section content */}
      <div className={`lg:hidden w-full text-center py-8 ${
        darkMode ? 'bg-[#010E27]' : 'bg-[#9EDDEF]'
      }`}>
        <h2 
          className="leading-tight px-4"
          style={{ 
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: '600'
          }}
        >
          <span className={darkMode ? 'text-[#9EDDEF]' : 'text-[#001233]'}>
            Save your car searches,{' '}
          </span>
          <span className={darkMode ? 'text-white' : 'text-[#023E7D]'}>
            get the full experience.
          </span>
        </h2>
      </div>
    </div>
  );
}