# Runtime View

> Critical data flows and system behavior at runtime

## Overview

This document describes how the system behaves at runtime, focusing on critical data flows, user interactions, and system responses.

## Critical Scenarios

### 1. Session Lifecycle Flow

**Scenario**: Cleaner completes a cleaning session from start to finish

#### Flow Diagram

```
1. Schedule Created (Owner)
   ├─ Owner schedules cleaning
   ├─ System validates 11 AM - 3 PM window
   ├─ cleaningSessionService.createSession()
   ├─ Supabase: INSERT into cleaning_sessions
   ├─ notificationService.create() → Cleaner receives alert
   └─ realtimeService.broadcast() → Owner dashboard updates

2. Cleaner Arrives (Cleaner)
   ├─ Cleaner opens app, sees job
   ├─ Cleaner taps "Start Cleaning"
   ├─ cleaningUpdateService.recordArrival()
   ├─ Supabase: UPDATE cleaning_sessions (status = 'in_progress')
   ├─ Supabase: INSERT into cleaning_updates (arrival_time)
   ├─ Banner state changes to "in progress"
   └─ Real-time update → Owner sees "Cleaner arrived"

3. Cleaner Works (Cleaner)
   ├─ Cleaner performs cleaning tasks
   ├─ Optional: Cleaner adds progress updates
   ├─ cleaningUpdateService.addUpdate()
   ├─ Supabase: INSERT into cleaning_updates
   └─ Real-time update → Owner sees progress

4. Cleaner Uploads Photos (Cleaner)
   ├─ Cleaner taps "Upload Photos"
   ├─ Camera opens, cleaner takes photos
   ├─ photoProofService.uploadPhoto()
   ├─ Supabase Storage: Upload to cleaning-photos bucket
   ├─ Supabase: UPDATE cleaning_sessions (photo_urls array)
   ├─ PhotoProofGate validates: "3/3 photos ✓"
   └─ "Mark Complete" button enabled

5. Cleaner Completes (Cleaner)
   ├─ Cleaner taps "Mark Complete"
   ├─ PhotoProofGate validates minimum photos
   ├─ cleaningSessionService.completeSession()
   ├─ Supabase: UPDATE cleaning_sessions (status = 'completed', completion_time)
   ├─ notificationService.create() → Owner receives alert
   ├─ Real-time update → Owner sees "Cleaning completed"
   └─ Banner state changes to "completed"

6. Owner Reviews (Owner)
   ├─ Owner opens app, sees completed session
   ├─ Owner views photos in session details
   ├─ Owner rates cleaning quality (optional)
   └─ System logs rating for cleaner performance
```

#### Key Business Rules Enforced

1. **Cleaning Window**: Session must be scheduled 11 AM - 3 PM
2. **Photo Proof**: Minimum 3 photos required before completion
3. **Real-time Updates**: Owner sees progress in real-time
4. **Notification**: Both cleaner and owner receive alerts

#### Data Changes

```typescript
// Initial State
cleaning_sessions: {
  id: 'session-123',
  status: 'scheduled',
  scheduled_cleaning_time: '2025-01-15T12:00:00Z',
  photo_urls: [],
  completion_time: null
}

// After Cleaner Arrives
cleaning_sessions: {
  status: 'in_progress',
  arrival_time: '2025-01-15T12:05:00Z'
}

cleaning_updates: [
  { type: 'arrival', timestamp: '2025-01-15T12:05:00Z' }
]

// After Photos Uploaded
cleaning_sessions: {
  photo_urls: [
    'https://storage.supabase.co/cleaning-photos/session-123/kitchen.jpg',
    'https://storage.supabase.co/cleaning-photos/session-123/bathroom.jpg',
    'https://storage.supabase.co/cleaning-photos/session-123/living.jpg'
  ]
}

// After Completion
cleaning_sessions: {
  status: 'completed',
  completion_time: '2025-01-15T13:45:00Z',
  actual_duration_minutes: 100
}
```

---

### 2. Photo Upload Flow

**Scenario**: Cleaner uploads photos for session completion

#### Flow Diagram

```
1. Cleaner Initiates Upload
   ├─ Cleaner taps "Upload Photos" button
   ├─ System checks device permissions (camera, storage)
   ├─ Camera interface opens

2. Cleaner Takes Photos
   ├─ Cleaner takes photo of kitchen
   ├─ System validates photo (size, format)
   ├─ Photo compressed to < 5MB
   ├─ Cleaner takes photo of bathroom
   ├─ Cleaner takes photo of living area

3. Photos Uploaded
   ├─ photoProofService.uploadPhoto()
   ├─ Generate unique filename: sessionId/area-timestamp.jpg
   ├─ Supabase Storage: Upload to cleaning-photos bucket
   ├─ Get public URL from Supabase
   ├─ Update session.photo_urls array
   └─ Supabase: UPDATE cleaning_sessions

4. Validation
   ├─ PhotoProofGate checks photo count
   ├─ If < 3 photos: Show "Upload 2 more photos"
   ├─ If >= 3 photos: Enable "Mark Complete" button
   └─ Display photo thumbnails

5. Completion Enabled
   ├─ Cleaner sees "3/3 photos ✓"
   ├─ "Mark Complete" button becomes active
   └─ Cleaner can finish session
```

#### Technical Details

**Photo Processing**:
```typescript
// Upload flow
async uploadPhoto(sessionId: string, area: string, photoUri: string) {
  // 1. Compress photo
  const compressedPhoto = await ImageManipulator.manipulateAsync(
    photoUri,
    [{ resize: { width: 1920 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  // 2. Generate filename
  const filename = `${sessionId}/${area}-${Date.now()}.jpg`;

  // 3. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('cleaning-photos')
    .upload(filename, compressedPhoto.uri);

  if (error) throw error;

  // 4. Get public URL
  const { data: urlData } = supabase.storage
    .from('cleaning-photos')
    .getPublicUrl(filename);

  // 5. Update session
  await supabase
    .from('cleaning_sessions')
    .update({ photo_urls: [...existingPhotos, urlData.publicUrl] })
    .eq('id', sessionId);
}
```

**Validation**:
```typescript
// Check if enough photos uploaded
function canCompleteSession(photoUrls: string[]): boolean {
  return photoUrls.length >= 3;
}

// PhotoProofGate component
<PhotoProofGate
  sessionId={session.id}
  minimumPhotos={3}
  onPhotosValidated={handleComplete}
/>
```

---

### 3. Real-time Update Flow

**Scenario**: Owner sees cleaner's progress in real-time

#### Flow Diagram

```
1. Subscription Setup
   ├─ Owner opens dashboard
   ├─ Component mounts
   ├─ realtimeService.subscribe('cleaning_sessions')
   ├─ Supabase WebSocket connection established
   └─ Connection status: "Connected"

2. Cleaner Makes Change
   ├─ Cleaner records arrival
   ├─ Supabase: UPDATE cleaning_sessions
   ├─ Supabase triggers WebSocket notification
   └─ Payload: { eventType: 'UPDATE', new: {...}, old: {...} }

3. Owner Receives Update
   ├─ WebSocket receives notification
   ├─ realtimeService callback executes
   ├─ Component state updates
   ├─ UI re-renders with new data
   └─ Owner sees "Cleaner arrived at 12:05 PM"

4. Multiple Updates
   ├─ Cleaner adds progress update
   ├─ WebSocket notification → Owner sees progress
   ├─ Cleaner uploads photos
   ├─ WebSocket notification → Owner sees photo count
   └─ Real-time experience maintained

5. Cleanup
   ├─ Owner navigates away
   ├─ Component unmounts
   ├─ realtimeService.unsubscribe()
   └─ WebSocket connection closed
```

#### Technical Details

**Subscription Pattern**:
```typescript
// In component
useEffect(() => {
  const subscription = realtimeService.subscribe(
    'cleaning_sessions',
    (payload) => {
      if (payload.eventType === 'UPDATE') {
        // Update local state
        setSessions(prev => prev.map(s =>
          s.id === payload.new.id ? payload.new : s
        ));
      }
    }
  );

  return () => {
    realtimeService.unsubscribe(subscription);
  };
}, []);
```

**Connection Management**:
```typescript
// realtimeService.ts
class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribe(table: string, callback: Function) {
    const channel = supabase
      .channel(`changes:${table}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
      }, callback)
      .subscribe();

    this.channels.set(table, channel);
    return channel;
  }

  unsubscribe(channel: RealtimeChannel) {
    channel.unsubscribe();
  }
}
```

---

### 4. Authentication Flow

**Scenario**: User logs in to the application

#### Flow Diagram

```
1. User Opens App
   ├─ App checks for existing session
   ├─ If session exists → Auto-login
   └─ If no session → Show login screen

2. User Enters Credentials
   ├─ User enters email and password
   ├─ User taps "Login"
   ├─ System validates input (email format, password length)
   └─ If invalid → Show error message

3. Authentication Request
   ├─ Supabase Auth: signInWithPassword()
   ├─ Supabase validates credentials
   ├─ If invalid → Return error
   └─ If valid → Return session + user

4. Profile Fetch
   ├─ System fetches user profile from database
   ├─ Supabase: SELECT * FROM profiles WHERE id = user.id
   ├─ Profile includes: role, name, properties, etc.
   └─ If no profile → Redirect to onboarding

5. Session Storage
   ├─ Session stored in secure storage (AsyncStorage/Keychain)
   ├─ AuthContext updates with user + profile
   ├─ App navigates to dashboard
   └─ Role-based routing determines dashboard type

6. Dashboard Display
   ├─ If role === 'cleaner' → Show CleanerDashboard
   ├─ If role === 'property_owner' → Show OwnerDashboard
   └─ If role === 'co_host' → Show CoHostDashboard
```

#### Technical Details

**Auth Context**:
```typescript
// AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setProfile(data);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Role-Based Routing**:
```typescript
// index.tsx (Dashboard)
export default function Dashboard() {
  const { profile } = useAuth();

  if (profile?.role === 'cleaner') {
    return <CleanerDashboard />;
  } else if (profile?.role === 'property_owner') {
    return <OwnerDashboard />;
  } else if (profile?.role === 'co_host') {
    return <CoHostDashboard />;
  }

  return <Onboarding />;
}
```

---

### 5. Notification Trigger Flow

**Scenario**: System sends notification when session is cancelled

#### Flow Diagram

```
1. Owner Cancels Session
   ├─ Owner taps "Cancel" button
   ├─ System calculates notice hours
   ├─ If < 24 hours → Show "SHORT NOTICE" warning
   ├─ Owner confirms cancellation
   └─ cleaningSessionService.cancelSession()

2. Session Cancelled
   ├─ Supabase: UPDATE cleaning_sessions (status = 'cancelled')
   ├─ Supabase: INSERT into cleaning_updates (cancellation record)
   └─ Real-time update → Cleaner sees cancellation

3. Notification Created
   ├─ notificationService.create()
   ├─ Determine notification type: 'session_cancelled'
   ├─ Determine priority: 'high' if short notice, 'normal' otherwise
   ├─ Supabase: INSERT into notifications
   └─ Payload: { user_id, type, title, message, priority }

4. Cleaner Receives Notification
   ├─ Real-time subscription triggers
   ├─ Cleaner's dashboard updates
   ├─ Notification badge shows count
   └─ Cleaner can view notification details

5. Notification Display
   ├─ Cleaner taps notification
   ├─ Navigate to session details
   ├─ Show cancellation reason (if provided)
   ├─ Show notice hours
   └─ Cleaner can respond or acknowledge
```

#### Technical Details

**Notification Service**:
```typescript
// notificationService.ts
async createNotification(data: {
  user_id: string;
  type: string;
  title: string;
  message: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
}) {
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      ...data,
      priority: data.priority || 'normal',
      read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  // Real-time broadcast
  realtimeService.broadcast('notifications', notification);

  return notification;
}
```

**Notification Display**:
```typescript
// NotificationBadge component
export default function NotificationBadge() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to notifications
    const subscription = realtimeService.subscribe(
      'notifications',
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      }
    );

    return () => realtimeService.unsubscribe(subscription);
  }, []);

  return (
    <View style={styles.badge}>
      <Ionicons name="notifications" size={24} />
      {unreadCount > 0 && (
        <View style={styles.count}>
          <Text style={styles.countText}>{unreadCount}</Text>
        </View>
      )}
    </View>
  );
}
```

---

## Performance Characteristics

### Response Times

| Operation | Target | Actual | Notes |
|-----------|--------|--------|-------|
| Login | < 2s | ~1.5s | Includes profile fetch |
| Dashboard Load | < 3s | ~2s | Includes data fetch + render |
| Photo Upload | < 5s | ~3s | Depends on photo size |
| Real-time Update | < 1s | ~500ms | WebSocket latency |
| Navigation | < 500ms | ~300ms | Expo Router |

### Resource Usage

| Resource | Usage | Limit | Status |
|----------|-------|-------|--------|
| Database Connections | 5-10 | 100 | ✅ Healthy |
| Storage Space | ~500MB | 5GB | ✅ Healthy |
| API Requests | ~1000/day | 10000/day | ✅ Healthy |
| Real-time Connections | 5-20 | 1000 | ✅ Healthy |

---

**Last Updated**: January 2025
**Maintenance**: Update as new runtime scenarios emerge

