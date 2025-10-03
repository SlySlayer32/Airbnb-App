import { BannerStateService, BannerStateContext } from '../bannerStateService';
import { CleaningSession } from '../../types';

// Mock data for testing
const mockSession: CleaningSession = {
  id: 'test-session-1',
  property_id: 'test-property-1',
  assigned_cleaner_id: 'test-cleaner-1',
  guest_count: 4,
  checkin_time: '15:00',
  checkout_time: '11:00',
  scheduled_cleaning_time: '2025-09-28T12:00:00Z',
  session_type: 'checkout_clean',
  status: 'scheduled',
  properties: { name: 'Test Property', owner_id: 'test-owner-1' },
  team_members: { name: 'Test Cleaner', phone: '+1234567890' }
};

const mockActiveSession: CleaningSession = {
  ...mockSession,
  id: 'test-active-session',
  status: 'in_progress',
  cleaner_started_at: '2025-09-28T12:00:00Z',
  dashboard_metadata: {
    time_until_start_minutes: 0,
    cleaning_window_status: 'valid',
    is_within_cleaning_window: true,
    is_overdue: false,
    has_started: true,
    has_completed: false,
    expected_completion_time: '2025-09-28T14:00:00Z',
    cleaning_window_start: '11:00',
    cleaning_window_end: '15:00',
    status_indicator: 'in_progress',
    priority_level: 'medium'
  }
};

const mockPausedSession: CleaningSession = {
  ...mockActiveSession,
  id: 'test-paused-session',
  is_currently_paused: true,
  cleaner_paused_at: '2025-09-28T13:00:00Z',
  total_break_minutes: 15
};

const mockPhotoRequiredSession: CleaningSession = {
  ...mockActiveSession,
  id: 'test-photo-session',
  guest_count: 5, // Triggers photo requirements
  photos_required: true,
  photos_completed: false
};

describe('BannerStateService', () => {
  const baseContext: BannerStateContext = {
    sessions: [mockSession],
    currentTime: new Date('2025-09-28T12:30:00Z'),
    userRole: 'cleaner',
    isOnline: true
  };

  describe('calculateBannerState', () => {
    it('should return relax state for non-cleaner users', () => {
      const context = { ...baseContext, userRole: 'property_owner' as const };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('relax');
      expect(result.message).toBe('Banner not applicable for this user role');
      expect(result.priority).toBe('low');
    });

    it('should return offline state when not connected', () => {
      const context = { ...baseContext, isOnline: false };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('relax');
      expect(result.message).toBe('Working offline - sync when connection restored');
      expect(result.priority).toBe('medium');
      expect(result.actionRequired).toBe(true);
      expect(result.nextAction).toBe('Check internet connection');
    });

    it('should prioritize active session states', () => {
      const context = { ...baseContext, activeSession: mockActiveSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('active');
      expect(result.message).toContain('Cleaning in progress');
      expect(result.priority).toBe('medium');
    });

    it('should show awaiting photos state when photos required', () => {
      const context = { ...baseContext, activeSession: mockPhotoRequiredSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('awaiting_photos');
      expect(result.message).toContain('Please take');
      expect(result.priority).toBe('high');
      expect(result.actionRequired).toBe(true);
      expect(result.nextAction).toBe('Capture required photos to complete session');
    });

    it('should show break state for paused sessions', () => {
      const context = { ...baseContext, activeSession: mockPausedSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('break');
      expect(result.message).toContain('Break time');
      expect(result.priority).toBe('medium');
    });

    it('should show urgent priority for long breaks', () => {
      const longBreakSession = {
        ...mockPausedSession,
        cleaner_paused_at: '2025-09-28T11:00:00Z', // 1.5 hours ago
        total_break_minutes: 0
      };
      const context = { ...baseContext, activeSession: longBreakSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('break');
      expect(result.priority).toBe('high');
      expect(result.actionRequired).toBe(true);
      expect(result.nextAction).toBe('Consider resuming session soon');
      expect(result.urgencyReason).toBe('Extended break duration');
    });

    it('should show ready state for next session starting soon', () => {
      const nextSession = {
        ...mockSession,
        scheduled_cleaning_time: '2025-09-28T13:00:00Z' // 30 minutes from now
      };
      const context = { ...baseContext, nextSession: nextSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('ready');
      expect(result.message).toContain('Ready to start cleaning');
      expect(result.priority).toBe('high');
      expect(result.timeRemaining).toBe(30);
    });

    it('should show urgent priority for overdue sessions', () => {
      const overdueSession = {
        ...mockSession,
        scheduled_cleaning_time: '2025-09-28T11:00:00Z' // 1.5 hours ago
      };
      const context = { ...baseContext, nextSession: overdueSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('ready');
      expect(result.message).toContain('OVERDUE');
      expect(result.priority).toBe('urgent');
      expect(result.urgencyReason).toBeUndefined(); // Not set for next session
    });

    it('should show scheduled state for future sessions', () => {
      const futureSession = {
        ...mockSession,
        scheduled_cleaning_time: '2025-09-28T15:00:00Z' // 2.5 hours from now
      };
      const context = { ...baseContext, nextSession: futureSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('scheduled');
      expect(result.message).toContain('Next cleaning');
      expect(result.priority).toBe('low');
      expect(result.timeRemaining).toBe(150);
    });
  });

  describe('Time-based state changes', () => {
    it('should show morning preparation state (8:00 AM - 10:00 AM)', () => {
      const morningTime = new Date('2025-09-28T09:00:00Z');
      const context = { ...baseContext, currentTime: morningTime };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('scheduled');
      expect(result.message).toContain('Good morning!');
      expect(result.priority).toBe('medium');
      expect(result.actionRequired).toBe(true);
      expect(result.nextAction).toBe('Review schedule and prepare for first cleaning');
    });

    it('should show lunch break reminder (12:00 PM - 1:00 PM)', () => {
      const lunchTime = new Date('2025-09-28T12:30:00Z');
      const activeSession = { ...mockActiveSession, status: 'in_progress' as const };
      const context = { 
        ...baseContext, 
        currentTime: lunchTime,
        sessions: [activeSession]
      };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('break');
      expect(result.message).toContain('Lunch break time!');
      expect(result.priority).toBe('medium');
      expect(result.actionRequired).toBe(true);
      expect(result.nextAction).toBe('Take a well-deserved lunch break');
    });

    it('should show end of day wrap-up (3:00 PM - 4:00 PM)', () => {
      const endOfDayTime = new Date('2025-09-28T15:30:00Z');
      const completedSession = { ...mockSession, status: 'completed' as const };
      const context = { 
        ...baseContext, 
        currentTime: endOfDayTime,
        sessions: [completedSession]
      };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('day_wrap');
      expect(result.message).toContain('Excellent work!');
      expect(result.priority).toBe('low');
      expect(result.actionRequired).toBe(false);
    });

    it('should show urgent state for incomplete sessions at end of day', () => {
      const endOfDayTime = new Date('2025-09-28T15:30:00Z');
      const incompleteSession = { ...mockSession, status: 'scheduled' as const };
      const context = { 
        ...baseContext, 
        currentTime: endOfDayTime,
        sessions: [incompleteSession]
      };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('ready');
      expect(result.message).toContain('still pending');
      expect(result.priority).toBe('high');
      expect(result.actionRequired).toBe(true);
      expect(result.urgencyReason).toBe('Cleaning window closing soon');
    });
  });

  describe('State transitions validation', () => {
    it('should validate valid state transitions', () => {
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
      expect(BannerStateService.validateStateTransition('awaiting_photos', 'break')).toBe(false);
    });
  });

  describe('Status priority calculation', () => {
    it('should return correct priority values', () => {
      expect(BannerStateService.getStatusPriority('awaiting_photos')).toBe(4);
      expect(BannerStateService.getStatusPriority('active')).toBe(3);
      expect(BannerStateService.getStatusPriority('ready')).toBe(2);
      expect(BannerStateService.getStatusPriority('break')).toBe(2);
      expect(BannerStateService.getStatusPriority('scheduled')).toBe(1);
      expect(BannerStateService.getStatusPriority('day_wrap')).toBe(0);
      expect(BannerStateService.getStatusPriority('relax')).toBe(0);
    });
  });

  describe('Photo requirements calculation', () => {
    it('should require photos for high guest count sessions', () => {
      const highGuestSession = { ...mockActiveSession, guest_count: 5 };
      const context = { ...baseContext, activeSession: highGuestSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('awaiting_photos');
      expect(result.message).toContain('Please take');
    });

    it('should require photos for large properties', () => {
      const largePropertySession = { 
        ...mockActiveSession, 
        properties: { name: 'Large Property', owner_id: 'test-owner', rooms: 4 }
      };
      const context = { ...baseContext, activeSession: largePropertySession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('awaiting_photos');
    });

    it('should not require photos for small sessions', () => {
      const smallSession = { 
        ...mockActiveSession, 
        guest_count: 2,
        properties: { name: 'Small Property', owner_id: 'test-owner', rooms: 1 }
      };
      const context = { ...baseContext, activeSession: smallSession };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.status).toBe('active');
      expect(result.message).toContain('Cleaning in progress');
    });
  });

  describe('Session timing calculations', () => {
    it('should calculate correct session duration', () => {
      const sessionWithBreaks = {
        ...mockActiveSession,
        cleaner_started_at: '2025-09-28T12:00:00Z',
        total_break_minutes: 15
      };
      const currentTime = new Date('2025-09-28T13:00:00Z');
      
      // 60 minutes total - 15 minutes break = 45 minutes working time
      const context = { ...baseContext, activeSession: sessionWithBreaks, currentTime };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.message).toContain('45min elapsed');
    });

    it('should detect running late sessions', () => {
      const lateSession = {
        ...mockActiveSession,
        dashboard_metadata: {
          ...mockActiveSession.dashboard_metadata!,
          expected_completion_time: '2025-09-28T13:00:00Z' // 30 minutes ago
        }
      };
      const currentTime = new Date('2025-09-28T13:30:00Z');
      const context = { ...baseContext, activeSession: lateSession, currentTime };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.priority).toBe('high');
      expect(result.actionRequired).toBe(true);
      expect(result.urgencyReason).toBe('Session running behind schedule');
    });

    it('should detect overdue sessions', () => {
      const overdueSession = {
        ...mockActiveSession,
        dashboard_metadata: {
          ...mockActiveSession.dashboard_metadata!,
          expected_completion_time: '2025-09-28T12:00:00Z' // 1.5 hours ago
        }
      };
      const currentTime = new Date('2025-09-28T13:30:00Z');
      const context = { ...baseContext, activeSession: overdueSession, currentTime };
      const result = BannerStateService.calculateBannerState(context);
      
      expect(result.priority).toBe('urgent');
      expect(result.actionRequired).toBe(true);
      expect(result.urgencyReason).toBe('Session significantly overdue');
      expect(result.nextAction).toBe('Complete session immediately');
    });
  });
});