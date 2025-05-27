'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number | string;
  username: string;
  email: string | null;
  is_guest?: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: AuthResponse = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          // Redirect authenticated users to predict page
          router.push('/predict');
        }
      }
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, they will be redirected above
  // This shows the landing page for unauthenticated users
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/home-bg.png')",
      }}
    >
      <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to AutoWorth
        </h1>
        <p className="text-gray-600 mb-8">
          Get accurate car price predictions with our advanced AI model.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 block text-center"
          >
            Sign In
          </Link>
          
          <Link
            href="/signup"
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 block text-center"
          >
            Sign Up
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Sign in to access the car price prediction tool
        </p>
      </div>
    </div>
  );
}