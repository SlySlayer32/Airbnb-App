import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_MOCK_PROFILE, MockProfile } from '../data/mockProfiles';
import { supabase } from '../utils/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'property_owner' | 'cleaner' | 'co_host';
  phone?: string;
  address?: string;
  onboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  switchMockProfile: (profile: MockProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TIMEOUT_MS = 5000; // 5 seconds max for auth initialization

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    // Check if Supabase is properly configured
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const isConfigured = supabaseUrl && supabaseKey &&
      !supabaseUrl.includes('placeholder') && !supabaseKey.includes('placeholder');

    if (!isConfigured) {
      // Demo mode - use mock profile
      if (__DEV__) {
        console.log('[AuthContext] Demo Mode: Using mock data');
      }
      setIsDemoMode(true);
      setProfile(DEFAULT_MOCK_PROFILE);
      setLoading(false);
      return;
    }

    // Set timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (loading) {
        if (__DEV__) {
          console.warn('[AuthContext] Auth timeout - falling back to demo mode');
        }
        setIsDemoMode(true);
        setProfile(DEFAULT_MOCK_PROFILE);
        setLoading(false);
      }
    }, AUTH_TIMEOUT_MS);

    // Get initial session with error handling
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        // Network error - fall back to demo mode
        if (error.message?.includes('NetworkError') || error.message?.includes('Network request failed')) {
          if (__DEV__) {
            console.log('[AuthContext] Network error - using demo mode');
          }
          setIsDemoMode(true);
          setProfile(DEFAULT_MOCK_PROFILE);
        } else if (__DEV__) {
          console.error('[AuthContext] Auth error:', error);
        }
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      if (__DEV__) {
        console.error('[AuthContext] Error fetching profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = useCallback(async (email: string, password: string, fullName: string, role: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    });
    return { data, error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    setProfile(prev => prev ? { ...prev, ...updates } : null);
  }, [user]);

  const switchMockProfile = useCallback((mockProfile: MockProfile) => {
    if (!isDemoMode && !__DEV__) {
      console.warn('Cannot switch profiles outside demo mode');
      return;
    }
    setProfile(mockProfile);
  }, [isDemoMode]);

  const contextValue = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    isDemoMode,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    switchMockProfile
  }), [user, profile, session, loading, isDemoMode, signUp, signIn, signOut, resetPassword, updateProfile, switchMockProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
