'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const SignUpPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Listen for dark mode toggle from Navbar
  useEffect(() => {
    const handleBodyClass = () => {
      setDarkMode(document.body.classList.contains('dark'));
    };
    handleBodyClass();
    window.addEventListener('DOMSubtreeModified', handleBodyClass);
    return () => window.removeEventListener('DOMSubtreeModified', handleBodyClass);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!username || !email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Make actual API call to your backend
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          email,
          password
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Successfully registered and logged in, redirect to main page
        router.push('/');
      } else {
        setError(data.error || data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');

    try {
      // For now, simulate Google signup - replace with actual Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to main page
      router.push('/');
    } catch (err) {
      setError('Google signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Create your account
        </h2>
        <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Join us and start predicting car prices
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`py-8 px-4 shadow sm:rounded-lg sm:px-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className={`appearance-none block w-full px-3 py-4 border ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`appearance-none block w-full px-3 py-4 border ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`appearance-none block w-full px-3 py-4 border ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={`appearance-none block w-full px-3 py-4 border ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
          
          <div className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: "#2F37AF" }}>
              Sign In
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
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className={`w-full flex items-center justify-between py-2 px-4 border ${
                darkMode 
                  ? 'border-gray-700 bg-gray-900 text-gray-100' 
                  : 'border-gray-300 bg-white'
              } rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{isLoading ? 'Creating account...' : 'Continue with Google'}</span>
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

          {/* Terms and Privacy */}
          <div className={`mt-6 text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-indigo-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-indigo-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
