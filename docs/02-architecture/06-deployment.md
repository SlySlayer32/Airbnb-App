# Deployment View

> How the system is deployed and configured

## Overview

This document describes the deployment architecture, environment configuration, and operational procedures for the Airbnb Cleaning Management Platform.

## Deployment Environments

### Development

**Purpose**: Local development and testing

**Configuration**:
- **Frontend**: Expo Go app (iOS/Android) or web browser
- **Backend**: Supabase cloud (development project)
- **Storage**: Supabase Storage (development bucket)
- **Environment Variables**: `.env.local` file

**Setup**:
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web browser
```

**Environment Variables**:
```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
```

**Features**:
- Hot reloading enabled
- Debug console visible
- Development error messages
- Mock data fallback (if Supabase not configured)

---

### Staging (Planned)

**Purpose**: Pre-production testing

**Configuration**:
- **Frontend**: Expo Preview build
- **Backend**: Supabase cloud (staging project)
- **Storage**: Supabase Storage (staging bucket)
- **Environment Variables**: Staging-specific configuration

**Setup**:
```bash
# Build staging preview
eas build --profile staging --platform ios
eas build --profile staging --platform android

# Deploy to Expo
eas update --branch staging
```

**Features**:
- Production-like environment
- Real Supabase backend
- Limited user access
- Performance monitoring enabled

---

### Production (Planned)

**Purpose**: Live application for end users

**Configuration**:
- **Frontend**: Expo EAS Build (native apps) + Expo Hosting (web)
- **Backend**: Supabase cloud (production project)
- **Storage**: Supabase Storage (production bucket)
- **Environment Variables**: Production configuration
- **CDN**: Expo CDN for static assets

**Setup**:
```bash
# Build production apps
eas build --profile production --platform ios
eas build --profile production --platform android

# Deploy web version
eas build --profile production --platform web

# Publish updates
eas update --branch production
```

**Features**:
- Optimized builds
- Error tracking (Sentry)
- Analytics (Expo Analytics)
- Performance monitoring
- Auto-updates via EAS Update

---

## Infrastructure Components

### 1. Frontend Deployment

**Technology**: Expo Application Services (EAS)

**iOS Deployment**:
- Build service: EAS Build (macOS runners)
- Distribution: TestFlight (internal) → App Store (public)
- Updates: EAS Update (over-the-air updates)
- Code signing: Automatic via EAS

**Android Deployment**:
- Build service: EAS Build (Linux runners)
- Distribution: Internal testing → Google Play Store
- Updates: EAS Update (over-the-air updates)
- Signing: Automatic via EAS

**Web Deployment**:
- Hosting: Expo Hosting (CDN-backed)
- URL: `https://your-app.expo.dev`
- Custom domain: Supported (requires configuration)
- SSL: Automatic via Expo

**Build Profiles**:
```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

---

### 2. Backend Deployment

**Technology**: Supabase Cloud

**Database**:
- **Provider**: Supabase (managed PostgreSQL)
- **Region**: US East (N. Virginia) - default
- **Backups**: Automatic daily backups
- **Scaling**: Vertical scaling (upgrade plan)
- **Monitoring**: Supabase Dashboard

**Authentication**:
- **Provider**: Supabase Auth
- **Methods**: Email/password, OAuth (planned)
- **Session Management**: Automatic
- **Password Reset**: Built-in flow

**Storage**:
- **Provider**: Supabase Storage
- **Buckets**: `cleaning-photos` (public, RLS-enabled)
- **CDN**: Automatic via Supabase
- **Limits**: 1GB on free tier, 100GB on Pro

**Realtime**:
- **Provider**: Supabase Realtime
- **Protocol**: WebSocket
- **Scaling**: Automatic
- **Monitoring**: Supabase Dashboard

**Configuration**:
```typescript
// utils/supabase.ts
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

### 3. Environment Configuration

**Development**:
```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
```

**Staging**:
```bash
# .env.staging
EXPO_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key
```

**Production**:
```bash
# .env.production
EXPO_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
```

**Loading Environment Variables**:
```typescript
// app.config.ts
export default {
  expo: {
    name: "Airbnb Cleaning Management",
    slug: "airbnb-cleaning-app",
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
```

---

## Deployment Process

### Initial Setup

1. **Create Supabase Project**
   ```bash
   # Via Supabase Dashboard
   - Create new project
   - Note project URL and anon key
   - Run database migrations
   - Enable Row Level Security
   - Create storage buckets
   ```

2. **Configure Environment**
   ```bash
   # Create .env.local
   cp .env.example .env.local

   # Add Supabase credentials
   EXPO_PUBLIC_SUPABASE_URL=your-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Development Server**
   ```bash
   npm start
   ```

---

### Production Deployment

1. **Build Production Apps**
   ```bash
   # iOS
   eas build --profile production --platform ios

   # Android
   eas build --profile production --platform android

   # Web
   eas build --profile production --platform web
   ```

2. **Submit to App Stores**
   ```bash
   # iOS - TestFlight
   eas submit --platform ios

   # Android - Google Play
   eas submit --platform android
   ```

3. **Deploy Web Version**
   ```bash
   # Deploy to Expo Hosting
   eas update --branch production
   ```

4. **Configure Custom Domain** (Optional)
   ```bash
   # Add custom domain in Expo Dashboard
   # Configure DNS records
   # SSL certificate auto-provisioned
   ```

---

### Update Deployment

**Over-the-Air Updates**:
```bash
# Publish update
eas update --branch production --message "Bug fixes and improvements"

# Users receive update automatically
# No app store review required
```

**Native Updates** (Requires App Store Review):
```bash
# Build new version
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```

---

## Monitoring and Logging

### Frontend Monitoring

**Expo Analytics**:
- User sessions
- Screen views
- Crash reports
- Performance metrics

**Error Tracking** (Planned):
- Sentry integration
- Error reporting
- Stack traces
- User context

### Backend Monitoring

**Supabase Dashboard**:
- Database performance
- API usage
- Storage usage
- Realtime connections
- Error logs

**Custom Monitoring** (Planned):
- Application metrics
- Business KPIs
- User behavior
- Performance tracking

---

## Scaling Strategy

### Current Capacity

| Resource | Current | Limit | Status |
|----------|---------|-------|--------|
| Users | 0-50 | 1000 | ✅ Healthy |
| Properties | 0-100 | 1000 | ✅ Healthy |
| Cleanings/day | 0-50 | 500 | ✅ Healthy |
| Photos/day | 0-200 | 5000 | ✅ Healthy |
| API Requests/day | 0-1000 | 10000 | ✅ Healthy |

### Scaling Plan

**Phase 1: 0-100 Users** (Current)
- Supabase Free Tier
- Single database instance
- Basic monitoring
- Manual scaling

**Phase 2: 100-500 Users**
- Supabase Pro Tier ($25/month)
- Database optimization
- Automated backups
- Performance monitoring

**Phase 3: 500-2000 Users**
- Supabase Team Tier ($599/month)
- Read replicas
- Advanced monitoring
- Auto-scaling

**Phase 4: 2000+ Users**
- Supabase Enterprise
- Multi-region deployment
- Advanced security
- Dedicated support

---

## Backup and Recovery

### Database Backups

**Automatic Backups**:
- Daily backups (Supabase managed)
- 7-day retention (free tier)
- 30-day retention (Pro tier)

**Manual Backups**:
```bash
# Export database
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql

# Restore database
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

### Storage Backups

**Automatic Backups**:
- Supabase Storage includes automatic backups
- Point-in-time recovery available

**Manual Backups**:
```bash
# Download all photos
supabase storage download cleaning-photos --output ./backup

# Upload to backup storage
# (S3, Google Cloud Storage, etc.)
```

---

## Security

### Frontend Security

**Code Obfuscation**:
- EAS Build includes code obfuscation
- API keys protected via environment variables
- No sensitive data in client code

**Authentication**:
- Secure token storage (Keychain/Keystore)
- Automatic token refresh
- Session timeout after 7 days

### Backend Security

**Database Security**:
- Row Level Security (RLS) enabled
- Role-based access control
- Encrypted connections (SSL/TLS)

**API Security**:
- Rate limiting (Supabase managed)
- CORS configuration
- API key rotation

**Storage Security**:
- Bucket-level permissions
- File-level RLS policies
- Virus scanning (planned)

---

## Disaster Recovery

### Recovery Procedures

**Database Corruption**:
1. Identify corrupted data
2. Restore from most recent backup
3. Verify data integrity
4. Resume operations

**Storage Failure**:
1. Identify missing files
2. Restore from backup
3. Update database references
4. Resume operations

**Service Outage**:
1. Check Supabase status page
2. Notify users of downtime
3. Monitor for resolution
4. Resume operations when available

### Recovery Time Objectives (RTO)

| Scenario | Target RTO | Actual RTO |
|----------|-----------|------------|
| Database corruption | 1 hour | ~30 minutes |
| Storage failure | 2 hours | ~1 hour |
| Service outage | 15 minutes | ~5 minutes |

---

**Last Updated**: January 2025
**Maintenance**: Update as deployment processes evolve

