'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const LoginPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Listen for dark mode toggle from Navbar (optional: use context for global state in real apps)
  useEffect(() => {
    const handleBodyClass = () => {
      setDarkMode(document.body.classList.contains('dark'));
    };
    handleBodyClass();
    window.addEventListener('DOMSubtreeModified', handleBodyClass);
    return () => window.removeEventListener('DOMSubtreeModified', handleBodyClass);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Welcome back
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`py-8 px-4 shadow sm:rounded-lg sm:px-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <form className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email address"
                className={`appearance-none block w-full px-3 py-4 border ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue
              </button>
            </div>
          </form>
          <div className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: "#2F37AF" }}>
              Sign Up
            </Link>
          </div>
          {/* Divider with OR */}
          <div className="flex items-center my-6">
            <div className={`flex-grow border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`} />
            <span className={`mx-4 font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>OR</span>
            <div className={`flex-grow border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`} />
          </div>
          {/* Social Login Button */}
          <div>
            <button
              type="button"
              className={`w-full flex items-center justify-between py-2 px-4 border ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-300 bg-white'} rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none`}
            >
              <span>Continue with Google</span>
              {/* Google Icon */}
              <svg className="h-5 w-5 ml-2" viewBox="0 0 24 24">
                <g>
                  <path fill="#4285F4" d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.18-1.36 3.463-5.262 3.463-3.167 0-5.75-2.62-5.75-5.841s2.583-5.841 5.75-5.841c1.805 0 3.017.77 3.713 1.432l2.54-2.47C17.07 3.71 15.13 2.75 12.625 2.75c-5.02 0-9.09 4.07-9.09 9.09s4.07 9.09 9.09 9.09c5.24 0 8.715-3.68 8.715-8.88 0-.6-.07-1.06-.16-1.53z"/>
                  <path fill="#34A853" d="M3.548 7.548l3.25 2.385c.89-1.78 2.57-2.97 4.577-2.97 1.31 0 2.48.45 3.41 1.34l2.54-2.47C15.07 3.71 13.13 2.75 10.625 2.75c-3.13 0-5.78 1.8-7.077 4.798z"/>
                  <path fill="#FBBC05" d="M12.625 21.25c2.505 0 4.445-.83 5.927-2.26l-2.73-2.23c-.74.5-1.7.8-3.197.8-2.45 0-4.53-1.65-5.27-3.87l-3.23 2.5c1.29 2.97 4.13 5.06 8.5 5.06z"/>
                  <path fill="#EA4335" d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.18-1.36 3.463-5.262 3.463-3.167 0-5.75-2.62-5.75-5.841s2.583-5.841 5.75-5.841c1.805 0 3.017.77 3.713 1.432l2.54-2.47C17.07 3.71 15.13 2.75 12.625 2.75c-5.02 0-9.09 4.07-9.09 9.09s4.07 9.09 9.09 9.09c5.24 0 8.715-3.68 8.715-8.88 0-.6-.07-1.06-.16-1.53z"/>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;