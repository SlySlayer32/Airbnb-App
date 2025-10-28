---
applyTo: '**'
description: 'Security best practices for authentication, data access, and API security'
---

# Security Best Practices

## Authentication & Authorization

### Supabase Auth patterns

```typescript
// ✅ Always check auth state before sensitive operations
const {
  data: { user },
  error,
} = await supabase.auth.getUser();
if (!user) {
  throw new ServiceError('Unauthorized', 'AUTH_REQUIRED');
}

// ✅ Use RLS policies - never bypass with service role key in client code
// All queries automatically filtered by user permissions

// ❌ Never expose service role key in client code
// ❌ Never trust client-side user ID without server verification
```

### Demo mode security

```typescript
// Demo mode should have limited capabilities
if (isDemoMode) {
  // Use mock data only
  // Prevent any actual API calls
  // Clear indicators to user that this is demo
}
```

## Row Level Security (RLS)

### RLS Policy patterns

```sql
-- Properties: Users can only see their assigned properties or owned properties
CREATE POLICY "Users can view assigned properties" ON properties
  FOR SELECT USING (
    auth.uid() = owner_id OR
    auth.uid() IN (SELECT user_id FROM team_members WHERE property_id = id)
  );

-- Sessions: Cleaners can only modify their own sessions
CREATE POLICY "Cleaners manage own sessions" ON cleaning_sessions
  FOR UPDATE USING (auth.uid() = assigned_cleaner_id);
```

### Testing RLS policies

- Test with different user roles (owner, cleaner, admin)
- Verify unauthorized access is blocked
- Check filter performance with large datasets

## Input Validation & Sanitization

### Always validate user input

```typescript
// ✅ Validate at service layer
export async function createProperty(data: PropertyInput) {
  // Validate required fields
  if (!data.name || !data.address) {
    throw new ServiceError('Missing required fields', 'VALIDATION_ERROR');
  }

  // Sanitize strings
  const sanitized = {
    name: data.name.trim().slice(0, 200),
    address: data.address.trim().slice(0, 500),
  };

  // Validate data types
  if (typeof data.bedrooms !== 'number' || data.bedrooms < 0) {
    throw new ServiceError('Invalid bedrooms count', 'VALIDATION_ERROR');
  }

  return supabase.from('properties').insert(sanitized);
}

// ❌ Never trust client input directly
await supabase.from('properties').insert(userInput); // Dangerous!
```

### File upload validation

```typescript
// ✅ Validate file types and sizes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadPhoto(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new ServiceError('Invalid file type', 'INVALID_FILE_TYPE');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ServiceError('File too large', 'FILE_TOO_LARGE');
  }

  // Additional: Scan file content, not just extension
  // Use Supabase storage with RLS policies
}
```

## API Security

### Environment variables

```typescript
// ✅ Use EXPO_PUBLIC_ prefix ONLY for public variables
// These are embedded in client bundle - assume they're public
EXPO_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ... // Public, RLS-protected

// ❌ NEVER put secrets in EXPO_PUBLIC_ variables
// ❌ EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=... // NEVER!
// ❌ EXPO_PUBLIC_STRIPE_SECRET_KEY=... // NEVER!

// Server-side secrets should be in backend environment only
```

### API rate limiting awareness

```typescript
// Be aware of Supabase rate limits
// - Anon key: Limited requests per second
// - Auth endpoints: Rate limited per IP

// Implement exponential backoff
async function withRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === '429' && i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2 ** i * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

## Secure Data Storage

### Local storage security

```typescript
// ✅ Use secure storage for sensitive data
import * as SecureStore from 'expo-secure-store';

// Tokens, user credentials
await SecureStore.setItemAsync('auth_token', token);

// ❌ Don't use AsyncStorage for sensitive data
// It's not encrypted on Android

// ✅ Clear sensitive data on logout
await SecureStore.deleteItemAsync('auth_token');
```

### Data exposure prevention

```typescript
// ✅ Filter sensitive fields before logging
function sanitizeForLogging(data: any) {
  const { password, token, secret, ...safe } = data;
  return safe;
}

console.log('User data:', sanitizeForLogging(user));

// ❌ Never log sensitive data
console.log('User:', { ...user, password: user.password }); // NEVER!
```

## Cross-Site Scripting (XSS) Prevention

### React Native text rendering

```typescript
// ✅ React Native Text component auto-escapes by default
<Text>{userInput}</Text> // Safe

// ⚠️ Be careful with WebView
<WebView
  source={{ html: userGeneratedHTML }} // Dangerous!
  // Use source={{ uri }} instead when possible
/>

// ✅ Sanitize HTML if needed
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(dirtyHTML);
```

## Dependency Security

### Keep dependencies updated

```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update

# Check for outdated packages
npm outdated
```

### Verify third-party packages

- Check package download counts
- Review package source code for sensitive operations
- Use lock files (package-lock.json) to prevent supply chain attacks
- Prefer well-maintained, popular packages

## Secure Coding Checklist

Before committing code, verify:

- [ ] No hardcoded credentials or API keys
- [ ] Input validation on all user inputs
- [ ] RLS policies tested for all new tables
- [ ] Sensitive data not logged
- [ ] Authentication checks before sensitive operations
- [ ] File uploads validated (type, size, content)
- [ ] Error messages don't leak sensitive info
- [ ] Demo mode clearly indicated and limited
- [ ] Environment variables properly prefixed
- [ ] Dependencies scanned for vulnerabilities

## Common Security Anti-Patterns

### ❌ Avoid these

```typescript
// Client-side authorization only
if (user.role === 'admin') {
  // Delete property - INSECURE! Client can manipulate role
}

// Trusting client-provided IDs without verification
async function deleteProperty(propertyId: string) {
  // No check if user owns this property - INSECURE!
  await supabase.from('properties').delete().eq('id', propertyId);
}

// Exposing internal errors to users
catch (error) {
  alert(error.message); // May leak database structure, file paths
}
```

### ✅ Secure alternatives

```typescript
// Server-side authorization via RLS
// RLS policy ensures user can only delete their properties
async function deleteProperty(propertyId: string) {
  const { error } = await supabase.from('properties').delete().eq('id', propertyId);
  // RLS automatically filters by ownership

  if (error) {
    // Generic error message to user
    throw new ServiceError('Failed to delete property', 'DELETE_FAILED');
    // Detailed error logged server-side only
  }
}
```

## Incident Response

If security issue discovered:

1. Assess impact and affected users
2. Patch vulnerability immediately
3. Force logout all users if auth compromised
4. Rotate exposed credentials
5. Notify affected users if data breach
6. Document incident and prevention measures
