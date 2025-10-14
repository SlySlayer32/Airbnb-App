# Troubleshooting Guide

> Common issues and solutions

## Metro Bundler Issues

### "Cannot find module"
```bash
npm start -- --clear
```

### "Metro bundler is not running"
```bash
# Kill all node processes
killall node

# Restart Metro
npm start
```

## TypeScript Errors

### "Cannot find module '@/components/...'"
```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### "Property does not exist on type"
```bash
# Check types/index.ts for correct interface
# Ensure all fields are defined
```

## Supabase Connection

### "Invalid API key"
```bash
# Check .env.local file exists
# Verify EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
# Restart Metro bundler
```

### "Network request failed"
```bash
# Check internet connection
# Verify Supabase project is active
# Check Supabase status page
```

## Navigation Issues

### "Cannot read property 'navigate' of undefined"
```bash
# Ensure component is inside _layout.tsx
# Use useRouter from expo-router
```

### Screen not found
```bash
# Check file name matches route
# app/properties.tsx → /properties ✓
```

## Build Issues

### iOS build fails
```bash
cd ios
pod install
cd ..
npm start
```

### Android build fails
```bash
# Clean build
cd android
./gradlew clean
cd ..
npm start
```

## Performance Issues

### Slow app performance
```bash
# Use FlatList for long lists
# Debounce search inputs
# Optimize images
```

### Memory leaks
```bash
# Clean up subscriptions in useEffect
# Unsubscribe from realtime channels
```

## Common Solutions

### Nuclear Option
```bash
# Complete clean and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm start -- --clear
```

---

**Last Updated**: January 2025

