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
    
    return this.updateSessionStatus(sessionId, {
      status: 'in_progress',
      cleaner_arrived_at: now,
      cleaner_started_at: now
    });
  },

  // Complete a cleaning session
  async completeCleaning(sessionId: string, completionData: {
    actual_guest_count?: number;
    notes?: string;
    photos?: string[];
  }): Promise<CleaningSession> {
    const now = new Date().toISOString();
    
    const session = await this.updateSessionStatus(sessionId, {
      status: 'completed',
      cleaner_completed_at: now,
      actual_guest_count: completionData.actual_guest_count
    });

    // Add completion update with notes/photos if provided
    if (completionData.notes || completionData.photos?.length) {
      const { cleaningUpdateService } = await import('./cleaningUpdateService');
      await cleaningUpdateService.addUpdate(sessionId, {
        update_type: 'completion',
        message: completionData.notes || 'Cleaning completed',
        photo_urls: completionData.photos || []
      });
    }

    return session;
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