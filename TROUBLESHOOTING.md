# Troubleshooting Guide

## Issue: Expo Welcome Screen Instead of App

### Problem
After merging multiple GitHub issues and changes, the app was showing the default Expo welcome screen instead of the custom dashboard.

### Root Causes Identified
1. **Babel Configuration Mismatch**: `babel.config.js` was configured to load `.env` but the actual file was `.env.local`
2. **Invalid Supabase Credentials**: The anon key format was incorrect (started with `sb_publishable_` instead of `eyJ`)
3. **Cache Issues**: Stale Metro bundler cache from previous builds

### Solutions Applied

#### 1. Fixed Babel Configuration
Updated `babel.config.js` to properly load `.env.local`:
```javascript
[
  'module:react-native-dotenv',
  {
    moduleName: '@env',
    path: '.env.local',
    safe: false,
    allowUndefined: true,
  },
],
```

#### 2. Updated Environment Variables
Set placeholder values in `.env.local` to enable demo mode:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://placeholder-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key
```

**Note**: To use real Supabase:
1. Go to https://supabase.com/dashboard/project/_/settings/api
2. Copy your Project URL and anon/public key (should start with "eyJ")
3. Replace the placeholder values in `.env.local`

#### 3. Clean Build Process
```powershell
# Remove old dependencies and cache
Remove-Item -Recurse -Force node_modules, package-lock.json

# Reinstall dependencies
npm install

# Start with cleared cache
npx expo start --clear
```

## How to Test

### Option 1: Web (Fastest for testing)
Press `w` in the terminal or navigate to http://localhost:8081

### Option 2: Android Device/Emulator
1. Make sure Android emulator is running or device is connected
2. Press `a` in the terminal

### Option 3: iOS Simulator (Mac only)
1. Make sure iOS simulator is open
2. Press `i` in the terminal

### Option 4: Expo Go App
1. Install Expo Go on your mobile device
2. Scan the QR code shown in the terminal

## Expected Behavior

### Demo Mode (Current Configuration)
- App should load directly to the Dashboard
- You'll see a yellow banner: "🚀 Demo Mode - Configure Supabase to enable full functionality"
- All features work with mock data
- No authentication required

### Production Mode (With Valid Supabase)
- App redirects to login screen
- User authentication required
- Real data from Supabase database

## Common Issues

### Still Seeing Welcome Screen?
1. **Clear Expo cache**: Press `r` in the terminal to reload
2. **Hard refresh**: Stop server (Ctrl+C) and restart with `npx expo start --clear`
3. **Check terminal for errors**: Look for red error messages in the Metro bundler output

### "Module not found" errors?
```powershell
npm install
npx expo start --clear
```

### App crashes on startup?
1. Check the Metro bundler logs for errors
2. Ensure all dependencies are installed: `npm install`
3. Clear watchman cache (if on Mac/Linux): `watchman watch-del-all`

### Environment variables not loading?
1. Verify `.env.local` exists in the project root
2. Restart Metro bundler completely
3. Check `babel.config.js` has correct path configuration

## Quick Commands

```powershell
# Clean restart (recommended after merges)
Remove-Item -Recurse -Force node_modules, package-lock.json; npm install; npx expo start --clear

# Just clear cache and restart
npx expo start --clear

# Type check
npx tsc --noEmit

# Lint check
npx eslint .
```

## Development Workflow After Merging Changes

1. **Always pull latest**: `git pull origin main`
2. **Update dependencies**: `npm install`
3. **Clear cache**: `npx expo start --clear`
4. **Test thoroughly**: Check all major features work
5. **Run checks**: `npx tsc --noEmit` and `npx eslint .`

## Getting Help

If issues persist:
1. Check Metro bundler logs for specific error messages
2. Review recent merged PRs for breaking changes
3. Compare `package.json` with backup to see dependency changes
4. Check GitHub Issues for similar problems reported by others
