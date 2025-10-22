import { useAuth } from '@/contexts/AuthContext';
import { dashboardLayoutService } from '@/services/dashboardLayoutService';
import { DashboardComponent } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import existing components (role-agnostic wrappers)
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import TodayJobsSection from './TodayJobsSection';
import TodoTasksSection from './TodoTasksSection';

interface CustomizableDashboardProps {
    onOpenComponentLibrary: () => void;
}

export default function CustomizableDashboard({ onOpenComponentLibrary }: CustomizableDashboardProps) {
    const { profile } = useAuth();
    const [components, setComponents] = useState<DashboardComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [draggedComponent, setDraggedComponent] = useState<string | null>(null);

    const loadLayout = useCallback(async () => {
        if (!profile?.id) return;

        try {
            setLoading(true);
            const layout = await dashboardLayoutService.getLayout(profile.id);
            setComponents(layout);
        } catch (error) {
            console.error('[CustomizableDashboard.loadLayout]', error);
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        loadLayout();
    }, [loadLayout]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadLayout();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleRemoveComponent = async (componentId: string) => {
        if (!profile?.id) return;

        Alert.alert(
            'Remove Component',
            'Are you sure you want to remove this component?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dashboardLayoutService.removeComponent(profile.id, componentId);
                            await loadLayout();
                        } catch (error) {
                            console.error('[CustomizableDashboard.handleRemoveComponent]', error);
                        }
                    }
                }
            ]
        );
    };

    const renderComponent = (component: DashboardComponent, index: number) => {
        switch (component.type) {
            case 'stats':
                return <DashboardStats key={component.id} />;
            case 'quickActions':
                return <QuickActions key={component.id} />;
            case 'todayJobs':
                // Pass necessary props (will be enhanced later)
                return <TodayJobsSection key={component.id} sessions={[]} isLoading={false} />;
            case 'todoTasks':
                return <TodoTasksSection key={component.id} tasks={[]} onToggleTask={() => { }} isLoading={false} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Loading your dashboard...</Text>
            </View>
        );
    }

    if (components.length === 0) {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.content}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                >
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Welcome, {profile?.full_name?.split(' ')[0] || 'User'}!</Text>
                        <Text style={styles.subtitle}>Build your custom dashboard</Text>
                    </View>

                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="apps-outline" size={48} color="#d1d5db" />
                        </View>
                        <Text style={styles.emptyTitle}>Empty Dashboard</Text>
                        <Text style={styles.emptyDescription}>
                            Add components to customize your dashboard experience
                        </Text>
                        <TouchableOpacity
                            style={styles.addFirstButton}
                            onPress={onOpenComponentLibrary}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#fff" />
                            <Text style={styles.addFirstButtonText}>Add Components</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.greeting}>Welcome, {profile?.full_name?.split(' ')[0] || 'User'}!</Text>
                    <Text style={styles.subtitle}>Your custom dashboard</Text>
                </View>

                <View style={styles.componentsContainer}>
                    {components
                        .sort((a, b) => a.order - b.order)
                        .map((component, index) => (
                            <View key={component.id} style={styles.componentWrapper}>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveComponent(component.id)}
                                >
                                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                                </TouchableOpacity>
                                {renderComponent(component, index)}
                            </View>
                        ))}
                </View>

                <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={onOpenComponentLibrary}
                >
                    <Ionicons name="add-outline" size={20} color="#007AFF" />
                    <Text style={styles.addMoreButtonText}>Add More Components</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    loadingText: {
        fontSize: 16,
        color: '#6b7280',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 72,
        paddingBottom: 16,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    addFirstButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    addFirstButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    componentsContainer: {
        paddingHorizontal: 16,
    },
    componentWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 32,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
    },
    addMoreButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
});
