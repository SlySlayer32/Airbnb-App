import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@airbnb/data-access-auth';

interface RoleBasedWrapperProps {
  children: React.ReactNode;
  allowedRoles: ('property_owner' | 'cleaner' | 'co_host')[];
  fallback?: React.ReactNode;
}

export default function RoleBasedWrapper({ 
  children, 
  allowedRoles, 
  fallback 
}: RoleBasedWrapperProps) {
  const { profile } = useAuth();

  if (!profile) {
    return null;
  }

  const hasAccess = allowedRoles.includes(profile.role);

  if (!hasAccess) {
    return fallback || (
      <View style={styles.restrictedContainer}>
        <Text style={styles.restrictedText}>
          Access restricted to your role
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  restrictedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});