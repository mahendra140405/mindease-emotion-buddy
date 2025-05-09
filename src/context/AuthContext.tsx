
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Check if we're using placeholders
const isUsingPlaceholders = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development when using placeholders
const mockUser = isUsingPlaceholders ? {
  id: 'mock-user-id',
  email: 'demo@example.com',
  user_metadata: { name: 'Demo User' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString()
} as User : null;

// Mock session for development when using placeholders
const mockSession = isUsingPlaceholders ? {
  user: mockUser,
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  provider_token: null,
  provider_refresh_token: null
} as Session : null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(isUsingPlaceholders ? mockUser : null);
  const [session, setSession] = useState<Session | null>(isUsingPlaceholders ? mockSession : null);
  const [loading, setLoading] = useState(!isUsingPlaceholders);

  useEffect(() => {
    // Skip real auth check if using placeholders
    if (isUsingPlaceholders) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    const getSession = async () => {
      setLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      
      setLoading(false);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (isUsingPlaceholders) {
        // Mock successful login in development
        console.log('Mock: Signing in with', email);
        setUser(mockUser);
        setSession(mockSession);
        toast.success('Signed in successfully (Demo Mode)');
        
        // Store user in localStorage for other components
        if (mockUser) {
          localStorage.setItem("user", JSON.stringify({ email: mockUser.email }));
        }
        
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      if (isUsingPlaceholders) {
        // Mock successful registration in development
        console.log('Mock: Signing up with', email, 'and name', name);
        toast.success('Account created successfully! (Demo Mode)');
        return;
      }
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      if (isUsingPlaceholders) {
        // Mock sign out in development
        console.log('Mock: Signing out');
        setUser(null);
        setSession(null);
        // Remove user from localStorage
        localStorage.removeItem("user");
        toast.success('Signed out successfully (Demo Mode)');
        return;
      }
      
      await supabase.auth.signOut();
      // Remove user from localStorage
      localStorage.removeItem("user");
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An error occurred during sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
