-- Enhanced schema focused on Property Owner <-> Cleaner workflow

-- Core properties table with cleaner-focused fields
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  rooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  image_url TEXT,
  status TEXT CHECK (status IN ('active', 'occupied', 'maintenance', 'inactive')) DEFAULT 'active',
  
  -- Access Information (crucial for cleaners)
  access_method TEXT CHECK (access_method IN ('key_lockbox', 'smart_lock', 'doorman', 'owner_present', 'other')) DEFAULT 'key_lockbox',
  access_code TEXT, -- lockbox code, smart lock code, etc.
  access_instructions TEXT, -- detailed access instructions
  wifi_name TEXT,
  wifi_password TEXT,
  
  -- Property Details for Cleaning
  max_occupancy INTEGER DEFAULT 2,
  property_type TEXT CHECK (property_type IN ('apartment', 'house', 'condo', 'villa', 'studio')) DEFAULT 'apartment',
  square_footage INTEGER,
  has_balcony BOOLEAN DEFAULT FALSE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_hot_tub BOOLEAN DEFAULT FALSE,
  has_bbq BOOLEAN DEFAULT FALSE,
  has_laundry BOOLEAN DEFAULT FALSE,
  parking_instructions TEXT,
  
  -- Default linen configuration
  default_linen_config JSONB DEFAULT '{}', -- stores linen requirements per guest count
  
  -- Special cleaning requirements
  special_areas TEXT[], -- ['pool area', 'garden', 'garage', 'basement']
  cleaning_supplies_location TEXT,
  vacuum_location TEXT,
  linen_storage_location TEXT,
  
  -- Timing defaults
  default_checkin_time TIME DEFAULT '15:00',
  default_checkout_time TIME DEFAULT '11:00',
  estimated_cleaning_duration INTEGER DEFAULT 120, -- minutes
  
  -- Emergency contacts
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- Linen requirements template (what linen is needed for X guests)
CREATE TABLE public.linen_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  guest_count INTEGER NOT NULL,
  bed_sheets_single INTEGER DEFAULT 0,
  bed_sheets_double INTEGER DEFAULT 0,
  bed_sheets_queen INTEGER DEFAULT 0,
  bed_sheets_king INTEGER DEFAULT 0,
  pillow_cases INTEGER DEFAULT 0,
  duvet_covers INTEGER DEFAULT 0,
  towels_bath INTEGER DEFAULT 0,
  towels_hand INTEGER DEFAULT 0,
  towels_face INTEGER DEFAULT 0,
  towels_pool INTEGER DEFAULT 0,
  kitchen_towels INTEGER DEFAULT 0,
  bath_mats INTEGER DEFAULT 0,
  additional_items JSONB DEFAULT '{}', -- for custom items like beach towels, blankets
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(property_id, guest_count)
);

-- Enhanced bookings/cleaning sessions table
CREATE TABLE public.cleaning_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  assigned_cleaner_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  
  -- Booking Information
  guest_count INTEGER NOT NULL,
  checkin_time TIMESTAMP WITH TIME ZONE NOT NULL,
  checkout_time TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_cleaning_time TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Session type and status
  session_type TEXT CHECK (session_type IN ('checkout_clean', 'checkin_prep', 'maintenance_clean', 'deep_clean', 'inspection')) NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  
  -- Cancellation tracking
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES auth.users(id),
  cancellation_reason TEXT,
  cancellation_notice_hours INTEGER, -- how many hours notice was given
  
  -- Special requests for this session
  special_requests TEXT,
  guest_notes TEXT, -- notes about the guests (allergies, special needs, etc.)
  
  -- Cleaning requirements (can override property defaults)
  custom_linen_requirements JSONB,
  additional_cleaning_tasks TEXT[],
  priority_areas TEXT[], -- areas that need special attention
  
  -- Real-time status tracking
  cleaner_arrived_at TIMESTAMP WITH TIME ZONE,
  cleaner_started_at TIMESTAMP WITH TIME ZONE,
  cleaner_completed_at TIMESTAMP WITH TIME ZONE,
  actual_guest_count INTEGER, -- sometimes different from expected
  
  -- Quality control
  inspection_required BOOLEAN DEFAULT FALSE,
  inspector_id UUID REFERENCES public.team_members(id),
  inspection_completed_at TIMESTAMP WITH TIME ZONE,
  inspection_notes TEXT,
  quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 10),
  
  -- Financial
  base_rate DECIMAL(10,2),
  additional_charges DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- Real-time cleaner updates/notes
CREATE TABLE public.cleaning_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cleaning_session_id UUID REFERENCES public.cleaning_sessions(id) ON DELETE CASCADE NOT NULL,
  cleaner_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE NOT NULL,
  
  update_type TEXT CHECK (update_type IN ('status', 'issue', 'photo', 'note', 'delay', 'completion')) NOT NULL,
  message TEXT NOT NULL,
  photo_urls TEXT[], -- for before/after photos
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Issue tracking
  is_blocking_issue BOOLEAN DEFAULT FALSE,
  requires_owner_response BOOLEAN DEFAULT FALSE,
  owner_responded_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Property-specific cleaning checklists
CREATE TABLE public.property_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "Standard Checkout Clean", "Deep Clean"
  checklist_items JSONB NOT NULL, -- structured checklist data
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Issues/problems reporting
CREATE TABLE public.property_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  cleaning_session_id UUID REFERENCES public.cleaning_sessions(id) ON DELETE SET NULL,
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  
  issue_type TEXT CHECK (issue_type IN ('maintenance', 'damage', 'supply_shortage', 'access_problem', 'guest_complaint', 'safety_concern')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  
  photo_urls TEXT[],
  location_in_property TEXT, -- e.g., "master bedroom", "kitchen sink"
  
  status TEXT CHECK (status IN ('reported', 'acknowledged', 'in_progress', 'resolved', 'closed')) DEFAULT 'reported',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enhanced team members table for cleaner-specific info
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(8,2);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS preferred_work_hours JSONB; -- store availability
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS specializations TEXT[]; -- ['deep_cleaning', 'luxury_properties', 'pet_friendly']
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS certification_expiry DATE;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS transport_method TEXT CHECK (transport_method IN ('car', 'bike', 'public_transport', 'walking'));
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS can_access_properties TEXT[] DEFAULT '{}'; -- property IDs they have access to

-- Cleaner performance tracking
CREATE TABLE public.cleaner_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cleaner_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  month_year DATE NOT NULL, -- first day of month for grouping
  
  total_sessions INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  cancelled_sessions INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  average_duration_minutes INTEGER,
  issues_reported INTEGER DEFAULT 0,
  compliments_received INTEGER DEFAULT 0,
  
  UNIQUE(cleaner_id, property_id, month_year)
);

-- Notification preferences and delivery
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'session_assigned', 'session_cancelled', 'issue_reported', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- additional structured data
  
  delivery_method TEXT[] DEFAULT '{"app"}', -- app, email, sms
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Related entities
  cleaning_session_id UUID REFERENCES public.cleaning_sessions(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_cleaning_sessions_cleaner_date ON public.cleaning_sessions(assigned_cleaner_id, scheduled_cleaning_time);
CREATE INDEX idx_cleaning_sessions_property_date ON public.cleaning_sessions(property_id, scheduled_cleaning_time);
CREATE INDEX idx_cleaning_sessions_status ON public.cleaning_sessions(status);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_property_issues_status ON public.property_issues(status);

-- RLS Policies (enhanced for cleaner access)
-- Cleaners can see sessions assigned to them
CREATE POLICY "Cleaners can view assigned sessions" ON public.cleaning_sessions
  FOR SELECT USING (
    assigned_cleaner_id IN (
      SELECT id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

-- Cleaners can update their assigned sessions
CREATE POLICY "Cleaners can update assigned sessions" ON public.cleaning_sessions
  FOR UPDATE USING (
    assigned_cleaner_id IN (
      SELECT id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

-- Cleaners can add updates to their sessions
CREATE POLICY "Cleaners can add session updates" ON public.cleaning_updates
  FOR INSERT WITH CHECK (
    cleaner_id IN (
      SELECT id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

-- Cleaners can view property details for their assigned properties
CREATE POLICY "Cleaners can view assigned properties" ON public.properties
  FOR SELECT USING (
    id IN (
      SELECT DISTINCT cs.property_id 
      FROM public.cleaning_sessions cs
      JOIN public.team_members tm ON cs.assigned_cleaner_id = tm.id
      WHERE tm.user_id = auth.uid()
    )
  );

-- Sample data function for linen requirements
CREATE OR REPLACE FUNCTION create_default_linen_requirements(prop_id UUID)
RETURNS void AS $$
BEGIN
  -- Default linen requirements for different guest counts
  INSERT INTO public.linen_requirements (property_id, guest_count, bed_sheets_queen, pillow_cases, duvet_covers, towels_bath, towels_hand, kitchen_towels, bath_mats)
  VALUES 
    (prop_id, 1, 1, 2, 1, 2, 2, 2, 1),
    (prop_id, 2, 1, 2, 1, 4, 4, 2, 1),
    (prop_id, 3, 1, 4, 1, 6, 6, 2, 2),
    (prop_id, 4, 2, 4, 2, 8, 8, 3, 2),
    (prop_id, 5, 2, 6, 2, 10, 10, 3, 2),
    (prop_id, 6, 3, 6, 3, 12, 12, 4, 3);
END;
$$ LANGUAGE plpgsql;