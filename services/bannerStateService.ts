import { CleaningSession, BannerState, BannerTransition } from '@/types';
import { CleanerStatus } from '@/components/CleanerStatusBanner';

export interface BannerStateContext {
  sessions: CleaningSession[];
  currentTime: Date;
  activeSession?: CleaningSession;
  nextSession?: CleaningSession;
  userRole: 'cleaner' | 'property_owner' | 'co_host';
  isOnline: boolean;
}

export interface BannerStateResult {
  status: CleanerStatus;
  message?: string;
  timeRemaining?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  nextAction?: string;
  urgencyReason?: string;
}

/**
 * Intelligent banner state machine for cleaner dashboard
 * Determines the most appropriate status and message based on session context
 */
export class BannerStateService {
  
  /**
   * Calculate the optimal banner state based on current session context
   * Enhanced with intelligent state machine logic and time-based transitions
   */
  static calculateBannerState(context: BannerStateContext): BannerStateResult {
    const { sessions, currentTime, activeSession, nextSession, userRole, isOnline } = context;
    
    // Only show banner for cleaners
    if (userRole !== 'cleaner') {
      return {
        status: 'relax',
        message: 'Banner not applicable for this user role',
        priority: 'low'
      };
    }
    
    // Check for offline state
    if (!isOnline) {
      return {
        status: 'relax',
        message: 'Working offline - sync when connection restored',
        priority: 'medium',
        actionRequired: true,
        nextAction: 'Check internet connection'
      };
    }
    
    // Priority 1: Active session states (highest priority)
    if (activeSession) {
      return this.calculateActiveSessionState(activeSession, currentTime);
    }
    
    // Priority 2: Next session states
    if (nextSession) {
      return this.calculateNextSessionState(nextSession, currentTime);
    }
    
    // Priority 3: Time-based automatic state changes
    const timeBasedState = this.calculateTimeBasedState(currentTime, sessions);
    if (timeBasedState) {
      return timeBasedState;
    }
    
    // Priority 4: Overall day state
    return this.calculateDayState(sessions, currentTime);
  }
  
  /**
   * Calculate state when there's an active cleaning session
   * Enhanced with intelligent urgency detection and action guidance
   */
  private static calculateActiveSessionState(session: CleaningSession, currentTime: Date): BannerStateResult {
    const isPaused = session.is_currently_paused || false;
    const hasStarted = !!session.cleaner_started_at;
    
    // Check if photos are required and not completed
    const photoRequirements = this.checkPhotoRequirements(session);
    if (photoRequirements.required && !photoRequirements.completed) {
      const isRunningLate = this.isSessionRunningLate(session, currentTime);
      return {
        status: 'awaiting_photos',
        message: `Please take ${photoRequirements.requiredCount} completion photos to finish ${session.properties?.name}`,
        priority: isRunningLate ? 'urgent' : 'high',
        actionRequired: true,
        nextAction: 'Capture required photos to complete session',
        urgencyReason: isRunningLate ? 'Session running late' : 'Photos required for completion'
      };
    }
    
    // Check if session is paused
    if (isPaused) {
      const pauseDuration = this.calculatePauseDuration(session, currentTime);
      const isLongBreak = pauseDuration > 30; // More than 30 minutes
      
      return {
        status: 'break',
        message: `Break time at ${session.properties?.name} - ${pauseDuration}min break taken`,
        priority: isLongBreak ? 'high' : 'medium',
        actionRequired: isLongBreak,
        nextAction: isLongBreak ? 'Consider resuming session soon' : 'Take your time',
        urgencyReason: isLongBreak ? 'Extended break duration' : undefined
      };
    }
    
    // Active cleaning session
    const sessionDuration = this.calculateSessionDuration(session, currentTime);
    const isRunningLate = this.isSessionRunningLate(session, currentTime);
    const isOverdue = this.isSessionOverdue(session, currentTime);
    
    let urgencyReason: string | undefined;
    if (isOverdue) {
      urgencyReason = 'Session significantly overdue';
    } else if (isRunningLate) {
      urgencyReason = 'Session running behind schedule';
    }
    
    return {
      status: 'active',
      message: `Cleaning in progress at ${session.properties?.name} - ${sessionDuration}min elapsed`,
      priority: isOverdue ? 'urgent' : (isRunningLate ? 'high' : 'medium'),
      actionRequired: isOverdue || isRunningLate,
      nextAction: isOverdue ? 'Complete session immediately' : (isRunningLate ? 'Focus on completing session' : 'Continue cleaning'),
      urgencyReason
    };
  }
  
  /**
   * Calculate state when there's a next scheduled session
   */
  private static calculateNextSessionState(session: CleaningSession, currentTime: Date): BannerStateResult {
    const scheduledTime = new Date(session.scheduled_cleaning_time);
    const timeUntilStart = scheduledTime.getTime() - currentTime.getTime();
    const minutesUntilStart = Math.ceil(timeUntilStart / (1000 * 60));
    
    // Check if session is overdue
    if (minutesUntilStart < 0) {
      const overdueMinutes = Math.abs(minutesUntilStart);
      return {
        status: 'ready',
        message: `OVERDUE: ${session.properties?.name} cleaning is ${overdueMinutes}min late!`,
        timeRemaining: overdueMinutes,
        priority: 'urgent'
      };
    }
    
    // Check if session is starting soon (within 30 minutes)
    if (minutesUntilStart <= 30) {
      const urgency = minutesUntilStart <= 15 ? 'urgent' : 'high';
      return {
        status: 'ready',
        message: `Ready to start cleaning at ${session.properties?.name}`,
        timeRemaining: minutesUntilStart,
        priority: urgency
      };
    }
    
    // Session is scheduled but not yet ready
    return {
      status: 'scheduled',
      message: `Next cleaning at ${session.properties?.name} in ${Math.floor(minutesUntilStart / 60)}h ${minutesUntilStart % 60}m`,
      timeRemaining: minutesUntilStart,
      priority: 'low'
    };
  }
  
  /**
   * Calculate time-based automatic state changes
   * Business Rule: Automatic state transitions based on time of day
   */
  private static calculateTimeBasedState(currentTime: Date, sessions: CleaningSession[]): BannerStateResult | null {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const timeOfDay = hour * 60 + minute; // Convert to minutes for easier comparison
    
    // Morning preparation (8:00 AM - 10:00 AM)
    if (timeOfDay >= 480 && timeOfDay < 600) {
      const upcomingSessions = sessions.filter(s => 
        s.status === 'scheduled' && 
        new Date(s.scheduled_cleaning_time).getTime() > currentTime.getTime()
      );
      
      if (upcomingSessions.length > 0) {
        return {
          status: 'scheduled',
          message: `Good morning! ${upcomingSessions.length} cleaning${upcomingSessions.length > 1 ? 's' : ''} scheduled today`,
          priority: 'medium',
          actionRequired: true,
          nextAction: 'Review schedule and prepare for first cleaning'
        };
      }
    }
    
    // Lunch break reminder (12:00 PM - 1:00 PM)
    if (timeOfDay >= 720 && timeOfDay < 780) {
      const activeSessions = sessions.filter(s => s.status === 'in_progress');
      if (activeSessions.length > 0) {
        return {
          status: 'break',
          message: 'Lunch break time! Consider pausing active sessions',
          priority: 'medium',
          actionRequired: true,
          nextAction: 'Take a well-deserved lunch break'
        };
      }
    }
    
    // End of day wrap-up (3:00 PM - 4:00 PM)
    if (timeOfDay >= 900 && timeOfDay < 960) {
      const incompleteSessions = sessions.filter(s => 
        s.status !== 'completed' && s.status !== 'cancelled'
      );
      
      if (incompleteSessions.length === 0) {
        return {
          status: 'day_wrap',
          message: 'Excellent work! All cleanings completed for today',
          priority: 'low',
          actionRequired: false,
          nextAction: 'Review today\'s work and prepare for tomorrow'
        };
      } else {
        return {
          status: 'ready',
          message: `${incompleteSessions.length} cleaning${incompleteSessions.length > 1 ? 's' : ''} still pending`,
          priority: 'high',
          actionRequired: true,
          nextAction: 'Complete remaining cleanings before end of day',
          urgencyReason: 'Cleaning window closing soon'
        };
      }
    }
    
    return null; // No time-based state change needed
  }
  
  /**
   * Calculate overall day state when no active or immediate sessions
   */
  private static calculateDayState(sessions: CleaningSession[], currentTime: Date): BannerStateResult {
    const hour = currentTime.getHours();
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const totalSessions = sessions.length;
    
    // If it's after 3 PM and all sessions are complete
    if (hour >= 15 && completedSessions === totalSessions && totalSessions > 0) {
      return {
        status: 'day_wrap',
        message: `Great work! All ${totalSessions} cleaning${totalSessions > 1 ? 's' : ''} completed today.`,
        priority: 'low'
      };
    }
    
    // If it's early morning (before 10 AM) and no sessions yet
    if (hour < 10 && sessions.length === 0) {
      return {
        status: 'relax',
        message: 'Good morning! No cleanings scheduled for today.',
        priority: 'low'
      };
    }
    
    // If it's late afternoon and no more sessions
    if (hour >= 16 && sessions.every(s => s.status === 'completed' || s.status === 'cancelled')) {
      return {
        status: 'relax',
        message: 'All scheduled cleanings are complete. Enjoy your evening!',
        priority: 'low'
      };
    }
    
    // Default relax state
    return {
      status: 'relax',
      message: 'No active cleanings. Check your schedule for upcoming sessions.',
      priority: 'low'
    };
  }
  
  /**
   * Check photo requirements for a session
   */
  private static checkPhotoRequirements(session: CleaningSession): {
    required: boolean;
    completed: boolean;
    requiredCount: number;
  } {
    // Mock logic: require photos for sessions with 3+ guests or properties with 3+ rooms
    const guestCount = session.guest_count || 0;
    const propertyRooms = (session.properties as any)?.rooms || 0;
    
    const required = guestCount >= 3 || propertyRooms >= 3;
    const completed = session.photos_completed || false;
    
    // Calculate required photo count
    const basePhotos = 2;
    const guestMultiplier = Math.min(guestCount, 6) * 0.5;
    const sizeMultiplier = Math.min(propertyRooms / 2, 2);
    const requiredCount = Math.min(Math.max(basePhotos + guestMultiplier + sizeMultiplier, 2), 4);
    
    return { required, completed, requiredCount: Math.ceil(requiredCount) };
  }
  
  /**
   * Calculate pause duration in minutes
   */
  private static calculatePauseDuration(session: CleaningSession, currentTime: Date): number {
    if (!session.cleaner_paused_at) return 0;
    
    const pauseStart = new Date(session.cleaner_paused_at);
    const totalBreakMinutes = session.total_break_minutes || 0;
    const currentPauseMinutes = Math.floor((currentTime.getTime() - pauseStart.getTime()) / (1000 * 60));
    
    return totalBreakMinutes + currentPauseMinutes;
  }
  
  /**
   * Calculate session duration in minutes
   */
  private static calculateSessionDuration(session: CleaningSession, currentTime: Date): number {
    if (!session.cleaner_started_at) return 0;
    
    const startTime = new Date(session.cleaner_started_at);
    const totalMinutes = Math.floor((currentTime.getTime() - startTime.getTime()) / (1000 * 60));
    const breakMinutes = session.total_break_minutes || 0;
    
    return Math.max(0, totalMinutes - breakMinutes);
  }
  
  /**
   * Check if session is running late
   */
  private static isSessionRunningLate(session: CleaningSession, currentTime: Date): boolean {
    if (!session.dashboard_metadata?.expected_completion_time) return false;
    
    const expectedTime = new Date(session.dashboard_metadata.expected_completion_time);
    return currentTime > expectedTime;
  }
  
  /**
   * Check if session is significantly overdue (more than 30 minutes late)
   */
  private static isSessionOverdue(session: CleaningSession, currentTime: Date): boolean {
    if (!session.dashboard_metadata?.expected_completion_time) return false;
    
    const expectedTime = new Date(session.dashboard_metadata.expected_completion_time);
    const overdueMinutes = Math.floor((currentTime.getTime() - expectedTime.getTime()) / (1000 * 60));
    return overdueMinutes > 30;
  }
  
  /**
   * Get status priority for sorting/display
   */
  static getStatusPriority(status: CleanerStatus): number {
    const priorities = {
      'awaiting_photos': 4,
      'active': 3,
      'ready': 2,
      'break': 2,
      'scheduled': 1,
      'day_wrap': 0,
      'relax': 0
    };
    
    return priorities[status] || 0;
  }
  
  /**
   * Validate state transitions (for testing)
   */
  static validateStateTransition(from: CleanerStatus, to: CleanerStatus): boolean {
    const validTransitions: Record<CleanerStatus, CleanerStatus[]> = {
      'relax': ['scheduled', 'ready', 'active', 'day_wrap'],
      'scheduled': ['ready', 'active', 'relax'],
      'ready': ['active', 'break', 'awaiting_photos'],
      'active': ['break', 'awaiting_photos', 'relax', 'day_wrap'],
      'break': ['active', 'awaiting_photos'],
      'awaiting_photos': ['relax', 'day_wrap'],
      'day_wrap': ['relax']
    };
    
    return validTransitions[from]?.includes(to) || false;
  }
}
