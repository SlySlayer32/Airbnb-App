import { Profile } from './types';

/**
 * Mock User Profiles for Development
 *
 * Quick-switch profiles for testing different user roles without authentication.
 * Only used in development mode when Supabase is not configured.
 */

export type MockProfile = Profile;

export const MOCK_PROFILES: Record<string, MockProfile> = {
  owner: {
    id: 'mock-owner-123',
    email: 'owner@demo.com',
    full_name: 'Sarah Johnson',
    avatar_url: undefined,
    role: 'property_owner',
    phone: '+1 (555) 123-4567',
    address: '123 Ocean Drive, Miami, FL',
    onboarded: true,
  },
  cleaner: {
    id: 'mock-cleaner-456',
    email: 'cleaner@demo.com',
    full_name: 'Maria Garcia',
    avatar_url: undefined,
    role: 'cleaner',
    phone: '+1 (555) 987-6543',
    address: '456 Beach Blvd, Miami, FL',
    onboarded: true,
  },
  cohost: {
    id: 'mock-cohost-789',
    email: 'cohost@demo.com',
    full_name: 'David Chen',
    avatar_url: undefined,
    role: 'co_host',
    phone: '+1 (555) 555-5555',
    address: '789 Palm Street, Miami, FL',
    onboarded: true,
  },
};

export const DEFAULT_MOCK_PROFILE: MockProfile = MOCK_PROFILES.owner!;

/**
 * Get mock profile by role
 */
export const getMockProfile = (
  role: 'property_owner' | 'cleaner' | 'co_host'
): MockProfile => {
  const key =
    role === 'property_owner'
      ? 'owner'
      : role === 'co_host'
        ? 'cohost'
        : 'cleaner';
  return MOCK_PROFILES[key];
};

/**
 * Get all available mock profiles
 */
export const getAllMockProfiles = (): MockProfile[] => {
  return Object.values(MOCK_PROFILES);
};
