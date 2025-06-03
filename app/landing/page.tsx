'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleTryNow = () => {
    // Navigate to the main app page
    router.push('/');
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-center items-center px-4 ${
      darkMode ? 'bg-[#001233]' : 'bg-[#9EDDEF]'
    }`}>
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

      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center w-full max-w-7xl">
        {/* Text Container */}
        <div 
          className="text-center mb-8 lg:mb-16"
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
              fontSize: 'clamp(2rem, 5.2vw, 6.25rem)', // Responsive from 32px to 100px
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
          className={`rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
            darkMode ? 'bg-[#81C3D7]' : 'bg-[#001233]'
          }`}
          style={{
            width: 'clamp(250px, 17.4vw, 334px)', // Responsive width
            height: 'clamp(80px, 5.9vw, 113px)', // Responsive height
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
              fontSize: 'clamp(1.5rem, 2.1vw, 2.5rem)' // Responsive from 24px to 40px
            }}
          >
            Try Now
          </span>
        </button>
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
