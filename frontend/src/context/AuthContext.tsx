// Source note:
// This file was partially refactored with assistance from AI (ChatGPT).
// Edited and reviewed by AN-NI HUANG
// Date: 2025-11-23
'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { AuthUser } from '@/types/user';
import { userApi } from '@/lib/api/userApi';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login'];

// Token refresh interval: 55 minutes (Firebase tokens expire in 1 hour)
const TOKEN_REFRESH_INTERVAL = 55 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  // Use ref to store interval ID for cleanup
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          //  Use /me endpoint to get user info.
          const currentUser = await userApi.getCurrentUser();
          setUser(currentUser);

          // Setup automatic token refresh
          setupTokenRefresh(firebaseUser);
        } catch (error) {
          console.error('[Auth] Error getting user token:', error);
          setUser(null);
          clearTokenRefresh();
        }
      } else {
        // No Firebase user = not authenticated
        setUser(null);
        clearTokenRefresh();
      }

      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      clearTokenRefresh();
    };
  }, []);

  // Setup token refresh interval
  const setupTokenRefresh = (firebaseUser: FirebaseUser) => {
    // Clear any existing interval
    clearTokenRefresh();

    console.log('[Auth] Setting up token refresh (every 55 minutes)');

    // Create new refresh interval
    refreshIntervalRef.current = setInterval(async () => {
      try {
        console.log('[Auth] Refreshing token...');
        await firebaseUser.getIdToken(true); // true = force refresh
        console.log('[Auth] Token refreshed successfully');
      } catch (error) {
        console.error('[Auth] Token refresh failed:', error);
        // If refresh fails, sign out user for security
        await handleRefreshFailure();
      }
    }, TOKEN_REFRESH_INTERVAL);
  };

  // Clear token refresh interval
  const clearTokenRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      console.log('[Auth] Token refresh interval cleared');
    }
  };

  // Handle token refresh failure
  const handleRefreshFailure = async () => {
    console.warn('[Auth] Token refresh failed, signing out user...');
    try {
      clearTokenRefresh();
      await firebaseSignOut(auth);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('[Auth] Error during forced sign out:', error);
    }
  };

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname || '');

    if (!user && !isPublicRoute) {
      // Not logged in and trying to access protected route
      router.push('/login');
    } else if (user && (pathname === '/' || pathname === '/login')) {
      // Logged in and on public route
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      // Customize error messages based on Firebase error codes
      let message = 'Failed to sign in. Please try again.';

      if (error?.code === 'auth/invalid-password') {
        message = 'Invalid password. Please check your credentials.';
      } else if (error?.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'Invalid email format. Please check and try again.';
      } else if (error?.code === 'auth/user-disabled') {
        message = 'This account has been disabled. Please contact your administrator.';
      }

      // Throw a clean Error for the login page to display
      throw new Error(message);
    }
  };

  const signOut = async () => {
    try {
      // Clear token refresh interval before signing out
      clearTokenRefresh();
      
      await firebaseSignOut(auth);
      setUser(null);
      router.push('/login');
    } catch (error: any) {
      console.error('[Auth] Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper to parse JWT token if we need to extract claims in future
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[Auth] Error parsing JWT:', error);
    return {};
  }
}
