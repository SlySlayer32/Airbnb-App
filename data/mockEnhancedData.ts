import { EnhancedProperty, CleaningSession, LinenRequirement } from '@/types';

// Mock enhanced properties for demo purposes
export const mockEnhancedProperties: EnhancedProperty[] = [
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Sunset Villa',
    address: '123 Ocean Drive, Miami Beach, FL',
    rooms: 3,
    bathrooms: 2,
    image_url: 'https://d64gsuwffb70l.cloudfront.net/68c9667bc6549ed6e63cf24e_1758029471470_af27c278.webp',
    status: 'active',
    max_occupancy: 6,
    property_type: 'villa',
    
    // Access Information
    access_method: 'key_lockbox',
    access_code: '1234',
    access_instructions: 'Lockbox is located behind the large planter on the right side of the front door',
    wifi_name: 'SunsetVilla_Guest',
    wifi_password: 'Ocean2024!',
    
    // Property Features
    has_balcony: true,
    has_pool: true,
    has_hot_tub: true,
    has_bbq: true,
    has_laundry: true,
    special_areas: ['Pool area', 'Hot tub', 'BBQ deck', 'Ocean-view balcony'],
    parking_instructions: 'Use driveway, avoid blocking neighbor access',
    
    // Cleaning Logistics
    cleaning_supplies_location: 'Utility closet under stairs',
    vacuum_location: 'Master bedroom closet',
    linen_storage_location: 'Hall closet next to bathroom',
    default_checkin_time: '15:00',
    default_checkout_time: '11:00',
    estimated_cleaning_duration: 180,
    
    // Emergency Contact
    emergency_contact_name: 'Property Manager Sarah',
    emergency_contact_phone: '(555) 123-4567',
    
    // Current session
    current_session: {
      id: 'session1',
      property_id: '1',
      assigned_cleaner_id: 'cleaner1',
      guest_count: 4,
      checkin_time: '2024-01-20T15:00:00Z',
      checkout_time: '2024-01-20T11:00:00Z',
      scheduled_cleaning_time: '2024-01-20T12:00:00Z',
      session_type: 'checkout_clean',
      status: 'confirmed',
      special_requests: 'Extra attention to pool area - guests had a party last night',
      guest_notes: 'Expecting 4 guests, possible early arrival',
      properties: { name: 'Sunset Villa', owner_id: 'owner1' },
      team_members: { name: 'Maria Garcia', phone: '(555) 234-5678' },
      linen_requirements: {
        guest_count: 4,
        bed_sheets_single: 0,
        bed_sheets_double: 2,
        bed_sheets_queen: 1,
        bed_sheets_king: 0,
        pillow_cases: 8,
        duvet_covers: 3,
        towels_bath: 4,
        towels_hand: 4,
        towels_face: 4,
        towels_pool: 4,
        kitchen_towels: 2,
        bath_mats: 2
      }
    }
  },
  {
    id: '2',
    owner_id: 'owner1',
    name: 'Downtown Loft',
    address: '456 City Center St, Downtown',
    rooms: 2,
    bathrooms: 1,
    image_url: 'https://d64gsuwffb70l.cloudfront.net/68c9667bc6549ed6e63cf24e_1758029475150_00e72d9c.webp',
    status: 'occupied',
    max_occupancy: 4,
    property_type: 'apartment',
    
    // Access Information
    access_method: 'smart_lock',
    access_code: '5678',
    access_instructions: 'Use smart lock code, door will unlock automatically',
    wifi_name: 'LoftGuest',
    wifi_password: 'City2024',
    
    // Property Features
    has_balcony: false,
    has_pool: false,
    has_hot_tub: false,
    has_bbq: false,
    has_laundry: true,
    special_areas: ['Rooftop access'],
    parking_instructions: 'Street parking only, check signs for restrictions',
    
    // Cleaning Logistics
    cleaning_supplies_location: 'Kitchen cabinet under sink',
    vacuum_location: 'Hall closet',
    linen_storage_location: 'Bedroom closet shelf',
    default_checkin_time: '16:00',
    default_checkout_time: '11:00',
    estimated_cleaning_duration: 120,
    
    // Emergency Contact
    emergency_contact_name: 'Building Manager Tom',
    emergency_contact_phone: '(555) 987-6543',
    
    // Current session - cancelled with short notice
    current_session: {
      id: 'session2',
      property_id: '2',
      assigned_cleaner_id: 'cleaner1',
      guest_count: 2,
      checkin_time: '2024-01-21T16:00:00Z',
      checkout_time: '2024-01-21T11:00:00Z',
      scheduled_cleaning_time: '2024-01-21T12:00:00Z',
      session_type: 'checkout_clean',
      status: 'cancelled',
      cancelled_at: '2024-01-21T06:00:00Z',
      cancelled_by: 'owner1',
      cancellation_reason: 'Guest extended stay by one day',
      cancellation_notice_hours: 6,
      properties: { name: 'Downtown Loft', owner_id: 'owner1' },
      team_members: { name: 'Maria Garcia', phone: '(555) 234-5678' }
    }
  }
];

export const mockCleanerUser = {
  id: 'cleaner1',
  email: 'maria@cleanteam.com',
  full_name: 'Maria Garcia',
  role: 'cleaner' as const,
  phone: '(555) 234-5678',
  onboarded: true
};