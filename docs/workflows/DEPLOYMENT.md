# 🚀 Deployment Guide

> Steps for deploying the Airbnb Cleaning Platform to production

## 📋 Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment](#post-deployment)

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] TypeScript compilation passes: `npm run lint`
- [ ] App runs without errors: `npm start`
- [ ] All features tested manually
- [ ] No console.log or debug statements
- [ ] No hardcoded values (all in env variables)

### Business Rules
- [ ] Cleaning window validation working (11 AM - 3 PM)
- [ ] Cancellation notice calculation correct (24 hours)
- [ ] Financial data hidden from cleaners (RLS enforced)
- [ ] Photo proof requirement enforced
- [ ] Linen calculations accurate

### Security
- [ ] Environment variables not in code
- [ ] Supabase RLS policies enabled
- [ ] Password minimum length enforced (8 characters)
- [ ] No sensitive data in logs
- [ ] HTTPS enforced (Expo handles this)

---

## 🌍 Environment Setup

### Required Environment Variables
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Supabase Production Configuration
1. Create production project in Supabase dashboard
2. Run database migrations
3. Enable RLS policies on all tables
4. Configure storage buckets for photos
5. Set up email templates

---

## 📱 Deployment Steps

### Option 1: Expo EAS (Recommended)

#### Initial Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project
eas build:configure
```

#### Build for iOS
```bash
# Build iOS app
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

#### Build for Android
```bash
# Build Android app
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

---

### Option 2: Expo Go (Testing Only)
```bash
# Publish to Expo Go for testing
npx expo publish
```
**Note**: Not for production - use EAS build

---

### Option 3: Web Deployment (Vercel)

```bash
# Build web version
npx expo export --platform web

# Deploy to Vercel
# Connect GitHub repo to Vercel
# Auto-deploys on push to main
```

---

## 🔍 Post-Deployment

### Monitoring
- [ ] Test app on actual devices (not simulator)
- [ ] Monitor Supabase dashboard for errors
- [ ] Check error logs in Expo dashboard
- [ ] Test with real user accounts
- [ ] Verify all user roles work

### User Communication
- [ ] Notify cleaners app is available
- [ ] Send download links (App Store / Google Play)
- [ ] Provide quick start guide
- [ ] Set up support channel

### Success Metrics
Track these after launch:
- Daily active users (DAU)
- Sessions created per day
- Photo upload success rate
- Average session completion time
- Error rate (< 1% target)

---

## 🚨 Rollback Plan

If critical issues appear:

### Quick Rollback
```bash
# Revert to previous Expo publish
eas update --branch production --message "Rollback to previous version"
```

### Emergency Fix
1. Identify issue
2. Create hotfix branch
3. Fix and test locally
4. Build new version
5. Submit urgent review (if needed)

---

## 📊 Deployment Checklist Template

```markdown
## Deployment - [Date]

### Pre-Deploy
- [ ] All tests passing
- [ ] TypeScript compiles
- [ ] Environment variables set
- [ ] RLS policies verified
- [ ] Business rules tested

### Build
- [ ] iOS build successful
- [ ] Android build successful
- [ ] Web build successful (if applicable)

### Test
- [ ] Installed on test device
- [ ] Login works
- [ ] All features functional
- [ ] No crashes

### Deploy
- [ ] Submitted to App Store
- [ ] Submitted to Google Play
- [ ] Web deployed (if applicable)

### Post-Deploy
- [ ] Users notified
- [ ] Monitoring active
- [ ] Support ready
```

---

**Current Deployment Status**: Development (not yet deployed)  
**Next Steps**: Complete Phase 2, then prepare for production deployment

