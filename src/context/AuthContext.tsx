
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
  signIn: (email: string, password: string) => Promise<{error?: string} | undefined>;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!isUsingPlaceholders);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser as User);
        setSession(mockSession);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
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
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(session.user));
      }
      
      setLoading(false);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Update localStorage
      if (session?.user) {
        localStorage.setItem('user', JSON.stringify(session.user));
      } else {
        localStorage.removeItem('user');
      }
      
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
        
        // Mock validation check - simple demo to demonstrate wrong password functionality
        if (password === "wrongpassword" || password.length < 6) {
          console.log('Mock: Invalid login credentials');
          return { error: "Invalid login credentials" };
        }
        
        setUser(mockUser);
        setSession(mockSession);
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        toast.success('Signed in successfully (Demo Mode)');
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.log('Sign in error:', error.message);
        return { error: error.message };
      }
      
      toast.success('Signed in successfully');
      return;
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An error occurred during sign in' };
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
        
        // Store user in localStorage with the provided email
        const mockSignupUser = {
          ...mockUser,
          email: email,
          user_metadata: { name: name }
        };
        
        localStorage.setItem('user', JSON.stringify(mockSignupUser));
        
        setUser(mockSignupUser as User);
        setSession(mockSession);
        
        toast.success('Account created successfully! (Demo Mode)');
        // Auto sign-in after signup in development
        window.location.href = '/dashboard';
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
      // Redirect to login page after signup
      window.location.href = '/login';
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
        localStorage.removeItem('user');
        toast.success('Signed out successfully (Demo Mode)');
        window.location.href = '/login';
        return;
      }
      
      await supabase.auth.signOut();
      // Remove user from localStorage
      localStorage.removeItem('user');
      toast.success('Signed out successfully');
      window.location.href = '/login';
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
