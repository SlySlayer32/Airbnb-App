export interface Property {
  id: string;
  name: string;
  address: string;
  rooms: number;
  bathrooms: number;
  imageUrl: string;
  specialInstructions?: string;
  status: 'active' | 'maintenance' | 'occupied';
  nextClean?: Date;
  assignedCleaners: string[];
}

// Enhanced property interface for the new cleaner-focused workflow
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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'cleaner' | 'cohost' | 'contractor';
  imageUrl: string;
  assignedProperties: string[];
  rating: number;
}

export interface CleaningTask {
  id: string;
  propertyId: string;
  cleanerId: string;
  scheduledDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  type: 'checkout' | 'checkin' | 'maintenance' | 'deep-clean';
  checklist: ChecklistItem[];
}

// Enhanced cleaning session interface for the new workflow
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
  properties?: { name: string; owner_id: string };
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

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface Invoice {
  id: string;
  propertyId: string;
  cleanerId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdDate: Date;
  photos: string[];
}