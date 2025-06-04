'use client';

import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { user, loading, isGuest } = useAuth();
  const pathname = usePathname();
  
  // Pages that don't require authentication
  const publicPages = ['/login', '/signup', '/landing'];
  const isPublicPage = publicPages.includes(pathname);

  // loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuest && !isPublicPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in or use guest mode to access this page.</p>
          <a 
            href="/landing" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Landing Page
          </a>
        </div>
      </div>
    );
  }

  if (user && (isPublicPage || pathname === '/landing')) {
    window.location.href = '/';
    return null;
  }

  return (
    <>
      {(user || isGuest) && !isPublicPage && <Navbar />}
      {children}
    </>
  );
}