# Integration Patterns

> Cross-component and service communication patterns

## Service-to-Service Integration

```typescript
// In cleaningSessionService.ts
import { notificationService } from './notificationService';

async completeSession(sessionId: string) {
  // Update session
  const session = await this.updateSession(sessionId, { status: 'completed' });

  // Trigger notification to owner
  await notificationService.create({
    user_id: session.property.owner_id,
    type: 'session_completed',
    title: 'Cleaning Completed',
    message: `${session.property.name} has been cleaned`,
    priority: 'normal'
  });

  return session;
}
```

## Component-to-Service Communication

```typescript
// In CleanerDashboard.tsx
import { cleaningSessionService } from '@/services';
import { CleaningSession } from '@/types';

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
```

## Real-time Communication Flow

```typescript
// In component
import { realtimeService } from '@/services';

useEffect(() => {
  const channel = realtimeService.subscribe(
    'cleaning_sessions',
    (payload) => {
      if (payload.eventType === 'UPDATE') {
        // Update local state with new data
        setSessions(prev => prev.map(s =>
          s.id === payload.new.id ? payload.new : s
        ));
      }
    }
  );

  // Cleanup on unmount
  return () => {
    realtimeService.unsubscribe(channel);
  };
}, []);
```

## Role-Based Component Integration

```typescript
import { useAuth } from '@/contexts/AuthContext';
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

function Dashboard() {
  const { profile } = useAuth();

  return (
    <View>
      {/* Show to specific roles */}
      <RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
        <FinancialSummary />
      </RoleBasedWrapper>

      {/* Conditional by role */}
      {profile?.role === 'cleaner' ? (
        <CleanerDashboard />
      ) : (
        <OwnerDashboard />
      )}
    </View>
  );
}
```

## Photo Integration Flow

```typescript
// PhotoProofGate component enforces minimum photos
<PhotoProofGate
  sessionId={session.id}
  onPhotosValidated={handleComplete}
  minimumPhotos={3}
/>

// Internally:
// 1. PhotoProofService.uploadPhoto() uploads to Supabase Storage
// 2. Returns URL
// 3. Stores URL in cleaning_session.photo_urls array
// 4. Only calls onPhotosValidated when count >= minimumPhotos
```

## Notification Integration Points

```typescript
// Session created
cleaningSessionService.createSession() → notificationService.create()

// Session cancelled
cleaningSessionService.cancelSession() → notificationService.create()
  → Check if short notice → priority: 'high'

// Session completed
cleaningSessionService.completeSession() → notificationService.create()
```

## Component-to-Component Communication

```typescript
// Parent component
<CleanerPropertyCard
  property={property}
  session={session}
  onStartSession={handleStart}
  onReportIssue={handleIssue}
/>

// Child component
interface CleanerPropertyCardProps {
  property: Property;
  session?: CleaningSession;
  onStartSession: (sessionId: string) => void;
  onReportIssue: (propertyId: string) => void;
}
```

## Database Integration Pattern

```typescript
// Standard query pattern in services
const { data, error } = await supabase
  .from('table_name')
  .select(`
    *,
    related_table (id, name),
    nested_relation (
      id,
      name,
      another_relation (id, name)
    )
  `)
  .eq('filter_field', value)
  .order('created_at', { ascending: false });

if (error) throw error;
return data;
```

## Authentication Integration

```typescript
// Anywhere in app
import { useAuth } from '@/contexts/AuthContext';

function Component() {
  const { user, profile, session, loading, isDemoMode } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (isDemoMode) return <DemoModeBanner />;
  if (!user) return <LoginPrompt />;

  return <ProtectedContent role={profile.role} />;
}
```

---

**Last Updated**: January 2025

