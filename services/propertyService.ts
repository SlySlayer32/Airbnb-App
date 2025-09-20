import { supabase } from '@/lib/supabase';
import { EnhancedProperty, LinenRequirement } from '@/types';

export const propertyService = {
  // Get properties with current/next cleaning sessions for property owners
  async getPropertiesForOwner(): Promise<EnhancedProperty[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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
      .eq('owner_id', user.id)
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

    // Transform to property-centric view
    const uniqueProperties = new Map();
    (data || []).forEach(session => {
      if (session.properties && !uniqueProperties.has(session.properties.id)) {
        uniqueProperties.set(session.properties.id, {
          ...session.properties,
          current_session: session
        });
      }
    });

    return Array.from(uniqueProperties.values());
  },

  // Create a new property with default linen requirements
  async createProperty(propertyData: Omit<EnhancedProperty, 'id' | 'current_session' | 'next_session' | 'linen_requirements'>): Promise<EnhancedProperty> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        owner_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Create default linen requirements for different guest counts
    await this.createDefaultLinenRequirements(data.id, propertyData.max_occupancy);

    return data;
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
      .insert(
        requirements.map(req => ({
          ...req,
          property_id: propertyId
        }))
      );

    if (error) throw error;
  },

  // Create default linen requirements based on property occupancy
  async createDefaultLinenRequirements(propertyId: string, maxOccupancy: number): Promise<void> {
    const requirements: LinenRequirement[] = [];

    // Generate requirements for 1 to max occupancy
    for (let guestCount = 1; guestCount <= maxOccupancy; guestCount++) {
      requirements.push({
        guest_count: guestCount,
        bed_sheets_single: 0,
        bed_sheets_double: Math.min(guestCount, 2),
        bed_sheets_queen: guestCount > 2 ? 1 : 0,
        bed_sheets_king: guestCount > 4 ? 1 : 0,
        pillow_cases: guestCount * 2,
        duvet_covers: Math.ceil(guestCount / 2),
        towels_bath: guestCount,
        towels_hand: guestCount,
        towels_face: guestCount,
        towels_pool: guestCount,
        kitchen_towels: 2,
        bath_mats: 1
      });
    }

    await this.updateLinenRequirements(propertyId, requirements);
  }
};