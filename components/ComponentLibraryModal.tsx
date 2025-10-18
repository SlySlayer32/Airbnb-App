import { COMPONENT_LIBRARY, getComponentsForRole } from '@/constants/componentLibrary';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardLayoutService } from '@/services/dashboardLayoutService';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ComponentLibraryModalProps {
    visible: boolean;
    onClose: () => void;
    onComponentAdded: () => void;
}

export default function ComponentLibraryModal({ visible, onClose, onComponentAdded }: ComponentLibraryModalProps) {
    const { profile } = useAuth();

    const handleAddComponent = async (componentType: string) => {
        if (!profile?.id) return;

        try {
            await dashboardLayoutService.addComponent(profile.id, componentType);
            Alert.alert('Success', 'Component added to your dashboard');
            onComponentAdded();
            onClose();
        } catch (error) {
            console.error('[ComponentLibraryModal.handleAddComponent]', error);
        }
    };

    const availableComponents = profile?.role
        ? getComponentsForRole(profile.role)
        : COMPONENT_LIBRARY;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Component Library</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <Text style={styles.description}>
                            Choose components to add to your dashboard. Components will automatically show role-specific data.
                        </Text>

                        <View style={styles.grid}>
                            {availableComponents.map((item) => (
                                <TouchableOpacity
                                    key={item.type}
                                    style={styles.componentCard}
                                    onPress={() => handleAddComponent(item.type)}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                                        <Ionicons name={item.icon as any} size={28} color="#fff" />
                                    </View>
                                    <Text style={styles.componentName}>{item.name}</Text>
                                    <Text style={styles.componentDescription}>{item.description}</Text>
                                    <View style={styles.addIconContainer}>
                                        <Ionicons name="add-circle" size={20} color={item.color} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 16,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 24,
    },
    componentCard: {
        width: '48%',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        position: 'relative',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    componentName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    componentDescription: {
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 16,
    },
    addIconContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
});
