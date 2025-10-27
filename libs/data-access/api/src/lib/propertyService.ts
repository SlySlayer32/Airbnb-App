import { EnhancedProperty, LinenRequirement } from '@airbnb/core-domain-models';
import { supabase } from './api';

export const propertyService = {
  async getPropertiesForOwner(): Promise<EnhancedProperty[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('properties')
      .select(
        `
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
      `
      )
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((property: any) => {
      const now = new Date().toISOString();
      const sessions = property.cleaning_sessions || [];

      const currentSession =
        sessions.find((s: any) => s.status === 'in_progress') ||
        sessions.find(
          (s: any) =>
            s.scheduled_cleaning_time > now && s.status !== 'cancelled'
        );

      return {
        ...property,
        current_session: currentSession,
        cleaning_sessions: undefined,
      } as EnhancedProperty;
    });
  },

  async getPropertiesForCleaner(): Promise<EnhancedProperty[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: teamMember, error: teamError } = await supabase
      .from('team_members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (teamError) throw teamError;

    const { data, error } = await supabase
      .from('cleaning_sessions')
      .select(
        `
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
      `
      )
      .eq('assigned_cleaner_id', teamMember.id)
      .gte('scheduled_cleaning_time', new Date().toISOString())
      .order('scheduled_cleaning_time', { ascending: true });

    if (error) throw error;

    const uniqueProperties = new Map<string, EnhancedProperty>();
    (data || []).forEach((session: any) => {
      if (session.properties && !uniqueProperties.has(session.properties.id)) {
        uniqueProperties.set(session.properties.id, {
          ...session.properties,
          current_session: {
            ...session,
            properties: undefined,
          },
        } as EnhancedProperty);
      }
    });

    return Array.from(uniqueProperties.values());
  },

  async createProperty(
    propertyData: Omit<
      EnhancedProperty,
      'id' | 'current_session' | 'next_session' | 'linen_requirements'
    >
  ): Promise<EnhancedProperty> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    await this.createDefaultLinenRequirements(
      data.id,
      propertyData.max_occupancy
    );

    return data as EnhancedProperty;
  },

  async updateProperty(
    id: string,
    updates: Partial<EnhancedProperty>
  ): Promise<EnhancedProperty> {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as EnhancedProperty;
  },

  async getLinenRequirements(propertyId: string): Promise<LinenRequirement[]> {
    const { data, error } = await supabase
      .from('linen_requirements')
      .select('*')
      .eq('property_id', propertyId)
      .order('guest_count', { ascending: true });

    if (error) throw error;
    return (data || []) as LinenRequirement[];
  },

  async updateLinenRequirements(
    propertyId: string,
    requirements: LinenRequirement[]
  ): Promise<void> {
    await supabase
      .from('linen_requirements')
      .delete()
      .eq('property_id', propertyId);

    const { error } = await supabase.from('linen_requirements').insert(
      requirements.map(req => ({
        ...req,
        property_id: propertyId,
      }))
    );

    if (error) throw error;
  },

  async createDefaultLinenRequirements(
    propertyId: string,
    maxOccupancy: number
  ): Promise<void> {
    const requirements: LinenRequirement[] = [];

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
        bath_mats: 1,
      });
    }

    await this.updateLinenRequirements(propertyId, requirements);
  },
};
