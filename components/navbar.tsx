'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Apply or remove dark mode class on <body>
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggle = () => setDarkMode((prev) => !prev);

  return (
    <nav className={`bg-white border-b border-gray-200 fixed w-full z-10 ${darkMode ? 'dark:bg-gray-900 dark:border-gray-700' : ''}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Dark mode toggle image */}
          <div className="flex items-center w-1/5">
            <button
              className="focus:outline-none"
              aria-label="Toggle dark mode"
              onClick={handleToggle}
            >
              <img
                src={darkMode ? "/toggle/dark.svg" : "/toggle/light.svg"}
                alt="Toggle dark mode"
                className="w-16 rounded-full object-cover"
              />
            </button>
          </div>

          {/* Center - Logo/Brand */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-2xl font-extrabold" style={{ color: darkMode ? "#AEB8FE" : "#2F37AF" }}>
              AUTOWORTH
            </Link>
          </div>

          {/* Right side - Icons and Account */}
          <div className="flex items-center justify-end w-1/5 space-x-4">
            {/* Graph Icon */}
            <button className={`hover:text-gray-700 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500'}`} aria-label="Graph">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 13l3 3 7-7" />
              </svg>
            </button>
            {/* Reversing Time Icon */}
            <button className={`hover:text-gray-700 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500'}`} aria-label="Reversing Time">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-3-7.7" />
              </svg>
            </button>
            {/* Circular Flag Icon */}
            <button className={`hover:text-gray-700 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500'}`} aria-label="English">
              <span className="inline-block w-8 h-8 rounded-full overflow-hidden border border-gray-300 bg-gray-200 flex items-center justify-center">
                <img
                  src="/UK-flag.webp"
                  alt="UK Flag"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </span>
            </button>
            {/* Account Name with Profile Icon */}
            <span className={`flex items-center text-sm font-bold ${darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
              {/* Profile Icon from Heroicons (User Circle Solid) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 20a6 6 0 00-12 0h12zm-6-8a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5z" />
              </svg>
              Account Name
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;