# Database Structure (Supabase PostgreSQL)

## 📋 Table of Contents
- [Overview](#overview)
- [Core Tables](#core-tables)
- [Relationships](#relationships)
- [Row Level Security](#row-level-security)

---

## 📊 Overview

**Database**: Supabase PostgreSQL  
**Access Control**: Row Level Security (RLS)  
**Real-time**: Enabled on key tables (cleaning_sessions, cleaning_updates, notifications)

---

## 🗄️ Core Tables

### profiles
Stores user account information with roles.

**Fields**:
- `id` (UUID, Primary Key) - User identifier (from auth.users)
- `email` (TEXT, Unique) - User email address
- `full_name` (TEXT) - Display name
- `phone` (TEXT) - Contact number
- `role` (TEXT) - 'property_owner', 'cleaner', 'co_host'
- `avatar_url` (TEXT) - Profile picture URL
- `onboarded` (BOOLEAN) - Has completed onboarding
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last profile update

**Relationships**:
- One profile can own many properties (if owner)
- One profile can have many team_member records (if cleaner)

**RLS Policies**:
- Users can read only their own profile
- Users can update only their own profile

---

### properties
Stores property listings and details.

**Fields**:
- `id` (UUID, Primary Key) - Property identifier
- `owner_id` (UUID, Foreign Key → profiles) - Property owner
- `name` (TEXT) - Property name/title
- `address` (TEXT) - Full address
- `rooms` (INTEGER) - Number of rooms
- `bathrooms` (INTEGER) - Number of bathrooms
- `image_url` (TEXT) - Main property photo
- `status` (TEXT) - 'active', 'occupied', 'maintenance', 'inactive'
- `max_occupancy` (INTEGER) - Maximum guests
- `property_type` (TEXT) - 'apartment', 'house', 'condo', 'villa', 'studio'
- `access_method` (TEXT) - How to enter property
- `access_code` (TEXT) - Door/lockbox code
- `access_instructions` (TEXT) - Special entry notes
- `wifi_name` (TEXT) - WiFi network name
- `wifi_password` (TEXT) - WiFi password
- `has_pool` (BOOLEAN) - Property has pool
- `has_hot_tub` (BOOLEAN) - Property has hot tub
- `has_balcony` (BOOLEAN) - Property has balcony
- `cleaning_supplies_location` (TEXT) - Where supplies are stored
- `linen_storage_location` (TEXT) - Where linens are kept
- `default_checkin_time` (TIME) - Standard checkin time
- `default_checkout_time` (TIME) - Standard checkout time
- `estimated_cleaning_duration` (INTEGER) - Minutes to clean
- `emergency_contact_name` (TEXT) - Emergency contact person
- `emergency_contact_phone` (TEXT) - Emergency contact number
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Relationships**:
- Belongs to one profile (owner)
- Has many cleaning_sessions
- Has many linen_requirements
- Has many team_member assignments

**RLS Policies**:
- Owners can CRUD their own properties
- Cleaners can SELECT properties they're assigned to (no UPDATE/DELETE)
- Co-hosts can SELECT assigned properties (no UPDATE/DELETE)

---

### cleaning_sessions
Stores all cleaning schedules and sessions.

**Fields**:
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key → properties)
- `assigned_cleaner_id` (UUID, Foreign Key → profiles)
- `guest_count` (INTEGER) - Number of guests
- `checkin_time` (TIMESTAMP) - Guest arrival time
- `checkout_time` (TIMESTAMP) - Guest departure time
- `scheduled_cleaning_time` (TIMESTAMP) - When cleaning scheduled
- `session_type` (TEXT) - 'checkout_clean', 'checkin_prep', 'maintenance_clean', 'deep_clean'
- `status` (TEXT) - 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
- `cleaner_arrived_at` (TIMESTAMP) - When cleaner arrived
- `cleaner_started_at` (TIMESTAMP) - When cleaning started
- `cleaner_completed_at` (TIMESTAMP) - When cleaning finished
- `cleaner_paused_at` (TIMESTAMP) - Current pause timestamp
- `cleaner_resumed_at` (TIMESTAMP) - Last resume timestamp
- `total_break_minutes` (INTEGER) - Accumulated break time
- `is_currently_paused` (BOOLEAN) - Session paused flag
- `photos_required` (BOOLEAN) - Need photos to complete
- `photos_completed` (BOOLEAN) - Photos uploaded
- `completion_photos` (TEXT[]) - Array of photo URLs
- `actual_guest_count` (INTEGER) - Actual vs expected
- `special_requests` (TEXT) - Owner special instructions
- `cancelled_at` (TIMESTAMP) - When cancelled
- `cancelled_by` (UUID) - Who cancelled
- `cancellation_reason` (TEXT) - Why cancelled
- `cancellation_notice_hours` (INTEGER) - Notice period
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Relationships**:
- Belongs to one property
- Assigned to one cleaner (profile)
- Has many cleaning_updates

**RLS Policies**:
- Owners can CRUD sessions for their properties
- Cleaners can SELECT/UPDATE assigned sessions (cannot CREATE/DELETE)
- Cleaners cannot see financial fields

---

### cleaning_updates
Real-time progress updates and communication.

**Fields**:
- `id` (UUID, Primary Key)
- `session_id` (UUID, Foreign Key → cleaning_sessions)
- `user_id` (UUID, Foreign Key → profiles) - Who created update
- `update_type` (TEXT) - 'session_start', 'session_pause', 'session_resume', 'session_complete', 'note', 'issue', 'photo'
- `message` (TEXT) - Update content
- `photo_url` (TEXT) - Attached photo
- `is_urgent` (BOOLEAN) - Requires immediate attention
- `requires_response` (BOOLEAN) - Needs owner response
- `created_at` (TIMESTAMP)

**Relationships**:
- Belongs to one cleaning_session
- Created by one user (profile)

**RLS Policies**:
- Owners can read updates for their property sessions
- Cleaners can read/create updates for assigned sessions

---

### team_members
Links cleaners to properties they can access.

**Fields**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → profiles) - The cleaner
- `property_id` (UUID, Foreign Key → properties) - The property
- `role` (TEXT) - 'cleaner', 'co_host'
- `assigned_at` (TIMESTAMP)
- `assigned_by` (UUID) - Owner who assigned

**RLS Policies**:
- Owners can manage assignments for their properties
- Cleaners can read their own assignments

---

### notifications
User notification/alert system.

**Fields**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → profiles) - Recipient
- `title` (TEXT) - Notification title
- `message` (TEXT) - Notification body
- `type` (TEXT) - 'info', 'success', 'warning', 'error'
- `priority` (TEXT) - 'normal', 'high', 'urgent'
- `is_read` (BOOLEAN) - Read status
- `action_url` (TEXT) - Deep link to related screen
- `related_session_id` (UUID) - Associated session
- `created_at` (TIMESTAMP)
- `read_at` (TIMESTAMP)

**RLS Policies**:
- Users can read/update only their own notifications

---

### photo_proof_requirements
Photo requirements per session.

**Fields**:
- `id` (UUID, Primary Key)
- `session_id` (UUID, Foreign Key → cleaning_sessions)
- `category` (TEXT) - 'before_cleaning', 'after_cleaning', 'specific_area'
- `area_name` (TEXT) - 'kitchen', 'bathroom', etc.
- `is_required` (BOOLEAN) - Must be uploaded
- `is_completed` (BOOLEAN) - Photo uploaded
- `photo_url` (TEXT) - Uploaded photo URL
- `notes` (TEXT) - Additional context
- `created_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP)

---

### linen_requirements
Auto-calculated linen needs per property.

**Fields**:
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key → properties)
- `guest_count` (INTEGER) - For X guests
- `bed_sheets_single` (INTEGER)
- `bed_sheets_double` (INTEGER)
- `bed_sheets_queen` (INTEGER)
- `bed_sheets_king` (INTEGER)
- `pillow_cases` (INTEGER)
- `duvet_covers` (INTEGER)
- `towels_bath` (INTEGER)
- `towels_hand` (INTEGER)
- `towels_pool` (INTEGER)
- `kitchen_towels` (INTEGER)
- `bath_mats` (INTEGER)
- `created_at` (TIMESTAMP)

---

## 🔗 Relationships

```
profiles (1) ----< (many) properties
profiles (1) ----< (many) team_members ----< (many) properties
properties (1) ----< (many) cleaning_sessions
cleaning_sessions (1) ----< (many) cleaning_updates
cleaning_sessions (1) ----< (many) photo_proof_requirements
properties (1) ----< (many) linen_requirements
profiles (1) ----< (many) notifications
```

---

## 🔐 Row Level Security (RLS)

### Enable RLS on All Tables
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_sessions ENABLE ROW LEVEL SECURITY;
-- Repeat for all tables
```

### Critical Policies

**Properties** - Owners see only their properties:
```sql
CREATE POLICY "owners_crud_own_properties" ON properties
FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "cleaners_view_assigned" ON properties
FOR SELECT USING (
  id IN (SELECT property_id FROM team_members WHERE user_id = auth.uid())
);
```

**Cleaning Sessions** - Role-based access:
```sql
CREATE POLICY "owners_manage_sessions" ON cleaning_sessions
FOR ALL USING (
  property_id IN (SELECT id FROM properties WHERE owner_id = auth.uid())
);

CREATE POLICY "cleaners_view_assigned_sessions" ON cleaning_sessions
FOR SELECT USING (assigned_cleaner_id = auth.uid());

CREATE POLICY "cleaners_update_assigned_sessions" ON cleaning_sessions
FOR UPDATE USING (assigned_cleaner_id = auth.uid());
```

**Invoices** - Owners only (CRITICAL):
```sql
CREATE POLICY "cleaners_no_invoice_access" ON invoices
FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role != 'cleaner')
);
```

---

## 📦 Storage Buckets

### cleaning-photos
Stores before/after photos for quality proof.

**Configuration**:
- Public: No (authenticated access only)
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp
- Path structure: `{sessionId}/{category}_{timestamp}.jpg`

**RLS**:
- Cleaners can upload to their sessions
- Owners can view photos from their properties

---

**Last Updated**: January 2025  
**Maintenance**: Update when schema changes

