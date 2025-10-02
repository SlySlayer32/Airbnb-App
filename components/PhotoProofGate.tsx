import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CleaningSession } from '@/types';

interface PhotoProofGateProps {
  session: CleaningSession;
  onPhotosComplete: (photos: string[]) => void;
  onSkipPhotos?: () => void;
}

export default function PhotoProofGate({ 
  session, 
  onPhotosComplete, 
  onSkipPhotos 
}: PhotoProofGateProps) {
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  // Mock photo requirements logic
  const getRequiredPhotos = () => {
    // Mock logic: require 2-4 photos based on property size and guest count
    const basePhotos = 2;
    const guestMultiplier = Math.min(session.guest_count, 6) * 0.5;
    const propertySize = (session.properties as any)?.rooms || 3;
    const sizeMultiplier = Math.min(propertySize / 2, 2);
    
    return Math.min(Math.max(basePhotos + guestMultiplier + sizeMultiplier, 2), 4);
  };

  const requiredPhotoCount = getRequiredPhotos();
  const hasRequiredPhotos = capturedPhotos.length >= requiredPhotoCount;

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    
    try {
      // Mock photo capture - in real implementation, this would use expo-camera
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPhotoUrl = `mock_photo_${Date.now()}_${capturedPhotos.length + 1}.jpg`;
      const newPhotos = [...capturedPhotos, mockPhotoUrl];
      
      setCapturedPhotos(newPhotos);
      
      // If we've reached the required count, automatically complete
      if (newPhotos.length >= requiredPhotoCount) {
        onPhotosComplete(newPhotos);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = capturedPhotos.filter((_, i) => i !== index);
    setCapturedPhotos(newPhotos);
  };

  const handleCompletePhotos = () => {
    if (hasRequiredPhotos) {
      onPhotosComplete(capturedPhotos);
    }
  };

  const handleSkipPhotos = () => {
    Alert.alert(
      'Skip Photo Requirements',
      'Are you sure you want to skip photo requirements? This may affect quality verification.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: onSkipPhotos }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons 
            name="camera" 
            size={24} 
            color={hasRequiredPhotos ? "#10b981" : "#6b7280"} 
          />
          <Text style={styles.title}>Completion Photos</Text>
        </View>
        
        {hasRequiredPhotos && (
          <View style={styles.completeBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.completeText}>Complete</Text>
          </View>
        )}
      </View>

      <View style={styles.requirementInfo}>
        <Text style={styles.requirementText}>
          Required: {capturedPhotos.length}/{requiredPhotoCount} photos
        </Text>
        <Text style={styles.requirementSubtext}>
          Capture photos of key areas to verify cleaning completion
        </Text>
      </View>

      {capturedPhotos.length > 0 && (
        <View style={styles.photoGrid}>
          {capturedPhotos.map((photo, index) => (
            <View key={index} style={styles.photoItem}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="image" size={32} color="#6b7280" />
                <Text style={styles.photoLabel}>Photo {index + 1}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemovePhoto(index)}
              >
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
          onPress={handleCapturePhoto}
          disabled={isCapturing}
        >
          <Ionicons 
            name={isCapturing ? "hourglass-outline" : "camera-outline"} 
            size={20} 
            color={isCapturing ? "#9ca3af" : "#fff"} 
          />
          <Text style={[styles.captureButtonText, isCapturing && styles.captureButtonTextDisabled]}>
            {isCapturing ? 'Capturing...' : 'Capture Photo'}
          </Text>
        </TouchableOpacity>

        {hasRequiredPhotos && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompletePhotos}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.completeButtonText}>Complete Photos</Text>
          </TouchableOpacity>
        )}
      </View>

      {!hasRequiredPhotos && onSkipPhotos && (
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkipPhotos}
        >
          <Text style={styles.skipButtonText}>Skip Photo Requirements</Text>
        </TouchableOpacity>
      )}

      <View style={styles.photoTips}>
        <Text style={styles.tipsTitle}>Photo Tips:</Text>
        <Text style={styles.tipsText}>• Capture main living areas</Text>
        <Text style={styles.tipsText}>• Include bathroom and kitchen</Text>
        <Text style={styles.tipsText}>• Show clean surfaces and organized spaces</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  completeText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  requirementInfo: {
    marginBottom: 20,
  },
  requirementText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  requirementSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  photoItem: {
    position: 'relative',
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  photoLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  actions: {
    gap: 12,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    gap: 8,
  },
  captureButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  captureButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  captureButtonTextDisabled: {
    color: '#fff',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    gap: 8,
  },
  completeButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
  photoTips: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
});
