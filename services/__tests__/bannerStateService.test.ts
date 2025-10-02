import { BannerStateService, BannerStateContext } from '../bannerStateService';
import { CleaningSession } from '@/types';

// Mock data for testing
const mockSessions: CleaningSession[] = [
  {
    id: '1',
    property_id: 'prop1',
    guest_count: 4,
    checkin_time: '2024-01-01T15:00:00Z',
    checkout_time: '2024-01-01T11:00:00Z',
    scheduled_cleaning_time: '2024-01-01T12:00:00Z',
    session_type: 'checkout_clean',
    status: 'in_progress',
    cleaner_started_at: '2024-01-01T12:00:00Z',
    properties: { name: 'Test Property', owner_id: 'owner1' },
    dashboard_metadata: {
      time_until_start_minutes: 0,
      cleaning_window_status: 'valid',
      is_within_cleaning_window: true,
      is_overdue: false,
      has_started: true,
      has_completed: false,
      expected_completion_time: '2024-01-01T14:00:00Z',
      cleaning_window_start: '2024-01-01T11:00:00Z',
      cleaning_window_end: '2024-01-01T15:00:00Z',
      status_indicator: 'in_progress',
      priority_level: 'medium'
    }
  },
  {
    id: '2',
    property_id: 'prop2',
    guest_count: 2,
    checkin_time: '2024-01-01T15:00:00Z',
    checkout_time: '2024-01-01T11:00:00Z',
    scheduled_cleaning_time: '2024-01-01T16:00:00Z',
    session_type: 'checkout_clean',
    status: 'scheduled',
    properties: { name: 'Next Property', owner_id: 'owner2' },
    dashboard_metadata: {
      time_until_start_minutes: 60,
      cleaning_window_status: 'valid',
      is_within_cleaning_window: true,
      is_overdue: false,
      has_started: false,
      has_completed: false,
      expected_completion_time: '2024-01-01T18:00:00Z',
      cleaning_window_start: '2024-01-01T11:00:00Z',
      cleaning_window_end: '2024-01-01T15:00:00Z',
      status_indicator: 'scheduled',
      priority_level: 'normal'
    }
  }
];

describe('BannerStateService', () => {
  const baseContext: BannerStateContext = {
    sessions: mockSessions,
    currentTime: new Date('2024-01-01T13:00:00Z'), // 1 PM
    activeSession: mockSessions[0],
    nextSession: mockSessions[1]
  };

  describe('calculateBannerState', () => {
    it('should return active status for in-progress session', () => {
      const result = BannerStateService.calculateBannerState(baseContext);
      
      expect(result.status).toBe('active');
      expect(result.message).toContain('Cleaning in progress');
      expect(result.priority).toBe('medium');
    });

    it('should return break status for paused session', () => {
      const pausedSession = {
        ...mockSessions[0],
        is_currently_paused: true,
        cleaner_paused_at: '2024-01-01T12:30:00Z',
        total_break_minutes: 15
      };
      
      const context = {
        ...baseContext,
        activeSession: pausedSession
      };
      
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('break');
      expect(result.message).toContain('Break time');
      expect(result.priority).toBe('medium');
    });

    it('should return awaiting_photos for session requiring photos', () => {
      const photoRequiredSession = {
        ...mockSessions[0],
        guest_count: 4, // Triggers photo requirement (3+ guests)
        photos_completed: false
      };
      
      const context = {
        ...baseContext,
        activeSession: photoRequiredSession
      };
      
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('awaiting_photos');
      expect(result.message).toContain('completion photos');
      expect(result.priority).toBe('high');
    });

    it('should return ready status for overdue next session', () => {
      const overdueSession = {
        ...mockSessions[1],
        scheduled_cleaning_time: '2024-01-01T12:00:00Z' // 1 hour ago
      };
      
      const context = {
        ...baseContext,
        activeSession: undefined,
        nextSession: overdueSession
      };
      
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('ready');
      expect(result.message).toContain('OVERDUE');
      expect(result.priority).toBe('urgent');
    });

    it('should return ready status for session starting soon', () => {
      const soonSession = {
        ...mockSessions[1],
        scheduled_cleaning_time: '2024-01-01T13:15:00Z' // 15 minutes from now
      };
      
      const context = {
        ...baseContext,
        activeSession: undefined,
        nextSession: soonSession
      };
      
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('ready');
      expect(result.message).toContain('Ready to start');
      expect(result.priority).toBe('high');
    });

    it('should return scheduled status for future session', () => {
      const futureSession = {
        ...mockSessions[1],
        scheduled_cleaning_time: '2024-01-01T15:00:00Z' // 2 hours from now
      };
      
      const context = {
        ...baseContext,
        activeSession: undefined,
        nextSession: futureSession
      };
      
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('scheduled');
      expect(result.message).toContain('Next cleaning');
      expect(result.priority).toBe('low');
    });

    it('should return day_wrap status when all sessions complete after 3 PM', () => {
      const completedSessions = mockSessions.map(s => ({ ...s, status: 'completed' as const }));
      
      const context = {
        ...baseContext,
        sessions: completedSessions,
        activeSession: undefined,
        nextSession: undefined,
        currentTime: new Date('2024-01-01T16:00:00Z') // 4 PM
      };
      
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('day_wrap');
      expect(result.message).toContain('All cleanings completed');
      expect(result.priority).toBe('low');
    });

    it('should return relax status when no sessions', () => {
      const context = {
        ...baseContext,
        sessions: [],
        activeSession: undefined,
        nextSession: undefined
      };
      
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('relax');
      expect(result.priority).toBe('low');
    });
  });

  describe('getStatusPriority', () => {
    it('should return correct priority levels', () => {
      expect(BannerStateService.getStatusPriority('awaiting_photos')).toBe(4);
      expect(BannerStateService.getStatusPriority('active')).toBe(3);
      expect(BannerStateService.getStatusPriority('ready')).toBe(2);
      expect(BannerStateService.getStatusPriority('break')).toBe(2);
      expect(BannerStateService.getStatusPriority('scheduled')).toBe(1);
      expect(BannerStateService.getStatusPriority('day_wrap')).toBe(0);
      expect(BannerStateService.getStatusPriority('relax')).toBe(0);
    });
  });

  describe('validateStateTransition', () => {
    it('should validate correct state transitions', () => {
      expect(BannerStateService.validateStateTransition('relax', 'scheduled')).toBe(true);
      expect(BannerStateService.validateStateTransition('scheduled', 'ready')).toBe(true);
      expect(BannerStateService.validateStateTransition('ready', 'active')).toBe(true);
      expect(BannerStateService.validateStateTransition('active', 'break')).toBe(true);
      expect(BannerStateService.validateStateTransition('break', 'active')).toBe(true);
      expect(BannerStateService.validateStateTransition('active', 'awaiting_photos')).toBe(true);
      expect(BannerStateService.validateStateTransition('awaiting_photos', 'day_wrap')).toBe(true);
    });

    it('should reject invalid state transitions', () => {
      expect(BannerStateService.validateStateTransition('relax', 'active')).toBe(false);
      expect(BannerStateService.validateStateTransition('day_wrap', 'active')).toBe(false);
      expect(BannerStateService.validateStateTransition('break', 'scheduled')).toBe(false);
    });
  });
});
