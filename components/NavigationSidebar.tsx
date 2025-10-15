import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home-outline', route: '/' },
  { id: 'schedule', label: 'Schedule', icon: 'calendar-outline', route: '/schedule' },
  { id: 'properties', label: 'Properties', icon: 'business-outline', route: '/properties' },
  { id: 'maintenance', label: 'Maintenance', icon: 'construct-outline', route: '/maintenance' },
  { id: 'profile', label: 'Profile', icon: 'person-outline', route: '/profile' },
];

export default function NavigationSidebar({ isOpen, onClose, currentRoute }: NavigationSidebarProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -280,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'cleaner':
        return '#10b981';
      case 'property_owner':
        return '#007AFF';
      case 'co_host':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'cleaner':
        return 'Cleaner';
      case 'property_owner':
        return 'Property Owner';
      case 'co_host':
        return 'Co-Host';
      default:
        return 'User';
    }
  };

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <Pressable
          style={styles.overlay}
          onPress={onClose}
          accessibilityLabel="Dismiss navigation"
          accessibilityRole="button"
        >
          <Animated.View style={[styles.overlayContent, { opacity: overlayOpacity }]} />
        </Pressable>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
        accessibilityRole="menu"
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#ffffff" />
            </View>
            <Text style={styles.userName} numberOfLines={1}>
              {profile?.full_name || 'User'}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(profile?.role) }]}>
              <Text style={styles.roleText}>{getRoleLabel(profile?.role)}</Text>
            </View>
          </View>

          {/* Navigation Items */}
          <View style={styles.navSection}>
            {navigationItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => handleNavigation(item.route)}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                >
                  <View style={styles.navItemContent}>
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={isActive ? '#007AFF' : '#e5e7eb'}
                      style={styles.navIcon}
                    />
                    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                      {item.label}
                    </Text>
                  </View>
                  {isActive && <View style={styles.activeIndicator} />}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  overlayContent: {
    flex: 1,
    backgroundColor: '#000000',
    opacity: 0.5,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#1f2937',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  navSection: {
    paddingTop: 16,
  },
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: '#374151',
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: 12,
  },
  navLabel: {
    fontSize: 16,
    color: '#e5e7eb',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    backgroundColor: '#007AFF',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});

