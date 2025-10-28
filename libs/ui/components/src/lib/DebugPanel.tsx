import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllMockProfiles } from '@airbnb/core-domain-models';
import { useAuth } from '@airbnb/data-access-auth';

interface DebugInfo {
  timestamp: string;
  authState: {
    loading: boolean;
    user: boolean;
    profile: boolean;
    profileRole?: string | undefined;
  };
  environment: {
    supabaseConfigured: boolean;
    demoMode: boolean;
    nodeEnv: string;
  };
  navigation: {
    currentRoute: string;
  };
  system: {
    platform: string;
    userAgent?: string | undefined;
  };
}

export default function DebugPanel() {
  const [visible, setVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const { user, profile, loading, isDemoMode, switchMockProfile } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    updateDebugInfo();
  }, [user, profile, loading, pathname]);

  const updateDebugInfo = () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseConfigured = !!(
      supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes('placeholder') &&
      !supabaseKey.includes('placeholder')
    );

    const info: DebugInfo = {
      timestamp: new Date().toLocaleTimeString(),
      authState: {
        loading,
        user: !!user,
        profile: !!profile,
        profileRole: profile?.role,
      },
      environment: {
        supabaseConfigured,
        demoMode: isDemoMode,
        nodeEnv: __DEV__ ? 'development' : 'production',
      },
      navigation: {
        currentRoute: pathname || 'unknown',
      },
      system: {
        platform: 'react-native',
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    };

    setDebugInfo(info);
  };

  const handleProfileSwitch = (
    role: 'property_owner' | 'cleaner' | 'co_host'
  ) => {
    const mockProfiles = getAllMockProfiles();
    const mockProfile = mockProfiles.find(p => p.role === role);
    if (mockProfile) {
      switchMockProfile(mockProfile);
      Alert.alert(
        'Profile Switched',
        `Now viewing as: ${mockProfile.full_name} (${role})`
      );
      updateDebugInfo();
    }
  };

  const togglePanel = () => {
    setVisible(!visible);
    if (!visible) {
      updateDebugInfo();
    }
  };

  const getStatusColor = (status: boolean) => (status ? '#10b981' : '#ef4444');
  const getStatusText = (status: boolean) => (status ? 'OK' : 'FAIL');

  if (!__DEV__) {
    return null; // Only show in development
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={togglePanel}
        onLongPress={() => {
          // Long press to force refresh
          updateDebugInfo();
        }}
      >
        <Ionicons name="bug" size={20} color="#007AFF" />
        <Text style={styles.toggleText}>DEBUG</Text>
      </TouchableOpacity>

      {/* Debug Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Debug Panel</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              {debugInfo && (
                <>
                  {/* Auth State */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Authentication</Text>
                    <View style={styles.row}>
                      <Text style={styles.label}>Loading:</Text>
                      <Text
                        style={[
                          styles.value,
                          {
                            color: getStatusColor(!debugInfo.authState.loading),
                          },
                        ]}
                      >
                        {debugInfo.authState.loading ? 'YES' : 'NO'}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>User:</Text>
                      <Text
                        style={[
                          styles.value,
                          { color: getStatusColor(debugInfo.authState.user) },
                        ]}
                      >
                        {getStatusText(debugInfo.authState.user)}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Profile:</Text>
                      <Text
                        style={[
                          styles.value,
                          {
                            color: getStatusColor(debugInfo.authState.profile),
                          },
                        ]}
                      >
                        {getStatusText(debugInfo.authState.profile)}
                      </Text>
                    </View>
                    {debugInfo.authState.profileRole && (
                      <View style={styles.row}>
                        <Text style={styles.label}>Role:</Text>
                        <Text style={styles.value}>
                          {debugInfo.authState.profileRole}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Environment */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Environment</Text>
                    <View style={styles.row}>
                      <Text style={styles.label}>Supabase:</Text>
                      <Text
                        style={[
                          styles.value,
                          {
                            color: getStatusColor(
                              debugInfo.environment.supabaseConfigured
                            ),
                          },
                        ]}
                      >
                        {getStatusText(
                          debugInfo.environment.supabaseConfigured
                        )}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Demo Mode:</Text>
                      <Text
                        style={[
                          styles.value,
                          {
                            color: debugInfo.environment.demoMode
                              ? '#f59e0b'
                              : '#10b981',
                          },
                        ]}
                      >
                        {debugInfo.environment.demoMode ? 'YES' : 'NO'}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Environment:</Text>
                      <Text style={styles.value}>
                        {debugInfo.environment.nodeEnv}
                      </Text>
                    </View>
                  </View>

                  {/* System */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>System</Text>
                    <View style={styles.row}>
                      <Text style={styles.label}>Platform:</Text>
                      <Text style={styles.value}>
                        {debugInfo.system.platform}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Current Route:</Text>
                      <Text style={styles.value}>
                        {debugInfo.navigation.currentRoute}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Last Updated:</Text>
                      <Text style={styles.value}>{debugInfo.timestamp}</Text>
                    </View>
                  </View>

                  {/* Profile Switcher - Demo Mode Only */}
                  {debugInfo.environment.demoMode && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        Switch Profile (Demo Mode)
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          profile?.role === 'property_owner' &&
                            styles.activeProfile,
                        ]}
                        onPress={() => handleProfileSwitch('property_owner')}
                      >
                        <Ionicons
                          name="home"
                          size={16}
                          color={
                            profile?.role === 'property_owner'
                              ? '#fff'
                              : '#007AFF'
                          }
                        />
                        <Text
                          style={[
                            styles.actionText,
                            profile?.role === 'property_owner' &&
                              styles.activeProfileText,
                          ]}
                        >
                          Property Owner
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          profile?.role === 'cleaner' && styles.activeProfile,
                        ]}
                        onPress={() => handleProfileSwitch('cleaner')}
                      >
                        <Ionicons
                          name="sparkles"
                          size={16}
                          color={
                            profile?.role === 'cleaner' ? '#fff' : '#007AFF'
                          }
                        />
                        <Text
                          style={[
                            styles.actionText,
                            profile?.role === 'cleaner' &&
                              styles.activeProfileText,
                          ]}
                        >
                          Cleaner
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          profile?.role === 'co_host' && styles.activeProfile,
                        ]}
                        onPress={() => handleProfileSwitch('co_host')}
                      >
                        <Ionicons
                          name="people"
                          size={16}
                          color={
                            profile?.role === 'co_host' ? '#fff' : '#007AFF'
                          }
                        />
                        <Text
                          style={[
                            styles.actionText,
                            profile?.role === 'co_host' &&
                              styles.activeProfileText,
                          ]}
                        >
                          Co-Host
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Actions */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Actions</Text>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={updateDebugInfo}
                    >
                      <Ionicons name="refresh" size={16} color="#007AFF" />
                      <Text style={styles.actionText}>Refresh Info</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        if (__DEV__) {
                          console.log(
                            '[DebugPanel] Full debug info:',
                            debugInfo
                          );
                        }
                        Alert.alert(
                          'Debug Info',
                          'Full debug info logged to console'
                        );
                      }}
                    >
                      <Ionicons name="code" size={16} color="#007AFF" />
                      <Text style={styles.actionText}>Log to Console</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  activeProfile: {
    backgroundColor: '#007AFF',
  },
  activeProfileText: {
    color: '#fff',
  },
});
