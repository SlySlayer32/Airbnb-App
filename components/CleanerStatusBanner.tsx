import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type CleanerStatus = 'relax' | 'scheduled' | 'ready' | 'active' | 'break' | 'awaiting_photos' | 'day_wrap';

interface CleanerStatusBannerProps {
  status: CleanerStatus;
  message?: string;
  timeRemaining?: number; // minutes
}

const statusConfig = {
  relax: {
    icon: 'happy-outline' as const,
    bgColor: '#f0fdf4',
    textColor: '#10b981',
    borderColor: '#bbf7d0',
    title: 'Relax Mode',
    defaultMessage: 'No scheduled cleanings today. Enjoy your free time!',
  },
  scheduled: {
    icon: 'time-outline' as const,
    bgColor: '#eff6ff',
    textColor: '#3b82f6',
    borderColor: '#bfdbfe',
    title: 'Scheduled',
    defaultMessage: 'You have cleanings scheduled for today',
  },
  ready: {
    icon: 'checkmark-circle-outline' as const,
    bgColor: '#fef3c7',
    textColor: '#f59e0b',
    borderColor: '#fed7aa',
    title: 'Ready to Start',
    defaultMessage: 'Your next cleaning is ready to begin',
  },
  active: {
    icon: 'play-circle-outline' as const,
    bgColor: '#ecfdf5',
    textColor: '#059669',
    borderColor: '#a7f3d0',
    title: 'Cleaning Active',
    defaultMessage: 'Cleaning in progress - stay focused!',
  },
  break: {
    icon: 'pause-circle-outline' as const,
    bgColor: '#fef3c7',
    textColor: '#d97706',
    borderColor: '#fed7aa',
    title: 'On Break',
    defaultMessage: 'Break time - resume when ready',
  },
  awaiting_photos: {
    icon: 'camera-outline' as const,
    bgColor: '#fdf4ff',
    textColor: '#a855f7',
    borderColor: '#e9d5ff',
    title: 'Photos Required',
    defaultMessage: 'Please take completion photos to finish',
  },
  day_wrap: {
    icon: 'trophy-outline' as const,
    bgColor: '#f0fdf4',
    textColor: '#10b981',
    borderColor: '#bbf7d0',
    title: 'Day Complete',
    defaultMessage: 'All cleanings completed! Great work today.',
  },
};

export default function CleanerStatusBanner({ 
  status, 
  message, 
  timeRemaining 
}: CleanerStatusBannerProps) {
  const config = statusConfig[status];
  const displayMessage = message || config.defaultMessage;

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m remaining`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m remaining`;
    }
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }
    ]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={config.icon} 
          size={24} 
          color={config.textColor} 
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: config.textColor }]}>
          {config.title}
        </Text>
        <Text style={styles.message}>
          {displayMessage}
        </Text>
        {timeRemaining && timeRemaining > 0 && (
          <Text style={[styles.timeText, { color: config.textColor }]}>
            {formatTimeRemaining(timeRemaining)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
