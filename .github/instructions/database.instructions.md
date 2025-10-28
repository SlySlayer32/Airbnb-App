---
applyTo: '{services/**,supabase/**,types/**}'
description: 'Database schema, relationships, query patterns, and RLS policies'
---

# Database Schema & Patterns

## Complete Database Schema

### Core Tables

#### `profiles`

Extended user information (linked to `auth.users`).

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('property_owner', 'cleaner', 'co_host')),
  phone TEXT,
  address TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- `id` → `auth.users.id` (1:1)
- `id` → `properties.owner_id` (1:many)
- `id` → `team_members.user_id` (1:1)

**RLS Policies:**

- Users can read their own profile
- Users can update their own profile
- Property owners can read profiles of their team members

---

#### `properties`

Rental properties with detailed metadata.

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  rooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'occupied', 'maintenance', 'inactive')),
  max_occupancy INTEGER NOT NULL,
  property_type TEXT CHECK (property_type IN ('apartment', 'house', 'condo', 'villa', 'studio')),

  -- Access Information
  access_method TEXT CHECK (access_method IN ('key_lockbox', 'smart_lock', 'doorman', 'owner_present', 'other')),
  access_code TEXT,
  access_instructions TEXT,
  wifi_name TEXT,
  wifi_password TEXT,

  -- Property Features
  has_balcony BOOLEAN DEFAULT FALSE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_hot_tub BOOLEAN DEFAULT FALSE,
  has_bbq BOOLEAN DEFAULT FALSE,
  has_laundry BOOLEAN DEFAULT FALSE,
  special_areas TEXT[], -- Array of special area names
  parking_instructions TEXT,

  -- Cleaning Logistics
  cleaning_supplies_location TEXT,
  vacuum_location TEXT,
  linen_storage_location TEXT,
  default_checkin_time TIME NOT NULL DEFAULT '15:00',
  default_checkout_time TIME NOT NULL DEFAULT '11:00',
  estimated_cleaning_duration INTEGER DEFAULT 120, -- minutes

  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
```

**Relationships:**

- `owner_id` → `profiles.id` (many:1)
- `id` → `cleaning_sessions.property_id` (1:many)
- `id` → `linen_requirements.property_id` (1:many)
- `id` → `team_members.property_id` (many:many via team_members)

**RLS Policies:**

```sql
-- Users can view properties they own or are assigned to
CREATE POLICY "Users can view assigned properties" ON properties
  FOR SELECT USING (
    auth.uid() = owner_id OR
    auth.uid() IN (SELECT user_id FROM team_members WHERE property_id = id)
  );

-- Only owners can modify their properties
CREATE POLICY "Owners can modify properties" ON properties
  FOR ALL USING (auth.uid() = owner_id);
```

---

#### `cleaning_sessions`

Cleaning job sessions with full lifecycle tracking.

```sql
CREATE TABLE cleaning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  assigned_cleaner_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  guest_count INTEGER NOT NULL,
  checkin_time TIMESTAMP NOT NULL,
  checkout_time TIMESTAMP NOT NULL,
  scheduled_cleaning_time TIMESTAMP NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('checkout_clean', 'checkin_prep', 'maintenance_clean', 'deep_clean', 'inspection')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),

  -- Cancellation info
  cancelled_at TIMESTAMP,
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,
  cancellation_notice_hours INTEGER,

  -- Special requests
  special_requests TEXT,
  guest_notes TEXT,
  custom_linen_requirements JSONB,
  additional_cleaning_tasks TEXT[],
  priority_areas TEXT[],

  -- Status tracking (lifecycle timestamps)
  cleaner_arrived_at TIMESTAMP,
  cleaner_started_at TIMESTAMP,
  cleaner_completed_at TIMESTAMP,
  actual_guest_count INTEGER,

  -- Pause/Resume tracking
  cleaner_paused_at TIMESTAMP,
  cleaner_resumed_at TIMESTAMP,
  total_break_minutes INTEGER DEFAULT 0,
  is_currently_paused BOOLEAN DEFAULT FALSE,

  -- Photo requirements
  photos_required BOOLEAN DEFAULT FALSE,
  photos_completed BOOLEAN DEFAULT FALSE,
  completion_photos TEXT[],

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cleaning_sessions_property_id ON cleaning_sessions(property_id);
CREATE INDEX idx_cleaning_sessions_assigned_cleaner_id ON cleaning_sessions(assigned_cleaner_id);
CREATE INDEX idx_cleaning_sessions_scheduled_time ON cleaning_sessions(scheduled_cleaning_time);
CREATE INDEX idx_cleaning_sessions_status ON cleaning_sessions(status);
```

**Relationships:**

- `property_id` → `properties.id` (many:1)
- `assigned_cleaner_id` → `team_members.id` (many:1)
- `id` → `cleaning_updates.cleaning_session_id` (1:many)
- `id` → `photo_proof_requirements.session_id` (1:many)

**RLS Policies:**

```sql
-- Cleaners can view their assigned sessions
CREATE POLICY "Cleaners can view assigned sessions" ON cleaning_sessions
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM team_members WHERE id = assigned_cleaner_id) OR
    auth.uid() IN (SELECT owner_id FROM properties WHERE id = property_id)
  );

-- Cleaners can update their assigned sessions
CREATE POLICY "Cleaners manage own sessions" ON cleaning_sessions
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM team_members WHERE id = assigned_cleaner_id)
  );
```

---

#### `team_members`

Junction table linking users to properties with role information.

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('cleaner', 'cohost', 'contractor')),
  image_url TEXT,
  assigned_properties TEXT[], -- Denormalized for quick access
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_property_id ON team_members(property_id);
```

**Relationships:**

- `user_id` → `profiles.id` (many:1)
- `property_id` → `properties.id` (many:1)
- `id` → `cleaning_sessions.assigned_cleaner_id` (1:many)

**RLS Policies:**

```sql
-- Users can view team members of their properties
CREATE POLICY "View team members" ON team_members
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT owner_id FROM properties WHERE id = property_id)
  );
```

---

#### `linen_requirements`

Guest-count-specific linen requirements for properties.

```sql
CREATE TABLE linen_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
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
  additional_items JSONB,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(property_id, guest_count)
);

CREATE INDEX idx_linen_requirements_property_id ON linen_requirements(property_id);
```

**Relationships:**

- `property_id` → `properties.id` (many:1)

---

#### `cleaning_updates`

Activity log for cleaning sessions.

```sql
CREATE TABLE cleaning_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cleaning_session_id UUID NOT NULL REFERENCES cleaning_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  update_type TEXT NOT NULL CHECK (update_type IN ('status', 'note', 'issue', 'completion', 'pause', 'resume')),
  message TEXT NOT NULL,
  photo_urls TEXT[],
  requires_response BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cleaning_updates_session_id ON cleaning_updates(cleaning_session_id);
CREATE INDEX idx_cleaning_updates_created_at ON cleaning_updates(created_at DESC);
```

**Relationships:**

- `cleaning_session_id` → `cleaning_sessions.id` (many:1)
- `user_id` → `profiles.id` (many:1)

---

#### `user_dashboard_layouts`

User-specific dashboard widget configuration.

```sql
CREATE TABLE user_dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  components JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_user_dashboard_layouts_user_id ON user_dashboard_layouts(user_id);
```

**RLS Policy:**

```sql
CREATE POLICY "users_manage_own_layout" ON user_dashboard_layouts
  FOR ALL USING (auth.uid() = user_id);
```

---

## Query Patterns

### Fetching Properties with Sessions

**Owner View (with current/next sessions):**

```typescript
const { data } = await supabase
  .from('properties')
  .select(
    `
    *,
    cleaning_sessions!cleaning_sessions_property_id_fkey (
      id,
      guest_count,
      scheduled_cleaning_time,
      session_type,
      status,
      team_members (name, phone)
    )
  `
  )
  .eq('owner_id', userId)
  .order('created_at', { ascending: false });
```

**Cleaner View (only assigned properties):**

```typescript
const { data } = await supabase
  .from('cleaning_sessions')
  .select(
    `
    properties (*),
    id,
    guest_count,
    scheduled_cleaning_time,
    session_type,
    status
  `
  )
  .eq('assigned_cleaner_id', cleanerId)
  .gte('scheduled_cleaning_time', new Date().toISOString());
```

---

### Session Lifecycle Queries

**Today's Sessions with Full Context:**

```typescript
const { data } = await supabase
  .from('cleaning_sessions')
  .select(
    `
    *,
    properties (
      name,
      address,
      access_method,
      access_code,
      cleaning_supplies_location,
      linen_storage_location
    ),
    team_members (name, phone),
    linen_requirements (*)
  `
  )
  .eq('assigned_cleaner_id', cleanerId)
  .gte('scheduled_cleaning_time', startOfDay)
  .lt('scheduled_cleaning_time', endOfDay);
```

**Update Session Status:**

```typescript
const { data } = await supabase
  .from('cleaning_sessions')
  .update({
    status: 'in_progress',
    cleaner_started_at: new Date().toISOString(),
  })
  .eq('id', sessionId)
  .select(
    `
    *,
    properties (name, owner_id),
    team_members (name, phone)
  `
  )
  .single();
```

---

### Linen Requirements Query

**Get Requirements for Guest Count:**

```typescript
const { data } = await supabase
  .from('linen_requirements')
  .select('*')
  .eq('property_id', propertyId)
  .eq('guest_count', guestCount)
  .single();
```

---

## Common Join Patterns

### Property → Sessions → Team Members

```sql
SELECT p.*, cs.*, tm.name as cleaner_name
FROM properties p
LEFT JOIN cleaning_sessions cs ON p.id = cs.property_id
LEFT JOIN team_members tm ON cs.assigned_cleaner_id = tm.id
WHERE p.owner_id = auth.uid()
  AND cs.status IN ('scheduled', 'in_progress');
```

### Session → Updates → User Profiles

```sql
SELECT cs.*, cu.*, pr.full_name as update_author
FROM cleaning_sessions cs
LEFT JOIN cleaning_updates cu ON cs.id = cu.cleaning_session_id
LEFT JOIN profiles pr ON cu.user_id = pr.id
WHERE cs.id = $1
ORDER BY cu.created_at DESC;
```

---

## Performance Optimization

### Indexes to Add

```sql
-- Composite indexes for common queries
CREATE INDEX idx_sessions_cleaner_date ON cleaning_sessions(assigned_cleaner_id, scheduled_cleaning_time);
CREATE INDEX idx_sessions_property_status ON cleaning_sessions(property_id, status);

-- Partial indexes for active sessions
CREATE INDEX idx_active_sessions ON cleaning_sessions(scheduled_cleaning_time)
WHERE status IN ('scheduled', 'confirmed', 'in_progress');
```

---

## Data Integrity

### Triggers

**Auto-update `updated_at`:**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cleaning_sessions_updated_at
  BEFORE UPDATE ON cleaning_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Quick Reference

| Table                    | Primary Use               | Key Relationships                            |
| ------------------------ | ------------------------- | -------------------------------------------- |
| `profiles`               | User metadata             | → properties (owner), team_members (cleaner) |
| `properties`             | Rental units              | → cleaning_sessions, linen_requirements      |
| `cleaning_sessions`      | Jobs/tasks                | → properties, team_members, cleaning_updates |
| `team_members`           | User-property assignments | → profiles, properties, cleaning_sessions    |
| `linen_requirements`     | Guest-count linens        | → properties                                 |
| `cleaning_updates`       | Activity log              | → cleaning_sessions, profiles                |
| `user_dashboard_layouts` | UI customization          | → profiles                                   |

## Schema Overview

### Core Tables

#### `properties`

Primary entity for rental properties.

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  bedrooms INTEGER DEFAULT 1,
  bathrooms DECIMAL DEFAULT 1,
  owner_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active', -- active, inactive, maintenance
  property_type TEXT, -- apartment, house, condo, etc.
  square_feet INTEGER,
  amenities JSONB,
  cleaning_fee DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
```

#### `cleaning_sessions`

Tracks cleaning job sessions with lifecycle states.

```sql
CREATE TABLE cleaning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  assigned_cleaner_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending', -- pending, in_progress, paused, completed, cancelled
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  break_start TIMESTAMPTZ,
  break_end TIMESTAMPTZ,
  total_break_time INTEGER DEFAULT 0, -- seconds
  notes TEXT,
  checklist JSONB, -- { task_id: boolean }
  photos JSONB, -- [{ url, type, timestamp }]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_property_id ON cleaning_sessions(property_id);
CREATE INDEX idx_sessions_cleaner_id ON cleaning_sessions(assigned_cleaner_id);
CREATE INDEX idx_sessions_status ON cleaning_sessions(status);
CREATE INDEX idx_sessions_scheduled_start ON cleaning_sessions(scheduled_start);
```

#### `team_members`

Associates users with properties and roles.

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- cleaner, manager, owner
  hourly_rate DECIMAL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Indexes
CREATE INDEX idx_team_user_id ON team_members(user_id);
CREATE INDEX idx_team_property_id ON team_members(property_id);
```

#### `cleaning_updates`

Activity log for sessions.

```sql
CREATE TABLE cleaning_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES cleaning_sessions(id) ON DELETE CASCADE,
  cleaner_id UUID REFERENCES auth.users(id),
  update_type TEXT, -- started, paused, resumed, completed, note, photo
  message TEXT,
  metadata JSONB, -- Additional context
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_updates_session_id ON cleaning_updates(session_id);
CREATE INDEX idx_updates_created_at ON cleaning_updates(created_at DESC);
```

#### `linen_requirements`

Property-specific linen needs.

```sql
CREATE TABLE linen_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- sheets, towels, pillowcases, etc.
  quantity INTEGER NOT NULL,
  size TEXT, -- queen, king, standard, etc.
  notes TEXT,
  UNIQUE(property_id, item_type, size)
);

-- Index
CREATE INDEX idx_linen_property_id ON linen_requirements(property_id);
```

#### `profiles`

Extended user profile information.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'cleaner', -- owner, cleaner, admin
  bio TEXT,
  certifications JSONB,
  rating DECIMAL,
  total_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Table Relationships

```
┌─────────────┐
│ auth.users  │
│  (Supabase) │
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│  profiles   │                    │ properties  │
│             │                    │   (owned)   │
└─────────────┘                    └──────┬──────┘
                                          │
                    ┌─────────────────────┼────────────────┐
                    │                     │                │
                    ▼                     ▼                ▼
             ┌─────────────┐      ┌──────────────┐  ┌──────────────┐
             │team_members │      │linen_require.│  │cleaning_     │
             │             │      │              │  │sessions      │
             └─────────────┘      └──────────────┘  └──────┬───────┘
                                                            │
                                                            ▼
                                                     ┌──────────────┐
                                                     │cleaning_     │
                                                     │updates       │
                                                     └──────────────┘
```

## Row Level Security (RLS) Policies

### Properties RLS

```sql
-- Users can view properties they own or are assigned to
CREATE POLICY "View assigned properties" ON properties
  FOR SELECT USING (
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT user_id FROM team_members WHERE property_id = id
    )
  );

-- Only owners can update properties
CREATE POLICY "Owners update properties" ON properties
  FOR UPDATE USING (auth.uid() = owner_id);

-- Only owners can delete properties
CREATE POLICY "Owners delete properties" ON properties
  FOR DELETE USING (auth.uid() = owner_id);
```

### Cleaning Sessions RLS

```sql
-- View sessions for assigned properties or own sessions
CREATE POLICY "View assigned sessions" ON cleaning_sessions
  FOR SELECT USING (
    auth.uid() = assigned_cleaner_id OR
    auth.uid() IN (
      SELECT owner_id FROM properties WHERE id = property_id
    )
  );

-- Only assigned cleaners can update their sessions
CREATE POLICY "Cleaners update own sessions" ON cleaning_sessions
  FOR UPDATE USING (auth.uid() = assigned_cleaner_id);
```

### Team Members RLS

```sql
-- Property owners can manage team members
CREATE POLICY "Owners manage team" ON team_members
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM properties WHERE id = property_id
    )
  );

-- Users can view their own team assignments
CREATE POLICY "View own assignments" ON team_members
  FOR SELECT USING (auth.uid() = user_id);
```

## Query Patterns

### Efficient property fetching with related data

```typescript
// ✅ Use select with joins to minimize round trips
const { data: properties } = await supabase
  .from('properties')
  .select(
    `
    *,
    team_members!inner(
      user_id,
      role,
      profiles(full_name, avatar_url)
    ),
    linen_requirements(*)
  `
  )
  .eq('status', 'active');

// ❌ Avoid N+1 queries
const properties = await getProperties();
for (const property of properties) {
  const team = await getTeamMembers(property.id); // N+1!
}
```

### Filtering and pagination

```typescript
// ✅ Use range for pagination
const { data, count } = await supabase
  .from('cleaning_sessions')
  .select('*, properties(name, address)', { count: 'exact' })
  .eq('assigned_cleaner_id', userId)
  .gte('scheduled_start', startDate)
  .lte('scheduled_start', endDate)
  .order('scheduled_start', { ascending: true })
  .range(0, 9); // First 10 items

// ✅ Use indexes for common filters
// Ensure indexes exist on filtered columns
```

### Aggregations

```typescript
// ✅ Count sessions by status
const { count: completedCount } = await supabase
  .from('cleaning_sessions')
  .select('*', { count: 'exact', head: true })
  .eq('assigned_cleaner_id', userId)
  .eq('status', 'completed');

// For complex aggregations, consider PostgreSQL functions
const { data } = await supabase.rpc('get_cleaner_stats', {
  cleaner_id: userId,
  start_date: startDate,
  end_date: endDate,
});
```

### Upserts (insert or update)

```typescript
// ✅ Use upsert for idempotent operations
const { data, error } = await supabase.from('linen_requirements').upsert(
  {
    property_id: propertyId,
    item_type: 'sheets',
    size: 'queen',
    quantity: 4,
  },
  { onConflict: 'property_id,item_type,size' }
);
```

### Transaction-like patterns

```typescript
// Supabase doesn't support client-side transactions
// Use database functions for complex multi-step operations

// ✅ Create PostgreSQL function for atomic operations
CREATE OR REPLACE FUNCTION complete_cleaning_session(
  session_id UUID,
  completion_time TIMESTAMPTZ
)
RETURNS void AS $$
BEGIN
  -- Update session
  UPDATE cleaning_sessions
  SET status = 'completed', actual_end = completion_time
  WHERE id = session_id;

  -- Update cleaner stats
  UPDATE profiles
  SET total_jobs = total_jobs + 1
  WHERE id = (SELECT assigned_cleaner_id FROM cleaning_sessions WHERE id = session_id);

  -- Log update
  INSERT INTO cleaning_updates(session_id, update_type, created_at)
  VALUES (session_id, 'completed', completion_time);
END;
$$ LANGUAGE plpgsql;

// Call from TypeScript
await supabase.rpc('complete_cleaning_session', {
  session_id: sessionId,
  completion_time: new Date().toISOString()
});
```

## Realtime Subscriptions

### Channel patterns

```typescript
// ✅ Subscribe to specific table changes
const channel = supabase
  .channel('cleaning_sessions_changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE, or *
      schema: 'public',
      table: 'cleaning_sessions',
      filter: `assigned_cleaner_id=eq.${userId}`, // Filter server-side
    },
    (payload) => {
      console.log('Session changed:', payload);
      // Update local state
    }
  )
  .subscribe();

// ✅ Cleanup subscription
channel.unsubscribe();
```

### Realtime filters

```typescript
// Use filters to reduce bandwidth
// Only receive updates for relevant records

// ❌ Receive all updates, filter client-side
.on('postgres_changes', { table: 'cleaning_sessions' }, ...)

// ✅ Filter server-side
.on(
  'postgres_changes',
  {
    table: 'cleaning_sessions',
    filter: `property_id=eq.${propertyId}`
  },
  ...
)
```

## Performance Best Practices

### Indexing strategy

- Index foreign keys (`property_id`, `user_id`, etc.)
- Index commonly filtered columns (`status`, `scheduled_start`)
- Index columns used in ORDER BY
- Use partial indexes for common filters
  ```sql
  CREATE INDEX idx_active_sessions ON cleaning_sessions(scheduled_start)
  WHERE status = 'in_progress';
  ```

### Query optimization

- Use `select('*')` sparingly - specify only needed columns
- Leverage RLS instead of manual filtering
- Use `count: 'exact'` only when needed (slower)
- Batch reads when possible
- Cache frequently accessed, rarely changed data

### Data migration patterns

```sql
-- Use transactions for schema changes
BEGIN;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS check_in_time TIME;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS check_out_time TIME;

-- Backfill with default values
UPDATE properties SET check_in_time = '15:00:00' WHERE check_in_time IS NULL;
UPDATE properties SET check_out_time = '11:00:00' WHERE check_out_time IS NULL;

COMMIT;
```

## Common Query Anti-Patterns

### ❌ Avoid

```typescript
// Fetching too much data
const { data } = await supabase.from('properties').select('*');

// N+1 queries
for (const property of properties) {
  const sessions = await supabase
    .from('cleaning_sessions')
    .select('*')
    .eq('property_id', property.id);
}

// No pagination
const { data } = await supabase.from('cleaning_sessions').select('*'); // Could return thousands of rows
```

### ✅ Better alternatives

```typescript
// Fetch only needed columns
const { data } = await supabase
  .from('properties')
  .select('id, name, address, status')
  .eq('status', 'active');

// Use joins to avoid N+1
const { data } = await supabase
  .from('properties')
  .select(
    `
    id, name, address,
    cleaning_sessions(id, status, scheduled_start)
  `
  )
  .eq('cleaning_sessions.status', 'in_progress');

// Always paginate
const { data } = await supabase
  .from('cleaning_sessions')
  .select('*')
  .order('scheduled_start', { ascending: false })
  .range(0, 49); // Limit to 50 records
```

## Type Safety with Database

### Generate TypeScript types from schema

```bash
# Generate types from Supabase
npx supabase gen types typescript --project-id your-project-id > types/database.ts
```

### Use generated types

```typescript
import { Database } from '@/types/database';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

// Type-safe queries
const { data } = await supabase.from('properties').select('*').returns<Property[]>();
```
