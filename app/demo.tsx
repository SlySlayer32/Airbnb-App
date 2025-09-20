import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import CleanerPropertyCard from '@/components/CleanerPropertyCard';
import PropertyCard from '@/components/PropertyCard';
import { mockEnhancedProperties, mockCleanerUser } from '@/data/mockEnhancedData';

export default function DemoScreen() {
  const [viewMode, setViewMode] = useState<'cleaner' | 'owner'>('cleaner');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Cleaner-Focused Property Management Demo</Text>
        <Text style={styles.subtitle}>Real-world solution for cleaner workflow problems</Text>
        
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, viewMode === 'cleaner' && styles.modeButtonActive]}
            onPress={() => setViewMode('cleaner')}
          >
            <Text style={[styles.modeButtonText, viewMode === 'cleaner' && styles.modeButtonTextActive]}>
              🧹 Cleaner View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, viewMode === 'owner' && styles.modeButtonActive]}
            onPress={() => setViewMode('owner')}
          >
            <Text style={[styles.modeButtonText, viewMode === 'owner' && styles.modeButtonTextActive]}>
              🏠 Owner View
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {viewMode === 'cleaner' && (
          <View style={styles.cleanerInfo}>
            <Text style={styles.cleanerInfoTitle}>👋 Welcome Maria!</Text>
            <Text style={styles.cleanerInfoText}>
              Here are your assigned cleaning sessions. All essential information is displayed upfront.
            </Text>
          </View>
        )}

        <Text style={styles.resultsText}>
          {mockEnhancedProperties.length} properties • {viewMode === 'cleaner' ? 'Assigned to you' : 'Your properties'}
        </Text>
        
        {mockEnhancedProperties.map((property) => (
          viewMode === 'cleaner' ? (
            <CleanerPropertyCard
              key={property.id}
              property={property}
              onPress={() => console.log('Property pressed:', property.name)}
            />
          ) : (
            <PropertyCard
              key={property.id}
              property={property}
              onPress={() => console.log('Property pressed:', property.name)}
            />
          )
        ))}

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>✨ Key Features Demonstrated</Text>
          <Text style={styles.featureItem}>• 👥 Guest count prominently displayed for linen preparation</Text>
          <Text style={styles.featureItem}>• 🔑 Access codes and instructions clearly visible</Text>
          <Text style={styles.featureItem}>• 🛏️ Automatic linen requirements based on guest count</Text>
          <Text style={styles.featureItem}>• ❌ Clear cancellation handling with notice period</Text>
          <Text style={styles.featureItem}>• 📍 Special areas and cleaning requirements highlighted</Text>
          <Text style={styles.featureItem}>• 🆘 Emergency contact information readily available</Text>
          <Text style={styles.featureItem}>• 📱 WiFi credentials for cleaner mobile access</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modeButtonTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
  },
  cleanerInfo: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cleanerInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  cleanerInfoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  features: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 6,
    lineHeight: 20,
  },
});