import { supabase } from '@/lib/supabase';
import { CleaningSession } from '@/types';

export const cleaningSessionService = {
  // Create a new cleaning session
  async createSession(sessionData: Omit<CleaningSession, 'id'>): Promise<CleaningSession> {
    const { data, error } = await supabase
      .from('cleaning_sessions')
      .insert(sessionData)
      .select(`
        *,
        properties (name, owner_id),
        team_members (name, phone)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update session status and send notifications
  async updateSessionStatus(sessionId: string, updates: Partial<CleaningSession>): Promise<CleaningSession> {
    const { data, error } = await supabase
      .from('cleaning_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select(`
        *,
        properties (name, owner_id),
        team_members (name, phone)
      `)
      .single();

    if (error) throw error;

    // Handle status change notifications
    await this.handleStatusChangeNotifications(data, updates);

    return data;
  },

  // Cancel a session with notification
  async cancelSession(sessionId: string, cancellationData: {
    cancelled_by: string;
    cancellation_reason: string;
    cancellation_notice_hours: number;
  }): Promise<CleaningSession> {
    const now = new Date().toISOString();
    
    const updates = {
      status: 'cancelled' as const,
      cancelled_at: now,
      cancelled_by: cancellationData.cancelled_by,
      cancellation_reason: cancellationData.cancellation_reason,
      cancellation_notice_hours: cancellationData.cancellation_notice_hours
    };

    return this.updateSessionStatus(sessionId, updates);
  },

  // Start a cleaning session (cleaner arrives)
  async startCleaning(sessionId: string): Promise<CleaningSession> {
    const now = new Date().toISOString();
    
    const session = await this.updateSessionStatus(sessionId, {
      status: 'in_progress',
      cleaner_arrived_at: now,
      cleaner_started_at: now,
      is_currently_paused: false
    });

    // Record the session start event
    const { cleaningUpdateService } = await import('./cleaningUpdateService');
    await cleaningUpdateService.recordSessionStart(sessionId, session.properties?.name);

    return session;
  },

  // Pause an active cleaning session
  async pauseSession(sessionId: string, reason?: string): Promise<CleaningSession> {
    const now = new Date().toISOString();
    
    // First, get the current session to validate state and calculate break time
    const { data: currentSession, error: fetchError } = await supabase
      .from('cleaning_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError) throw fetchError;
    
    if (currentSession.status !== 'in_progress') {
      throw new Error('Only active sessions can be paused');
    }

    if (currentSession.is_currently_paused) {
      throw new Error('Session is already paused');
    }

    const session = await this.updateSessionStatus(sessionId, {
      cleaner_paused_at: now,
      is_currently_paused: true
    });

    // Record the pause event
    const { cleaningUpdateService } = await import('./cleaningUpdateService');
    await cleaningUpdateService.recordSessionPause(sessionId, reason);

    return session;
  },

  // Resume a paused cleaning session
  async resumeSession(sessionId: string): Promise<CleaningSession> {
    const now = new Date().toISOString();
    
    // First, get the current session to validate state and calculate break time
    const { data: currentSession, error: fetchError } = await supabase
      .from('cleaning_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError) throw fetchError;
    
    if (currentSession.status !== 'in_progress') {
      throw new Error('Only active sessions can be resumed');
    }

    if (!currentSession.is_currently_paused) {
      throw new Error('Session is not currently paused');
    }

    // Calculate break time if we have a pause timestamp
    let totalBreakMinutes = currentSession.total_break_minutes || 0;
    if (currentSession.cleaner_paused_at) {
      const pauseTime = new Date(currentSession.cleaner_paused_at);
      const resumeTime = new Date(now);
      const breakMinutes = Math.floor((resumeTime.getTime() - pauseTime.getTime()) / (1000 * 60));
      totalBreakMinutes += breakMinutes;
    }

    const session = await this.updateSessionStatus(sessionId, {
      cleaner_resumed_at: now,
      is_currently_paused: false,
      total_break_minutes: totalBreakMinutes
    });

    // Record the resume event
    const { cleaningUpdateService } = await import('./cleaningUpdateService');
    await cleaningUpdateService.recordSessionResume(sessionId);

    return session;
  },

  // Complete a cleaning session
  async completeCleaning(sessionId: string, completionData: {
    actual_guest_count?: number;
    notes?: string;
    photos?: string[];
  }): Promise<CleaningSession> {
    const now = new Date().toISOString();
    
    // Get current session to calculate final break time if paused
    const { data: currentSession } = await supabase
      .from('cleaning_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    let totalBreakMinutes = currentSession?.total_break_minutes || 0;
    
    // If session is currently paused, add the final break time
    if (currentSession?.is_currently_paused && currentSession?.cleaner_paused_at) {
      const pauseTime = new Date(currentSession.cleaner_paused_at);
      const completeTime = new Date(now);
      const finalBreakMinutes = Math.floor((completeTime.getTime() - pauseTime.getTime()) / (1000 * 60));
      totalBreakMinutes += finalBreakMinutes;
    }

    const session = await this.updateSessionStatus(sessionId, {
      status: 'completed',
      cleaner_completed_at: now,
      actual_guest_count: completionData.actual_guest_count,
      is_currently_paused: false,
      total_break_minutes: totalBreakMinutes
    });

    // Record completion event with proper lifecycle tracking
    const { cleaningUpdateService } = await import('./cleaningUpdateService');
    await cleaningUpdateService.recordSessionComplete(
      sessionId, 
      session.properties?.name, 
      completionData.notes
    );

    // Add additional completion update with photos if provided
    if (completionData.photos?.length) {
      await cleaningUpdateService.addUpdate(sessionId, {
        update_type: 'completion',
        message: 'Completion photos uploaded',
        photo_urls: completionData.photos
      });
    }

    return session;
  },

  // Get today's sessions for cleaner dashboard with enhanced metadata
  async getTodaySessions(): Promise<CleaningSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get cleaner's team member ID
    const { data: teamMember, error: teamError } = await supabase
      .from('team_members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (teamError) throw teamError;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const { data, error } = await supabase
      .from('cleaning_sessions')
      .select(`
        *,
        properties (
          name, 
          address, 
          access_method, 
          access_code, 
          access_instructions, 
          wifi_name, 
          wifi_password,
          default_checkin_time,
          default_checkout_time,
          estimated_cleaning_duration,
          emergency_contact_name,
          emergency_contact_phone,
          cleaning_supplies_location,
          linen_storage_location
        ),
        team_members (name, phone),
        linen_requirements (*)
      `)
      .eq('assigned_cleaner_id', teamMember.id)
      .gte('scheduled_cleaning_time', startOfDay)
      .lt('scheduled_cleaning_time', endOfDay)
      .order('scheduled_cleaning_time', { ascending: true });

    if (error) throw error;

    // Enhance sessions with dashboard metadata
    const enhancedSessions = (data || []).map(session => {
      const scheduledTime = new Date(session.scheduled_cleaning_time);
      const checkoutTime = new Date(session.checkout_time);
      const checkinTime = new Date(session.checkin_time);
      
      // Calculate time-based metadata
      const currentTime = new Date();
      const timeUntilStart = scheduledTime.getTime() - currentTime.getTime();
      const timeUntilStartMinutes = Math.ceil(timeUntilStart / (1000 * 60));
      
      // Cleaning window validation (11 AM - 3 PM)
      const cleaningWindowStart = new Date(scheduledTime);
      cleaningWindowStart.setHours(11, 0, 0, 0);
      const cleaningWindowEnd = new Date(scheduledTime);
      cleaningWindowEnd.setHours(15, 0, 0, 0);
      
      const isWithinWindow = scheduledTime >= cleaningWindowStart && scheduledTime <= cleaningWindowEnd;
      const windowStatus = isWithinWindow ? 'valid' : 'outside_window';
      
      // Progress indicators
      const hasStarted = !!session.cleaner_started_at;
      const hasCompleted = session.status === 'completed';
      const isOverdue = currentTime > scheduledTime && !hasStarted && session.status === 'scheduled';
      
      // Calculate expected completion time
      const estimatedDuration = session.properties?.estimated_cleaning_duration || 120; // default 2 hours
      const expectedCompletionTime = new Date(scheduledTime.getTime() + (estimatedDuration * 60 * 1000));
      
      return {
        ...session,
        // Dashboard-specific metadata
        dashboard_metadata: {
          time_until_start_minutes: timeUntilStartMinutes,
          cleaning_window_status: windowStatus,
          is_within_cleaning_window: isWithinWindow,
          is_overdue: isOverdue,
          has_started: hasStarted,
          has_completed: hasCompleted,
          expected_completion_time: expectedCompletionTime.toISOString(),
          cleaning_window_start: cleaningWindowStart.toISOString(),
          cleaning_window_end: cleaningWindowEnd.toISOString(),
          // Status indicators for dashboard
          status_indicator: hasCompleted ? 'completed' : 
                           hasStarted ? 'in_progress' : 
                           isOverdue ? 'overdue' : 
                           timeUntilStartMinutes <= 30 ? 'starting_soon' : 'scheduled',
          // Priority level for sorting/display
          priority_level: isOverdue ? 'urgent' : 
                         timeUntilStartMinutes <= 30 ? 'high' : 
                         timeUntilStartMinutes <= 120 ? 'medium' : 'normal'
        }
      };
    });

    return enhancedSessions;
  },

  // Get sessions for a cleaner (today and upcoming)
  async getCleanerSessions(period: 'today' | 'week' | 'all' = 'today'): Promise<CleaningSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get cleaner's team member ID
    const { data: teamMember, error: teamError } = await supabase
      .from('team_members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (teamError) throw teamError;

    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case 'today':
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
        dateFilter = `scheduled_cleaning_time.gte.${startOfDay},scheduled_cleaning_time.lt.${endOfDay}`;
        break;
      case 'week':
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        dateFilter = `scheduled_cleaning_time.gte.${now.toISOString()},scheduled_cleaning_time.lt.${weekFromNow}`;
        break;
      default:
        dateFilter = `scheduled_cleaning_time.gte.${now.toISOString()}`;
    }

    const { data, error } = await supabase
      .from('cleaning_sessions')
      .select(`
        *,
        properties (name, address, access_method, access_code, access_instructions, wifi_name, wifi_password),
        team_members (name, phone)
      `)
      .eq('assigned_cleaner_id', teamMember.id)
      .or(dateFilter)
      .order('scheduled_cleaning_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Calculate effective working time (excluding breaks)
  calculateEffectiveWorkingMinutes(session: CleaningSession): number {
    if (!session.cleaner_started_at) return 0;
    
    const startTime = new Date(session.cleaner_started_at);
    const endTime = session.cleaner_completed_at ? new Date(session.cleaner_completed_at) : new Date();
    const totalMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    const breakMinutes = session.total_break_minutes || 0;
    
    return Math.max(0, totalMinutes - breakMinutes);
  },

  // Get current session state with pause/resume context
  getSessionState(session: CleaningSession): 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled' {
    if (session.status === 'completed' || session.status === 'cancelled') {
      return session.status;
    }
    
    if (session.status === 'in_progress') {
      return session.is_currently_paused ? 'paused' : 'active';
    }
    
    return 'scheduled';
  },

  // Validate session can be paused
  canPauseSession(session: CleaningSession): boolean {
    return session.status === 'in_progress' && !session.is_currently_paused;
  },

  // Validate session can be resumed
  canResumeSession(session: CleaningSession): boolean {
    return session.status === 'in_progress' && session.is_currently_paused === true;
  },

  // Handle status change notifications
  async handleStatusChangeNotifications(session: CleaningSession, updates: Partial<CleaningSession>): Promise<void> {
    const { notificationService } = await import('./notificationService');

    if (updates.status === 'cancelled' && session.properties?.owner_id) {
      const shortNotice = (session.cancellation_notice_hours || 0) < 24;
      await notificationService.sendToUser(
        session.properties.owner_id,
        'session_cancelled',
        'Cleaning Session Cancelled',
        `${shortNotice ? 'SHORT NOTICE: ' : ''}Cleaning at ${session.properties.name} has been cancelled. Reason: ${session.cancellation_reason}`,
        { cleaning_session_id: session.id, property_id: session.property_id }
      );
    }

    if (updates.status === 'in_progress' && session.properties?.owner_id) {
      await notificationService.sendToUser(
        session.properties.owner_id,
        'cleaning_started',
        'Cleaning Started',
        `Cleaning has started at ${session.properties.name}`,
        { cleaning_session_id: session.id, property_id: session.property_id }
      );
    }

    if (updates.status === 'completed' && session.properties?.owner_id) {
      await notificationService.sendToUser(
        session.properties.owner_id,
        'cleaning_completed',
        'Cleaning Completed',
        `Cleaning has been completed at ${session.properties.name}`,
        { cleaning_session_id: session.id, property_id: session.property_id }
      );
    }
  }
};