import React, { useState } from 'react';
import { View } from 'react-native';
import { usePathname } from 'expo-router';
import { useAuth } from '@airbnb/data-access-auth';
import {
  ComponentLibraryModal,
  CustomizableDashboard,
  DebugPanel,
  HamburgerMenuButton,
  NavigationSidebar,
  SwipeGestureHandler,
} from '@airbnb/ui-components';

export default function Dashboard() {
  const { profile } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [libraryVisible, setLibraryVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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
        <CustomizableDashboard
          onOpenComponentLibrary={() => setLibraryVisible(true)}
          key={refreshKey}
        />
        <ComponentLibraryModal
          visible={libraryVisible}
          onClose={() => setLibraryVisible(false)}
          onComponentAdded={() => setRefreshKey(prev => prev + 1)}
        />
        <DebugPanel />
      </View>
    </SwipeGestureHandler>
  );
}
