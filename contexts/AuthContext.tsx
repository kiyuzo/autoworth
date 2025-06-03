'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  dbUser: any;
  isGuest: boolean;
  setGuestMode: (isGuest: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Function to save/update user in database
  const saveUserToDatabase = async (firebaseUser: User) => {
    try {
      const userData = {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        setDbUser(result.user);
        console.log('User saved to database:', result.message);
      } else {
        console.error('Failed to save user to database');
      }
    } catch (error) {
      console.error('Error saving user to database:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Save/update user in database when they sign in
        await saveUserToDatabase(firebaseUser);
        setIsGuest(false);
      } else {
        setDbUser(null);
        // Don't reset guest mode here - let it persist
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setIsGuest(false);
      // User will be automatically saved to database via onAuthStateChanged
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setDbUser(null);
      setIsGuest(false);
      // Force redirect to login page after logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const setGuestMode = (guestMode: boolean) => {
    setIsGuest(guestMode);
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
    dbUser,
    isGuest,
    setGuestMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}