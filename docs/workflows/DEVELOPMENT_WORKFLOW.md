# Development Workflow Guide

> Complete guide for developing, testing, and debugging the Airbnb Cleaning Management Platform

## 🚀 Quick Start (First Time Setup)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Expo Go app on your phone (iOS/Android) OR
- iOS Simulator (Mac) / Android Studio (Windows/Mac/Linux)

### Initial Setup
```bash
# 1. Install dependencies
npm install

# 2. Verify configuration
npm run doctor

# 3. Start development server
npm run dev

# 4. Scan QR code with Expo Go app
```

**Expected Result**: App loads within 5 seconds, shows demo mode banner with dashboard visible.

---

## 🔄 Daily Development Workflow

### Starting Your Work Session

1. **Pull latest changes**
   ```bash
   git pull origin main
   npm install  # If package.json changed
   ```

2. **Start dev server with clean cache**
   ```bash
   npm run dev  # Fast start with cache clear
   # OR
   npm run dev:clean  # Full reset if issues
   ```

3. **Open Debug Panel**
   - Look for "DEBUG" button in top-right of app
   - Tap to open debug panel
   - Verify environment shows "Demo Mode: YES"

### During Development

**Hot Reload**: Edit files and save - changes appear automatically within 1-2 seconds

**If hot reload breaks**:
```bash
# Press 'r' in terminal to reload
# OR
# Shake device → "Reload"
# OR
# Stop server (Ctrl+C) and restart with npm run dev
```

---

## 👥 Testing Different User Roles

### Method 1: Debug Panel (Recommended)

1. Tap "DEBUG" button (top-right)
2. Scroll to "Switch Profile (Demo Mode)"
3. Tap role button:
   - **Property Owner** - Manage properties, view financials
   - **Cleaner** - View jobs, track time, upload photos
   - **Co-Host** - Limited property coordination

Profile switches instantly - no reload needed!

### Method 2: Mock Data Files

Edit `data/mockProfiles.ts` to customize profiles:
```typescript
export const MOCK_PROFILES = {
  owner: {
    full_name: 'Your Name Here',
    role: 'property_owner',
    // ... customize fields
  }
};
```

---

## 🧪 Testing Strategy

### Run Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm test:watch

# Generate coverage report
npm test:coverage
```

### Writing Tests

**Component Test Example**:
```typescript
// __tests__/components/MyComponent.test.tsx
import { render } from '@testing-library/react-native';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeDefined();
  });
});
```

**Service Test Example**:
```typescript
// services/__tests__/myService.test.ts
import { myService } from '@/services/myService';

describe('myService', () => {
  it('should fetch data', async () => {
    const result = await myService.getData();
    expect(result).toBeDefined();
  });
});
```

---

## 🐛 Debugging Tips

### Visual Debugging

1. **Debug Panel** - Always start here
   - Shows auth state, environment, current route
   - Real-time updates
   - Profile switcher

2. **React DevTools** (Optional)
   ```bash
   # Install globally
   npm install -g react-devtools

   # Run in separate terminal
   react-devtools

   # App will auto-connect in dev mode
   ```

### Console Debugging

**IMPORTANT**: Never commit `console.log` statements!

Use `__DEV__` guard for debugging:
```typescript
if (__DEV__) {
  console.log('[MyComponent] Debug info:', data);
}
```

### Common Issues

| Issue | Solution |
|-------|----------|
| White screen on load | Check Debug Panel - is Demo Mode active? |
| "Cannot connect to Metro" | Ensure dev server running (`npm run dev`) |
| Hot reload stopped | Press 'r' in terminal or shake device → Reload |
| TypeScript errors | Run `npm run type-check` to see all errors |
| App won't start | Try `npm run dev:clean` for full reset |

---

## 🗄️ Working with Supabase

### Demo Mode (Default)
- No Supabase connection required
- Uses mock data from `data/mockProfiles.ts`
- Perfect for UI development and testing
- Shows demo banner at top

### Connecting Real Supabase

1. **Get credentials** from Supabase dashboard
2. **Update `.env.local`**:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. **Restart dev server**:
   ```bash
   npm run dev
   ```
4. **Verify**: Demo mode banner should disappear

### Switching Back to Demo Mode
```bash
# Comment out lines in .env.local
# EXPO_PUBLIC_SUPABASE_URL=...
# EXPO_PUBLIC_SUPABASE_ANON_KEY=...

# Restart
npm run dev
```

---

## 📱 Platform-Specific Testing

### iOS Simulator (Mac Only)
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Web Browser
```bash
npm run web
# Opens at http://localhost:8081
```

### Physical Device
1. Install Expo Go from App Store / Play Store
2. Scan QR code from terminal
3. App loads directly on device

---

## 🎨 UI Development Best Practices

### Design System
Always use project design tokens:
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',  // colors.background
    padding: 16,                  // spacing.lg
    borderRadius: 12,             // borderRadius.large
  }
});
```

### Component Checklist
Every new component must have:
- [ ] TypeScript interfaces for all props
- [ ] Loading state (if async data)
- [ ] Error state (if can fail)
- [ ] Empty state (if can have no data)
- [ ] Mobile responsive (test on small screens)
- [ ] No console.log statements
- [ ] Proper error handling in try/catch

### Testing Your UI
1. Test on smallest device first (iPhone SE)
2. Switch between roles using Debug Panel
3. Test with no data (empty states)
4. Test with lots of data (scrolling)
5. Test error scenarios (network fails)

---

## 🚢 Pre-Commit Checklist

Before committing code:

```bash
# 1. Type check passes
npm run type-check

# 2. Tests pass
npm test

# 3. No console.log statements
# Search: grep -r "console.log" components/ services/ app/

# 4. Code follows patterns
# Review: Does it match existing component/service patterns?

# 5. Business rules enforced
# Check: docs/core/BUSINESS_RULES.md
```

---

## 🔧 Performance Tips

### Optimizing Build Times
```bash
# Clear all caches if build is slow
npm run dev:clean

# Check for heavy dependencies
npx expo-doctor
```

### Optimizing Hot Reload
- Keep components small and focused
- Use React.memo() for expensive components
- Avoid large inline objects/arrays in props

### Memory Management
- Unsubscribe from event listeners in useEffect cleanup
- Clear timeouts/intervals in cleanup
- Don't store large data in component state

---

## 📚 Additional Resources

### Project Documentation
- **Start Here**: `docs/AI-README.md`
- **Business Rules**: `docs/core/BUSINESS_RULES.md`
- **Component List**: `docs/manifests/COMPONENTS.md`
- **API Patterns**: `docs/reference/API_PATTERNS.md`
- **Troubleshooting**: `docs/reference/TROUBLESHOOTING.md`

### External Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🆘 Getting Help

### Self-Help Checklist
1. Check Debug Panel for environment issues
2. Read error message carefully
3. Check `docs/reference/TROUBLESHOOTING.md`
4. Search project docs for similar code
5. Check if tests reveal the issue

### Still Stuck?
1. Document exact steps to reproduce
2. Note what you've tried already
3. Include Debug Panel screenshot
4. Share relevant code snippet
5. Ask for help with context

---

## ✅ Success Metrics

You're in a good development flow when:
- ✅ App loads in < 5 seconds every time
- ✅ Hot reload works consistently
- ✅ Can switch roles instantly via Debug Panel
- ✅ Tests pass on every commit
- ✅ Type checking passes
- ✅ No console errors in normal operation
- ✅ Features work for all user roles

---

**Last Updated**: January 2025
**Maintained By**: Development Team
**Next Review**: As needed based on workflow issues


