import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BannerStateService, BannerStateContext, BannerStateResult } from '../services/bannerStateService';
import { CleaningSession } from '../types';

export type CleanerStatus = 'relax' | 'scheduled' | 'ready' | 'active' | 'break' | 'awaiting_photos' | 'day_wrap';

interface CleanerStatusBannerProps {
  sessions: CleaningSession[];
  activeSession?: CleaningSession;
  nextSession?: CleaningSession;
  userRole: 'cleaner' | 'property_owner' | 'co_host';
  isOnline: boolean;
  onActionPress?: (action: string) => void;
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
  sessions,
  activeSession,
  nextSession,
  userRole,
  isOnline,
  onActionPress
}: CleanerStatusBannerProps) {
  const [bannerState, setBannerState] = useState<BannerStateResult | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute for time-based state changes
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Calculate banner state whenever dependencies change
    const context: BannerStateContext = {
      sessions,
      currentTime,
      activeSession,
      nextSession,
      userRole,
      isOnline
    };

    const state = BannerStateService.calculateBannerState(context);
    setBannerState(state);
  }, [sessions, activeSession, nextSession, userRole, isOnline, currentTime]);

  if (!bannerState) {
    return null;
  }

  const config = statusConfig[bannerState.status];
  const displayMessage = bannerState.message || config.defaultMessage;

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m remaining`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m remaining`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return config.textColor;
    }
  };

  const handleActionPress = () => {
    if (bannerState.nextAction && onActionPress) {
      onActionPress(bannerState.nextAction);
    }
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        borderWidth: bannerState.priority === 'urgent' ? 2 : 1,
      }
    ]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={config.icon} 
          size={24} 
          color={config.textColor} 
        />
        {bannerState.priority === 'urgent' && (
          <View style={styles.urgentIndicator}>
            <Ionicons name="warning" size={12} color="#ef4444" />
          </View>
        )}
      </View>
      
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: config.textColor }]}>
            {config.title}
          </Text>
          {bannerState.actionRequired && (
            <View style={styles.actionRequiredBadge}>
              <Text style={styles.actionRequiredText}>Action Required</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.message}>
          {displayMessage}
        </Text>
        
        {bannerState.timeRemaining && bannerState.timeRemaining > 0 && (
          <Text style={[styles.timeText, { color: getPriorityColor(bannerState.priority) }]}>
            {formatTimeRemaining(bannerState.timeRemaining)}
          </Text>
        )}
        
        {bannerState.urgencyReason && (
          <Text style={styles.urgencyReason}>
            ⚠️ {bannerState.urgencyReason}
          </Text>
        )}
        
        {bannerState.nextAction && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleActionPress}
          >
            <Text style={styles.actionButtonText}>
              {bannerState.nextAction}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    position: 'relative',
  },
  urgentIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 2,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  actionRequiredBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionRequiredText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  urgencyReason: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
});
