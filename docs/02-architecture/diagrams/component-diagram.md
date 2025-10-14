# C4 Level 3: Component Relationships

## Cleaner Dashboard Component Structure

### CleanerDashboard (Main Container)
**Purpose**: Cleaner's primary screen with today's jobs
**Location**: `components/CleanerDashboard.tsx`
**State**:
- `sessions`: Today's cleaning sessions
- `activeSession`: Currently active session (if any)
- `loading`: Loading state
- `error`: Error state

**Child Components**:
- `CleanerTopBar` - Time display and online status
- `CleanerStatusBanner` - Current session state
- `CleanerActiveSessionCard` - Active session details
- `CleanerNextJobCard` - Next upcoming job
- `CleanerPropertyCard` - Property information

**Service Dependencies**:
- `cleaningSessionService.getTodaySessions()`
- `cleaningSessionService.startSession()`
- `cleaningSessionService.completeSession()`
- `cleaningUpdateService.getLatestUpdate()`
- `bannerStateService.getBannerState()`

**Data Flow**:
```
CleanerDashboard
  ↓ calls
cleaningSessionService.getTodaySessions()
  ↓ returns
CleaningSession[]
  ↓ renders
CleanerStatusBanner (state from bannerStateService)
  ↓ renders
CleanerActiveSessionCard (if session active)
  ↓ renders
CleanerNextJobCard (if no active session)
```

---

## Service Dependencies

### cleaningSessionService Dependencies

```
cleaningSessionService
  ├→ notificationService.create()
  │   └→ Creates notifications for session events
  │
  ├→ realtimeService.subscribe()
  │   └→ Broadcasts session updates
  │
  └→ photoProofService.validatePhotoCount()
      └→ Validates photos before completion
```

**Example Flow**:
```typescript
async completeSession(sessionId: string) {
  // 1. Validate photos
  const photos = await photoProofService.getPhotos(sessionId);
  if (photos.length < 3) {
    throw new Error('Minimum 3 photos required');
  }

  // 2. Update session
  const session = await this.updateSession(sessionId, { status: 'completed' });

  // 3. Create notification for owner
  await notificationService.create({
    user_id: session.property.owner_id,
    type: 'session_completed',
    title: 'Cleaning Completed',
    message: `${session.property.name} has been cleaned`
  });

  // 4. Real-time broadcast happens automatically via Supabase
  return session;
}
```

---

## State Management Architecture

### Global State: AuthContext
**Purpose**: User authentication and profile
**Location**: `contexts/AuthContext.tsx`
**State**:
```typescript
{
  user: User | null,           // Supabase user
  profile: Profile | null,      // User profile with role
  session: Session | null,      // Auth session
  loading: boolean,             // Loading state
  isDemoMode: boolean          // Demo mode flag
}
```

**Access**: `const { user, profile } = useAuth()`
**Usage**: All screens access user/profile via this context

**Why Context?**:
- Auth is truly global (needed everywhere)
- Simple API (no complex state management)
- React built-in (no external dependencies)
- Performance is fine (auth rarely changes)

### Local State: useState
**Purpose**: Component-specific UI state
**Pattern**: Each component manages its own state

**When to Use**:
- Loading states
- Form inputs
- Selected items
- UI toggles
- Error states

**Example**:
```typescript
function PropertyCard({ property }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    try {
      setLoading(true);
      await propertyService.doAction(property.id);
    } catch (err) {
      setError('Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {error && <Text>{error}</Text>}
      <Button onPress={handleAction} disabled={loading}>
        {loading ? 'Loading...' : 'Action'}
      </Button>
    </View>
  );
}
```

### Real-Time State: Supabase Realtime
**Purpose**: Live updates for multi-user data
**Pattern**: Subscribe to table changes, update local state

**When to Use**:
- Session status changes
- Progress updates
- New notifications
- Any data that changes frequently

**Example**:
```typescript
useEffect(() => {
  const channel = realtimeService.subscribe(
    'cleaning_sessions',
    (payload) => {
      if (payload.eventType === 'UPDATE') {
        setSessions(prev => prev.map(s =>
          s.id === payload.new.id ? payload.new : s
        ));
      }
    }
  );

  return () => realtimeService.unsubscribe(channel);
}, []);
```

---

## Component Communication Patterns

### Parent → Child: Props Down
```typescript
// Parent component
function Dashboard() {
  const [sessions, setSessions] = useState<CleaningSession[]>([]);

  return (
    <View>
      <CleanerActiveSessionCard
        session={sessions[0]}  // Pass data down
        onComplete={handleComplete}  // Pass callback down
      />
    </View>
  );
}

// Child component
function CleanerActiveSessionCard({ session, onComplete }: Props) {
  return (
    <TouchableOpacity onPress={() => onComplete(session.id)}>
      {/* Render session data */}
    </TouchableOpacity>
  );
}
```

### Child → Parent: Events Up
```typescript
// Parent component
function PropertyList() {
  const handlePropertyPress = (propertyId: string) => {
    // Navigate to property details
    router.push(`/properties/${propertyId}`);
  };

  return (
    <FlatList
      data={properties}
      renderItem={({ item }) => (
        <PropertyCard
          property={item}
          onPress={() => handlePropertyPress(item.id)}  // Callback up
        />
      )}
    />
  );
}

// Child component
function PropertyCard({ property, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      {/* Render property data */}
    </TouchableOpacity>
  );
}
```

### Sibling Communication: Lift State Up
```typescript
// Parent manages shared state
function Dashboard() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  return (
    <View>
      <SessionList
        selectedId={selectedSession}
        onSelect={setSelectedSession}  // Update shared state
      />
      <SessionDetails
        sessionId={selectedSession}  // Read shared state
      />
    </View>
  );
}
```

---

## Component Hierarchy Examples

### Cleaner Dashboard Flow
```
CleanerDashboard (screen)
  ├── CleanerTopBar
  │   ├── Time display
  │   └── Online status indicator
  │
  ├── CleanerStatusBanner
  │   ├── State: Ready/Active/Break/Complete/Error
  │   └── Message: Context-aware guidance
  │
  ├── CleanerActiveSessionCard (if session active)
  │   ├── Session details
  │   ├── Timer display
  │   ├── Pause/Resume buttons
  │   └── Complete button (with photo gate)
  │
  ├── CleanerNextJobCard (if no active session)
  │   ├── Property name
  │   ├── Scheduled time
  │   ├── Countdown timer
  │   └── Start button
  │
  └── FlatList of CleanerPropertyCard
      ├── Property name
      ├── Address
      ├── Guest count
      ├── Linen requirements
      ├── Access codes
      └── Special instructions
```

### Photo Proof Flow
```
PhotoProofGate (wrapper component)
  ├── Validates photo count
  ├── Shows upload UI if insufficient
  └── Enables completion if sufficient

  ├── PhotoUploadSection
  │   ├── Camera button
  │   ├── Gallery button
  │   └── Photo previews
  │
  └── CompleteButton
      ├── Disabled if < 3 photos
      ├── Enabled if >= 3 photos
      └── Calls onComplete callback
```

### Owner Property Management Flow
```
OwnerPropertyCard (property owner view)
  ├── Property details
  ├── Financial data (hidden from cleaners)
  ├── Manage button
  └── Schedule button

  └── On press → Navigate to property details screen
      ├── PropertyEditor (if editing)
      ├── ScheduleView (if scheduling)
      └── HistoryView (if viewing history)
```

---

## Service Integration Patterns

### Direct Service Calls
```typescript
// Component calls service directly
function SessionList() {
  const [sessions, setSessions] = useState<CleaningSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await cleaningSessionService.getTodaySessions();
      setSessions(data);
    } catch (error) {
      // Error already shown by service
    }
  };
}
```

### Service-to-Service Calls
```typescript
// Service calls another service
export const cleaningSessionService = {
  async completeSession(sessionId: string) {
    // 1. Validate photos
    await photoProofService.validatePhotoCount(sessionId);

    // 2. Update session
    const session = await this.updateSession(sessionId, { status: 'completed' });

    // 3. Notify owner
    await notificationService.create({
      user_id: session.property.owner_id,
      type: 'session_completed',
      title: 'Cleaning Completed'
    });

    return session;
  }
};
```

### Real-Time Integration
```typescript
// Component subscribes to real-time updates
function SessionList() {
  const [sessions, setSessions] = useState<CleaningSession[]>([]);

  useEffect(() => {
    // Load initial data
    loadSessions();

    // Subscribe to real-time updates
    const channel = realtimeService.subscribe(
      'cleaning_sessions',
      (payload) => {
        if (payload.eventType === 'UPDATE') {
          setSessions(prev => prev.map(s =>
            s.id === payload.new.id ? payload.new : s
          ));
        }
      }
    );

    return () => realtimeService.unsubscribe(channel);
  }, []);
}
```

---

## Error Propagation

### Service → Component
```typescript
// Service shows alert and throws
export const cleaningSessionService = {
  async getSessions() {
    try {
      const { data, error } = await supabase.from('sessions').select();
      if (error) throw error;
      return data;
    } catch (error) {
      Alert.alert('Error', 'Could not load sessions');
      throw error;  // Re-throw for component
    }
  }
};

// Component catches and handles UI state
function SessionList() {
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      const data = await cleaningSessionService.getSessions();
      setSessions(data);
    } catch (error) {
      // Error already shown by service
      setError('Failed to load sessions');
    }
  };
}
```

---

## Key Design Principles

### 1. Single Responsibility
Each component has one clear purpose:
- `CleanerTopBar`: Display time and status
- `CleanerStatusBanner`: Show session state
- `CleanerActiveSessionCard`: Display active session
- `PhotoProofGate`: Enforce photo requirements

### 2. Composition Over Inheritance
Build complex UIs from simple components:
```typescript
function CleanerDashboard() {
  return (
    <View>
      <CleanerTopBar />
      <CleanerStatusBanner />
      <CleanerActiveSessionCard />
      <CleanerNextJobCard />
    </View>
  );
}
```

### 3. Props Interface
Components expose clear, typed interfaces:
```typescript
interface CleanerPropertyCardProps {
  property: Property;
  session?: CleaningSession;
  onPress: () => void;
  onStartSession?: (sessionId: string) => void;
}
```

### 4. Service Layer Abstraction
Components never call Supabase directly:
```typescript
// ❌ Bad
const { data } = await supabase.from('sessions').select();

// ✅ Good
const data = await cleaningSessionService.getSessions();
```

### 5. Error Boundaries
Critical components wrapped in error boundaries:
```typescript
<ErrorBoundary>
  <CleanerDashboard />
</ErrorBoundary>
```

---

**Summary**: The component architecture follows React best practices with clear separation of concerns, typed interfaces, and service layer abstraction. Components are small, focused, and reusable.

