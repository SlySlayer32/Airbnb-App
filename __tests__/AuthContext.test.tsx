import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock environment variables for demo mode
const originalEnv = process.env;

beforeAll(() => {
  process.env = {
    ...originalEnv,
    EXPO_PUBLIC_SUPABASE_URL: 'https://placeholder-url.supabase.co',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('AuthContext', () => {
  it('should provide auth context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.loading).toBeDefined();
    expect(result.current.isDemoMode).toBeDefined();
  });

  it('should complete loading and provide profile data', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 6000 });

    // Should have profile data (either real or mock)
    expect(result.current.profile).toBeDefined();
    if (result.current.profile) {
      expect(result.current.profile.full_name).toBeDefined();
      expect(result.current.profile.role).toBeDefined();
    }
  });

  it('should provide switchMockProfile function', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.switchMockProfile).toBeDefined();
    expect(typeof result.current.switchMockProfile).toBe('function');
  });
});

