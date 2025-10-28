---
applyTo: '{eas.json,app.json,package.json,.github/workflows/**}'
description: 'Build process, deployment checklist, and release guidelines'
---

# Deployment & Release Guidelines

## Build Environments

### Development

- Local development server
- Hot reload enabled
- Demo mode fallbacks
- Verbose logging
- React DevTools accessible

### Staging/Preview

- EAS Preview builds
- Production-like environment
- Test data only
- Error tracking enabled
- Analytics in test mode

### Production

- EAS Production builds
- Real data
- Error tracking (Sentry, etc.)
- Analytics enabled
- Performance monitoring

## Environment Variables

### Required for all environments

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Production-specific

```bash
# Error tracking
EXPO_PUBLIC_SENTRY_DSN=https://...

# Analytics
EXPO_PUBLIC_ANALYTICS_ID=...

# Push notifications
EXPO_PUBLIC_ONESIGNAL_APP_ID=...
```

### Secret management

```bash
# Store secrets in EAS
eas secret:create --scope project --name SUPABASE_SERVICE_ROLE_KEY --value "your-key"

# List secrets
eas secret:list

# Reference in eas.json
{
  "build": {
    "production": {
      "env": {
        "SUPABASE_SERVICE_ROLE_KEY": "$(SUPABASE_SERVICE_ROLE_KEY)"
      }
    }
  }
}
```

## EAS Build Configuration

### eas.json structure

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "ios": {
        "bundleIdentifier": "com.yourcompany.airbnbapp"
      },
      "android": {
        "buildType": "app-bundle",
        "applicationId": "com.yourcompany.airbnbapp"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

## Build Commands

### iOS builds

```bash
# Development build (for testing)
eas build --profile development --platform ios

# Preview build (internal testing)
eas build --profile preview --platform ios

# Production build (App Store)
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android builds

```bash
# Development build
eas build --profile development --platform android

# Preview build (APK for internal testing)
eas build --profile preview --platform android

# Production build (AAB for Play Store)
eas build --profile production --platform android

# Submit to Play Store
eas submit --platform android
```

### Web deployment

```bash
# Build for web
npx expo export --platform web

# Output in dist/
# Deploy to hosting provider:
# - Vercel: vercel deploy dist/
# - Netlify: netlify deploy --dir=dist
# - Firebase: firebase deploy --only hosting
```

## Pre-Deployment Checklist

### Code quality

- [ ] All tests passing (`npm test`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Linter passes (`npm run lint`)
- [ ] No console.log statements in production code
- [ ] No commented-out code
- [ ] No TODO comments for critical functionality

### Functionality

- [ ] All features working as expected
- [ ] No known critical bugs
- [ ] Error boundaries in place
- [ ] Loading states implemented
- [ ] Empty states handled
- [ ] Edge cases tested

### Security

- [ ] No hardcoded secrets or API keys
- [ ] Environment variables properly set
- [ ] Authentication working
- [ ] Authorization rules tested
- [ ] RLS policies verified
- [ ] Input validation in place
- [ ] Dependencies scanned (`npm audit`)

### Performance

- [ ] App loads in under 3 seconds
- [ ] No memory leaks
- [ ] Images optimized
- [ ] Large lists use FlatList
- [ ] Bundle size acceptable (<2MB initial)
- [ ] Lazy loading implemented where needed

### Platform-specific

- [ ] Tested on iOS (physical device + simulator)
- [ ] Tested on Android (physical device + emulator)
- [ ] Tested on web (Chrome, Safari, Firefox)
- [ ] Safe area handled correctly
- [ ] Permissions configured (Info.plist, AndroidManifest)
- [ ] App icons all sizes
- [ ] Splash screens configured

### User experience

- [ ] Onboarding flow tested
- [ ] Navigation flows work
- [ ] Forms validate properly
- [ ] Error messages user-friendly
- [ ] Success confirmations shown
- [ ] Offline behavior handled
- [ ] Accessibility tested

### Documentation

- [ ] README updated
- [ ] CHANGELOG updated
- [ ] API documentation current
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)

## Version Bumping

### Semantic versioning

```
MAJOR.MINOR.PATCH
2.1.3
│ │ └─ Patch: Bug fixes
│ └─── Minor: New features (backwards compatible)
└───── Major: Breaking changes
```

### Update version

```json
// app.json
{
  "expo": {
    "version": "2.1.3",
    "ios": {
      "buildNumber": "23" // Increment for each build
    },
    "android": {
      "versionCode": 23 // Increment for each build
    }
  }
}
```

### Create release

```bash
# Tag release
git tag -a v2.1.3 -m "Release version 2.1.3"
git push origin v2.1.3

# Update CHANGELOG.md
# - New features
# - Bug fixes
# - Breaking changes
# - Migration guide
```

## Release Process

### 1. Prepare release branch

```bash
git checkout main
git pull origin main
git checkout -b release/v2.1.3
```

### 2. Update version and changelog

```bash
# Update app.json version
# Update CHANGELOG.md
git add app.json CHANGELOG.md
git commit -m "chore: bump version to 2.1.3"
```

### 3. Final testing

```bash
# Run all tests
npm test

# Manual testing on all platforms
# iOS, Android, Web
```

### 4. Create builds

```bash
# iOS production build
eas build --profile production --platform ios

# Android production build
eas build --profile production --platform android

# Web production build
npx expo export --platform web
```

### 5. Submit for review

```bash
# iOS App Store
eas submit --platform ios

# Android Play Store
eas submit --platform android

# Web deployment
# Deploy dist/ to hosting
```

### 6. Merge and tag

```bash
# Create PR to main
# After approval and merge:
git tag -a v2.1.3 -m "Release v2.1.3"
git push origin v2.1.3
```

### 7. Monitor deployment

- Watch app store review status
- Monitor error tracking (Sentry)
- Check analytics for crashes
- Monitor user feedback
- Be ready for hotfix if needed

## Rollback Strategy

### If critical bug discovered post-release

**Option 1: Hotfix**

```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug

# Fix and test
git commit -m "fix: critical bug in payment flow"

# Build and submit expedited
eas build --profile production --platform all
eas submit --platform all

# Merge back to main
```

**Option 2: Revert to previous version**

```bash
# Remove current app version from stores
# Re-submit previous working version

# Communicate to users
# Fix bug in next release
```

## CI/CD Automation

### GitHub Actions example

```yaml
# .github/workflows/build.yml
name: EAS Build
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - run: npm ci
      - run: npm test
      - run: npm run type-check

      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive

      - name: Build Android
        run: eas build --platform android --profile production --non-interactive

      - name: Submit to stores
        run: eas submit --platform all --non-interactive
```

## Monitoring Post-Deployment

### Metrics to watch

- Crash rate (target: <1%)
- App load time (target: <3s)
- API response times
- User retention (Day 1, Day 7, Day 30)
- Feature adoption rates
- Error rates by screen

### Tools

- Sentry for error tracking
- Analytics (Firebase, Amplitude, etc.)
- App Store Connect (iOS metrics)
- Google Play Console (Android metrics)
- Performance monitoring

### Alerts to set up

- Crash rate > 2%
- API errors > 5%
- Load time > 5s
- Critical user flow failures

## Hotfix Procedures

### When to hotfix

- Critical crashes affecting >10% users
- Security vulnerabilities
- Data loss bugs
- Payment/transaction issues
- Complete feature failures

### Hotfix workflow

```bash
# 1. Create hotfix branch from production tag
git checkout v2.1.3
git checkout -b hotfix/v2.1.4

# 2. Fix issue
# Make minimal changes only

# 3. Test thoroughly
npm test
# Manual testing

# 4. Bump patch version
# Update app.json: 2.1.3 -> 2.1.4

# 5. Build and submit
eas build --profile production --platform all
eas submit --platform all

# 6. Merge to main
git checkout main
git merge hotfix/v2.1.4
git tag -a v2.1.4 -m "Hotfix: Critical crash fix"
git push origin main --tags

# 7. Monitor deployment
```

## Release Notes Template

```markdown
# Version 2.1.3 (2025-10-28)

## 🎉 New Features

- Added property search filters
- Implemented photo proof requirements for session completion
- Added break tracking for cleaning sessions

## 🐛 Bug Fixes

- Fixed navigation crash on Android back button
- Resolved timer display issue during breaks
- Fixed property card layout on small screens

## 🔧 Improvements

- Improved session start performance
- Enhanced error messages for failed uploads
- Optimized property list rendering

## 🔒 Security

- Updated dependencies to patch vulnerabilities
- Enhanced input validation for property creation

## ⚠️ Breaking Changes

None

## 📝 Migration Guide

No migration required for this release.

## 🙏 Contributors

Thank you to all contributors!
```

## App Store Guidelines

### iOS App Store

- Review time: 1-3 days
- Follow Apple Human Interface Guidelines
- Privacy policy required
- Age rating accurate
- Screenshots required (multiple sizes)
- App preview video (optional)

### Google Play Store

- Review time: Hours to 1 day (usually faster)
- Follow Material Design guidelines
- Privacy policy required
- Content rating
- Screenshots required
- Feature graphic required

## Beta Testing

### iOS TestFlight

```bash
# Build for TestFlight
eas build --profile preview --platform ios

# Submit to TestFlight
eas submit --platform ios
```

### Android Internal Testing

```bash
# Build for internal testing
eas build --profile preview --platform android

# Upload to Play Console internal testing track
```

### External beta testers

- Collect feedback
- Monitor crash reports
- Fix critical issues before public release
- Iterate based on feedback
