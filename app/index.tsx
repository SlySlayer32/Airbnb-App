import CleanerDashboard from '@/components/CleanerDashboard';
import DebugPanel from '@/components/DebugPanel';
import HamburgerMenuButton from '@/components/HamburgerMenuButton';
import NavigationSidebar from '@/components/NavigationSidebar';
import OwnerDashboard from '@/components/OwnerDashboard';
import SwipeGestureHandler from '@/components/SwipeGestureHandler';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function Dashboard() {
  const { profile } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Show cleaner dashboard for cleaner role
  if (profile?.role === 'cleaner') {
    return (
      <SwipeGestureHandler
        isSidebarOpen={isSidebarOpen}
        onSwipeRight={toggleSidebar}
        onSwipeLeft={closeSidebar}
      >
        <View style={{ flex: 1 }}>
          <HamburgerMenuButton isOpen={isSidebarOpen} onPress={toggleSidebar} />
          <NavigationSidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            currentRoute={pathname}
          />
          <CleanerDashboard />
          <DebugPanel />
        </View>
      </SwipeGestureHandler>
    );
  }

  // Show owner/co-host dashboard for other roles
  return (
    <SwipeGestureHandler
      isSidebarOpen={isSidebarOpen}
      onSwipeRight={toggleSidebar}
      onSwipeLeft={closeSidebar}
    >
      <View style={{ flex: 1 }}>
        <HamburgerMenuButton isOpen={isSidebarOpen} onPress={toggleSidebar} />
        <NavigationSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          currentRoute={pathname}
        />
        <OwnerDashboard />
        <DebugPanel />
      </View>
    </SwipeGestureHandler>
  );
}
