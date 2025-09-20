// services/propertyService.ts
import { supabase } from '@/app/lib/supabase';

export interface EnhancedProperty {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  rooms: number;
  bathrooms: number;
  image_url: string;
  status: 'active' | 'occupied' | 'maintenance' | 'inactive';
  max_occupancy: number;
  property_type: 'apartment' | 'house' | 'condo' | 'villa' | 'studio';
  
  // Access Information
  access_method: 'key_lockbox' | 'smart_lock' | 'doorman' | 'owner_present' | 'other';
  access_code?: string;
  access_instructions?: string;
  wifi_name?: string;
  wifi_password?: string;
  
  // Property Features
  has_balcony: boolean;
  has_pool: boolean;
  has_hot_tub: boolean;
  has_bbq: boolean;
  has_laundry: boolean;
  special_areas?: string[];
  parking_instructions?: string;
  
  // Cleaning Logistics
  cleaning_supplies_location?: string;
  vacuum_location?: string;
  linen_storage_location?: string;
  default_checkin_time: string;
  default_checkout_time: string;
  estimated_cleaning_duration: number;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  // Relations
  current_session?: CleaningSession;
  next_session?: CleaningSession;
  linen_requirements?: LinenRequirement[];
}

export interface CleaningSession {
  id: string;
  property_id: string;
  assigned_cleaner_id?: string;
  guest_count: number;
  checkin_time: string;
  checkout_time: string;
  scheduled_cleaning_time: string;
  session_type: 'checkout_clean' | 'checkin_prep' | 'maintenance_clean' | 'deep_clean' | 'inspection';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  
  // Cancellation info
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
  cancellation_notice_hours?: number;
  
  // Special requests
  special_requests?: string;
  guest_notes?: string;
  custom_linen_requirements?: any;
  additional_cleaning_tasks?: string[];
  priority_areas?: string[];
  
  // Status tracking
  cleaner_arrived_at?: string;
  cleaner_started_at?: string;
  cleaner_completed_at?: string;
  actual_guest_count?: number;
  
  // Relations
  properties?: { name: string };
  team_members?: { name: string; phone: string };
  linen_requirements?: LinenRequirement;
}

export interface LinenRequirement {
  guest_count: number;
  bed_sheets_single: number;
  bed_sheets_double: number;
  bed_sheets_queen: number;
  bed_sheets_king: number;
  pillow_cases: number;
  duvet_covers: number;
  towels_bath: number;
  towels_hand: number;
  towels_face: number;
  towels_pool: number;
  kitchen_towels: number;
  bath_mats: number;
  additional_items?: any;
}

export const propertyService = {
  // Get properties with current/next cleaning sessions
  async getPropertiesForOwner(): Promise<EnhancedProperty[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        cleaning_sessions!cleaning_sessions_property_id_fkey (
          id,
          guest_count,
          checkin_time,
          checkout_time,
          scheduled_cleaning_time,
          session_type,
          status,
          cancelled_at,
          cancellation_reason,
          special_requests,
          team_members (name, phone)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process and attach current/next sessions
    return (data || []).map(property => {
      const now = new Date().toISOString();
      const sessions = property.cleaning_sessions || [];
      
      // Find current (in progress) or next upcoming session
      const currentSession = sessions.find((s: any) => s.status === 'in_progress') ||
                           sessions.find((s: any) => 
                             s.scheduled_cleaning_time > now && 
                             s.status !== 'cancelled'
                           );

      return {
        ...property,
        current_session: currentSession,
        cleaning_sessions: undefined // Remove the raw sessions array
      };
    });
  },

  // Get properties for cleaners (only assigned ones with upcoming sessions)
  async getPropertiesForCleaner(): Promise<EnhancedProperty[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First get the cleaner's team member record
    const { data: teamMember, error: teamError } = await supabase
      .from('team_members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (teamError) throw teamError;

    // Get properties with sessions assigned to this cleaner
    const { data, error } = await supabase
      .from('cleaning_sessions')
      .select(`
        properties (*),
        id,
        guest_count,
        checkin_time,
        checkout_time,
        scheduled_cleaning_time,
        session_type,
        status,
        cancelled_at,
        cancellation_reason,
        cancellation_notice_hours,
        special_requests,
        guest_notes,
        custom_linen_requirements
      `)
      .eq('assigned_cleaner_id', teamMember.id)
      .gte('scheduled_cleaning_time', new Date().toISOString())
      .order('scheduled_cleaning_time', { ascending: true });

    if (error) throw error;

    // Group sessions by property and get linen requirements
    const propertyMap = new Map();
    
    for (const session of data || []) {
      const property = session.properties;
      const propertyId = property.id;
      
      if (!propertyMap.has(propertyId)) {
        // Get linen requirements for this session
        const { data: linenData } = await supabase
          .from('linen_requirements')
          .select('*')
          .eq('property_id', propertyId)
          .eq('guest_count', session.guest_count)
          .single();

        propertyMap.set(propertyId, {
          ...property,
          current_session: {
            ...session,
            linen_requirements: session.custom_linen_requirements || linenData,
            properties: undefined
          }
        });
      }
    }

    return Array.from(propertyMap.values());
  },

  // Create a new property with default linen requirements
  async createProperty(propertyData: Omit<EnhancedProperty, 'id' | 'owner_id'>): Promise<EnhancedProperty> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('properties')
      .insert([{ ...propertyData, owner_id: user.id }])
      .select()
      .single();

    if (error) throw error;

    // Create default linen requirements
    await this.createDefaultLinenRequirements(data.id, propertyData.max_occupancy);

    return data;
  },

  // Create default linen requirements for different guest counts
  async createDefaultLinenRequirements(propertyId: string, maxOccupancy: number): Promise<void> {
    const requirements = [];
    
    for (let guests = 1; guests <= maxOccupancy; guests++) {
      requirements.push({
        property_id: propertyId,
        guest_count: guests,
        bed_sheets_queen: Math.ceil(guests / 2),
        pillow_cases: guests * 2,
        duvet_covers: Math.ceil(guests / 2),
        towels_bath: guests * 2,
        towels_hand: guests * 2,
        kitchen_towels: 2,
        bath_mats: 1
      });
    }

    const { error } = await supabase
      .from('linen_requirements')
      .insert(requirements);

    if (error) throw error;
  },

  // Update property details
  async updateProperty(id: string, updates: Partial<EnhancedProperty>): Promise<EnhancedProperty> {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get linen requirements for a property
  async getLinenRequirements(propertyId: string): Promise<LinenRequirement[]> {
    const { data, error } = await supabase
      .from('linen_requirements')
      .select('*')
      .eq('property_id', propertyId)
      .order('guest_count', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Update linen requirements
  async updateLinenRequirements(propertyId: string, requirements: LinenRequirement[]): Promise<void> {
    // Delete existing requirements
    await supabase
      .from('linen_requirements')
      .delete()
      .eq('property_id', propertyId);

    // Insert new requirements
    const { error } = await supabase
      .from('linen_requirements')
      .insert(requirements.map(req => ({ ...req, property_id: propertyId })));

    if (error) throw error;
  }
};

// services/cleaningSessionService.ts
export const cleaningSessionService = {
  // Create a new cleaning session
  async createSession(sessionData: Omit<CleaningSession, 'id'>): Promise<CleaningSession> {
    const { data, error } = await supabase
      .from('cleaning_sessions')
      .insert([sessionData])
      .select(`
        *,
        properties (name),
        team_members (name, phone)
      `)
      .single();

    if (error) throw error;
    
    // Send notification to assigned cleaner
    if (data.assigned_cleaner_id) {
      await notificationService.sendToTeamMember(
        data.assigned_cleaner_id,
        'session_assigned',
        'New Cleaning Assignment',
        `You've been assigned to clean ${data.properties?.name}`,
        { cleaning_session_id: data.id, property_id: data.property_id }
      );
    }

    return data;
  },

  // Update session status and send notifications
  async updateSessionStatus(sessionId: string, updates: Partial<CleaningSession>): Promise<CleaningSession> {
    const { data, error } = await supabase
      .from('cleaning_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select(`
        *,
        properties (name, owner_id),
        team_members (name, phone, user_id)
      `)
      .single();

    if (error) throw error;

    // Send notifications based on status change
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
      ...cancellationData
    };

    const { data, error } = await supabase
      .from('cleaning_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select(`
        *,
        properties (name),
        team_members (name, phone, user_id)
      `)
      .single();

    if (error) throw error;

    // Notify cleaner about cancellation
    if (data.assigned_cleaner_id && data.team_members?.user_id) {
      const isShortNotice = cancellationData.cancellation_notice_hours < 24;
      await notificationService.sendToUser(
        data.team_members.user_id,
        'session_cancelled',
        `Cleaning Cancelled${isShortNotice ? ' - Short Notice' : ''}`,
        `${data.properties?.name} cleaning has been cancelled. Reason: ${cancellationData.cancellation_reason}`,
        { 
          cleaning_session_id: data.id, 
          property_id: data.property_id,
          short_notice: isShortNotice 
        }
      );
    }

    return data;
  },

  // Start a cleaning session (cleaner arrives)
  async startCleaning(sessionId: string): Promise<CleaningSession> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('cleaning_sessions')
      .update({ 
        status: 'in_progress',
        cleaner_arrived_at: now,
        cleaner_started_at: now,
        updated_at: now
      })
      .eq('id', sessionId)
      .select(`
        *,
        properties (name, owner_id)
      `)
      .single();

    if (error) throw error;

    // Notify property owner
    if (data.properties?.owner_id) {
      await notificationService.sendToUser(
        data.properties.owner_id,
        'cleaning_started',
        'Cleaning Started',
        `Cleaning has begun at ${data.properties.name}`,
        { cleaning_session_id: data.id, property_id: data.property_id }
      );
    }

    return data;
  },

  // Complete a cleaning session
  async completeCleaning(sessionId: string, completionData: {
    actual_guest_count?: number;
    notes?: string;
    photos?: string[];
  }): Promise<CleaningSession> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('cleaning_sessions')
      .update({ 
        status: 'completed',
        cleaner_completed_at: now,
        actual_guest_count: completionData.actual_guest_count,
        updated_at: now
      })
      .eq('id', sessionId)
      .select(`
        *,
        properties (name, owner_id)
      `)
      .single();

    if (error) throw error;

    // Add completion update with notes/photos
    if (completionData.notes || completionData.photos?.length) {
      await cleaningUpdateService.addUpdate(sessionId, {
        update_type: 'completion',
        message: completionData.notes || 'Cleaning completed',
        photo_urls: completionData.photos || []
      });
    }

    // Notify property owner
    if (data.properties?.owner_id) {
      await notificationService.sendToUser(
        data.properties.owner_id,
        'cleaning_completed',
        'Cleaning Completed',
        `Cleaning has been completed at ${data.properties.name}`,
        { cleaning_session_id: data.id, property_id: data.property_id }
      );
    }

    return data;
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

    let query = supabase
      .from('cleaning_sessions')
      .select(`
        *,
        properties (name, address, access_method, access_code, access_instructions),
        team_members (name)
      `)
      .eq('assigned_cleaner_id', teamMember.id)
      .order('scheduled_cleaning_time', { ascending: true });

    // Apply date filters
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (period === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query = query
        .gte('scheduled_cleaning_time', today.toISOString())
        .lt('scheduled_cleaning_time', tomorrow.toISOString());
    } else if (period === 'week') {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      query = query
        .gte('scheduled_cleaning_time', today.toISOString())
        .lt('scheduled_cleaning_time', nextWeek.toISOString());
    } else {
      query = query.gte('scheduled_cleaning_time', today.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  },

  // Handle status change notifications
  async handleStatusChangeNotifications(session: CleaningSession, updates: Partial<CleaningSession>): Promise<void> {
    const statusChanged = updates.status && updates.status !== session.status;
    
    if (!statusChanged || !session.properties?.owner_id) return;

    let title = '';
    let message = '';
    
    switch (updates.status) {
      case 'confirmed':
        title = 'Cleaning Confirmed';
        message = `Cleaner has confirmed the cleaning at ${session.properties.name}`;
        break;
      case 'in_progress':
        title = 'Cleaning in Progress';
        message = `Cleaning has started at ${session.properties.name}`;
        break;
      case 'completed':
        title = 'Cleaning Completed';
        message = `Cleaning has been completed at ${session.properties.name}`;
        break;
      case 'no_show':
        title = 'Cleaner No-Show';
        message = `Cleaner did not show up for ${session.properties.name}`;
        break;
    }

    if (title) {
      await notificationService.sendToUser(
        session.properties.owner_id,
        'status_change',
        title,
        message,
        { cleaning_session_id: session.id, property_id: session.property_id }
      );
    }
  }
};

// services/cleaningUpdateService.ts
export const cleaningUpdateService = {
  // Add an update/note to a cleaning session
  async addUpdate(sessionId: string, updateData: {
    update_type: 'status' | 'issue' | 'photo' | 'note' | 'delay' | 'completion';
    message: string;
    photo_urls?: string[];
    is_blocking_issue?: boolean;
    requires_owner_response?: boolean;
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get cleaner's team member ID
    const { data: teamMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!teamMember) throw new Error('Team member not found');

    const { error } = await supabase
      .from('cleaning_updates')
      .insert([{
        cleaning_session_id: sessionId,
        cleaner_id: teamMember.id,
        ...updateData
      }]);

    if (error) throw error;

    // If it requires owner response, send notification
    if (updateData.requires_owner_response) {
      const { data: session } = await supabase
        .from('cleaning_sessions')
        .select('properties (name, owner_id)')
        .eq('id', sessionId)
        .single();

      if (session?.properties?.owner_id) {
        await notificationService.sendToUser(
          session.properties.owner_id,
          'cleaner_needs_response',
          'Cleaner Needs Response',
          `Issue at ${session.properties.name}: ${updateData.message}`,
          { cleaning_session_id: sessionId }
        );
      }
    }
  },

  // Get updates for a session
  async getSessionUpdates(sessionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('cleaning_updates')
      .select(`
        *,
        team_members (name)
      `)
      .eq('cleaning_session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

// services/notificationService.ts
export const notificationService = {
  // Send notification to a specific user
  async sendToUser(userId: string, type: string, title: string, message: string, data?: any): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type,
        title,
        message,
        data: data || {},
        delivery_method: ['app'], // Can be extended to include email, sms
        cleaning_session_id: data?.cleaning_session_id,
        property_id: data?.property_id
      }]);

    if (error) throw error;
  },

  // Send notification to team member via their user_id
  async sendToTeamMember(teamMemberId: string, type: string, title: string, message: string, data?: any): Promise<void> {
    // Get team member's user_id
    const { data: teamMember } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('id', teamMemberId)
      .single();

    if (teamMember?.user_id) {
      await this.sendToUser(teamMember.user_id, type, title, message, data);
    }
  },

  // Get unread notifications for current user
  async getUnreadNotifications(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .is('read_at', null)
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
  }
};