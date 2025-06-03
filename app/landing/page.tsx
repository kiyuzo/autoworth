'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function Landing() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { user, isGuest, signInWithGoogle, setGuestMode } = useAuth();

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Redirect authenticated users to home page (but allow guest users to stay)
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleTryNow = () => {
    // Navigate to login page for authentication options
    router.push('/login');
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Will be redirected by useEffect after successful login
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  const handleGuestMode = () => {
    setGuestMode(true);
    router.push('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#001233]' : 'bg-[#9EDDEF]'}`}>
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

      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-5rem)] px-4">
        <div className="flex flex-col items-center justify-center w-full max-w-7xl">
          {/* Text Container */}
          <div 
            className="text-center mb-4 lg:mb-8"
            style={{
              maxWidth: '1555px',
              minHeight: '252px'
            }}
          >
            <h1 
              className="leading-tight"
              style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: '800', // Extrabold
                fontSize: 'clamp(1.5rem, 4vw, 4.5rem)', // Reduced from clamp(2rem, 5.2vw, 6.25rem)
                lineHeight: '1.1'
              }}
            >
              <span className={darkMode ? 'text-[#9EDDEF]' : 'text-[#000000]'}>
                Clear Prices, Confident Choices
              </span>
              <br />
              <span className={darkMode ? 'text-white' : 'text-[#023E7D]'}>
                Fast, Free, Every Time.
              </span>
            </h1>
          </div>

          {/* Try Now Button */}
          <button
            onClick={handleTryNow}
            className={`rounded-5xl transition-all duration-200 hover:scale-105 active:scale-95 ${
              darkMode ? 'bg-[#81C3D7]' : 'bg-[#001233]'
            }`}
            style={{
              width: 'clamp(180px, 20vw, 320px)', // More responsive width
              height: 'clamp(50px, 6vw, 100px)', // More responsive height
              borderRadius: '5rem', // 5xl rounded
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span
              className={darkMode ? 'text-[#283B4C]' : 'text-[#F1F4F5]'}
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: '700', // Bold
                fontSize: 'clamp(1rem, 2.2vw, 2.2rem)' // More responsive font size
              }}
            >
              Try Now
            </span>
          </button>
        </div>
      </div>

      {/* Mobile-specific adjustments */}
      <style jsx>{`
        @media (max-width: 768px) {
          .text-container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}
