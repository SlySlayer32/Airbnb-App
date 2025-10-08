# 🔧 Troubleshooting Guide

> Common issues and solutions for development problems

## 📋 Table of Contents
- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [Supabase Issues](#supabase-issues)
- [UI Issues](#ui-issues)
- [Git Issues](#git-issues)
- [Environment Issues](#environment-issues)

---

## 🏗️ Build Errors

### Error: "Cannot find module '@/components/...'"

**Cause**: Import path resolution not working

**Solution**:
```bash
# 1. Check tsconfig.json has path aliases
# Should have:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 2. Restart dev server
# Press Ctrl+C to stop
npm start
```

---

### Error: "TypeScript compilation failed"

**Cause**: Type errors in code

**Solution**:
```bash
# 1. Run type checker to see all errors
npm run lint

# 2. Fix each error shown
# Common fixes:
# - Add missing props to components
# - Fix type mismatches (string vs number)
# - Add proper interfaces for data

# 3. Verify fix worked
npm run lint
```

**Common Type Errors**:

```typescript
// Error: Property 'name' does not exist on type 'unknown'
// Fix: Add proper type
const data: PropertyType = await fetchData();

// Error: Type 'string | undefined' is not assignable to type 'string'
// Fix: Use optional chaining or default value
const name = user?.name ?? 'Unknown';

// Error: Argument of type 'number' is not assignable to parameter of type 'string'
// Fix: Convert type
const id = String(numericId);
```

---

### Error: "Package not found" after npm install

**Cause**: Corrupted node_modules or cache

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Expo cache
rm -rf .expo
npm start -- --clear
```

---

## ⚡ Runtime Errors

### Error: "Cannot read property 'X' of undefined"

**Cause**: Accessing nested property before data loads

**Bad Code**:
```typescript
const name = user.profile.name; // Crashes if user or profile is undefined
```

**Solution**:
```typescript
// Use optional chaining
const name = user?.profile?.name;

// Or with default value
const name = user?.profile?.name ?? 'Unknown';

// Or check first
if (user && user.profile) {
  const name = user.profile.name;
}
```

---

### Error: "Invalid hook call"

**Cause**: Using React hooks in wrong place

**Bad Code**:
```typescript
function Component() {
  if (condition) {
    const [state, setState] = useState(false); // ❌ Wrong
  }
  
  const handleClick = () => {
    const [state, setState] = useState(false); // ❌ Wrong
  };
}
```

**Solution**:
```typescript
function Component() {
  // ✅ Always at top level
  const [state, setState] = useState(false);
  
  if (condition) {
    // Use state here
  }
  
  const handleClick = () => {
    // Use setState here
    setState(true);
  };
}
```

---

### Error: "Network request failed"

**Cause**: Can't connect to Supabase

**Solution**:
```typescript
// 1. Check environment variables are set
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Key exists:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

// 2. Verify .env file exists in root
// Should contain:
// EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
// EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

// 3. Restart dev server after changing .env
# Ctrl+C
npm start
```

---

### Error: White Screen on App Start

**Cause**: Navigation or auth guard issue

**Solution**:
```bash
# 1. Check console for errors
# Open: http://localhost:19006 (web)
# Or check terminal for React Native logs

# 2. Common causes:
# - AuthContext not providing user
# - Infinite redirect loop
# - Missing screen in navigation

# 3. Check _layout.tsx AuthGuard
# Look for redirect logic
```

**Debug AuthGuard**:
```typescript
// In app/_layout.tsx, add logging
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  
  console.log('AuthGuard:', { user: !!user, profile: !!profile, loading });
  
  // ... rest of component
}
```

---

### Error: "Maximum update depth exceeded"

**Cause**: Infinite re-render loop

**Bad Code**:
```typescript
function Component() {
  const [count, setCount] = useState(0);
  
  // ❌ Sets state during render, causes infinite loop
  setCount(count + 1);
  
  return <View />;
}
```

**Solution**:
```typescript
function Component() {
  const [count, setCount] = useState(0);
  
  // ✅ Set state in event handler or useEffect
  useEffect(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <View />;
}
```

---

## 🗄️ Supabase Issues

### Issue: "Row Level Security policy violation"

**Cause**: User doesn't have permission to access data

**Solution**:
```typescript
// 1. Check user is authenticated
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// 2. Check user has correct role
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();
console.log('User role:', profile?.role);

// 3. Verify RLS policy allows this role
// Check Supabase dashboard > Authentication > Policies
```

---

### Issue: "No rows returned" when expecting data

**Cause**: Query filters too restrictive or data doesn't exist

**Debug**:
```typescript
// 1. Remove filters to see all data
const { data, error } = await supabase
  .from('table_name')
  .select('*');
console.log('All data:', data);

// 2. Add filters one by one
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', userId); // Add this
console.log('Filtered data:', data);

// 3. Check if data exists in Supabase dashboard
```

---

### Issue: "Realtime subscription not working"

**Cause**: Channel not subscribing or RLS blocking updates

**Solution**:
```typescript
// 1. Check subscription status
const channel = supabase
  .channel('test')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'table_name' },
    (payload) => {
      console.log('Realtime update:', payload);
    }
  )
  .subscribe((status) => {
    console.log('Subscription status:', status);
  });

// 2. Verify RLS allows SELECT for your user
// 3. Check table is not too large (realtime has limits)
```

---

### Issue: "Storage upload failed"

**Cause**: Bucket permissions or file size

**Solution**:
```typescript
// 1. Check bucket exists and is public
// Supabase dashboard > Storage > Bucket settings

// 2. Check file size (max 50MB by default)
console.log('File size:', imageFile.size / 1024 / 1024, 'MB');

// 3. Check file path format
// Should be: bucket-name/folder/filename.ext
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('folder/file.jpg', file, {
    cacheControl: '3600',
    upsert: false
  });

console.log('Upload error:', error);
```

---

## 🎨 UI Issues

### Issue: "Component not rendering"

**Causes and Solutions**:

**1. Conditional Rendering**
```typescript
// Component won't show if condition is false
{loading && <Component />} // Only shows when loading is true

// Check your conditions
console.log('Should render?', !loading && data.length > 0);
```

**2. Zero Height/Width**
```typescript
// Add border to see if component exists but has no size
<View style={{ borderWidth: 1, borderColor: 'red' }}>
  <Component />
</View>
```

**3. Positioned Off-Screen**
```typescript
// Check for absolute positioning
style={{ position: 'absolute', top: -1000 }} // Off screen!
```

---

### Issue: "Styling not applying"

**Solutions**:

**1. Check StyleSheet syntax**
```typescript
// ❌ Wrong - inline object
<View style={{ backgroundColor: 'red' }}>

// ✅ Right - StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
  },
});
<View style={styles.container}>
```

**2. Check style precedence**
```typescript
// Later styles override earlier ones
<View style={[styles.base, styles.override, { margin: 10 }]} />
```

**3. Platform-specific styles**
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 10,
  },
});
```

---

### Issue: "FlatList not scrolling"

**Cause**: Parent container doesn't have flex: 1

**Solution**:
```typescript
// ❌ Wrong
<View>
  <FlatList data={items} renderItem={...} />
</View>

// ✅ Right
<View style={{ flex: 1 }}>
  <FlatList data={items} renderItem={...} />
</View>
```

---

### Issue: "TouchableOpacity not responding"

**Causes**:

**1. Disabled state**
```typescript
<TouchableOpacity disabled={loading} onPress={handlePress}>
// Check: Is loading always true?
```

**2. Overlapping elements**
```typescript
// Another element is on top, blocking touches
// Check z-index and position: 'absolute'
```

**3. Size too small**
```typescript
// Minimum touch target should be 44x44
<TouchableOpacity style={{ width: 44, height: 44 }}>
```

---

## 🔀 Git Issues

### Issue: "Merge conflict"

**Solution**:
```bash
# 1. Git marks conflicts in files:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch

# 2. Edit file to keep what you want:
Your changes  # Kept this part
Their changes # Kept this part too

# 3. Remove conflict markers
# 4. Save file
# 5. Mark as resolved
git add conflicted-file.txt
git commit -m "Resolved merge conflict"
```

---

### Issue: "Need to pull but have local changes"

**Solution**:
```bash
# Option 1: Stash (temporary save)
git stash
git pull origin main
git stash pop

# Option 2: Commit first
git add .
git commit -m "WIP: Work in progress"
git pull origin main
```

---

### Issue: ".gitignore not working"

**Cause**: Files already tracked by Git

**Solution**:
```bash
# Remove from tracking (keeps local file)
git rm --cached filename
# Or entire directory
git rm -r --cached directory/

# Commit the removal
git add .
git commit -m "Remove ignored files from tracking"
```

---

## 🌍 Environment Issues

### Issue: "Environment variables not loading"

**Solution**:
```bash
# 1. Check .env file exists in root
ls -la .env

# 2. Check file format (no spaces around =)
# ❌ Wrong
SUPABASE_URL = https://...

# ✅ Right
EXPO_PUBLIC_SUPABASE_URL=https://...

# 3. Prefix with EXPO_PUBLIC_ for client access
# ❌ Wrong
SUPABASE_URL=https://...

# ✅ Right
EXPO_PUBLIC_SUPABASE_URL=https://...

# 4. Restart dev server after changes
# Ctrl+C
npm start
```

---

### Issue: "Module not found after install"

**Solution**:
```bash
# 1. Verify package is in package.json
cat package.json | grep package-name

# 2. Clear cache and reinstall
rm -rf node_modules
npm install

# 3. Clear Expo cache
npm start -- --clear

# 4. If still failing, check import path
# ❌ Wrong
import { Something } from 'wrong-package-name';

# ✅ Right (check package documentation)
import { Something } from '@correct/package-name';
```

---

## 🐛 Debugging Techniques

### Use Console Logging Effectively

```typescript
// ❌ Not helpful
console.log(data);

// ✅ Better - with context
console.log('[ComponentName] Data loaded:', data);

// ✅ Even better - with timestamp
console.log('[ComponentName]', new Date().toISOString(), 'Data loaded:', data);

// ✅ Check type and structure
console.log('Type:', typeof data);
console.log('Is array?', Array.isArray(data));
console.log('Keys:', Object.keys(data));
```

---

### Use React DevTools

```bash
# Install React DevTools (browser extension)
# Chrome: https://chrome.google.com/webstore
# Search "React Developer Tools"

# Use in web mode
npm start
# Press 'w' for web
# Open Chrome DevTools > React tab
```

---

### Test Incrementally

```typescript
// Don't write everything at once
// Test small pieces:

// Step 1: Test data loading
useEffect(() => {
  console.log('Component mounted');
  loadData();
}, []);

// Step 2: Test state update
const loadData = async () => {
  const data = await service.getData();
  console.log('Data received:', data);
  setData(data);
  console.log('State updated');
};

// Step 3: Test rendering
console.log('Rendering with:', data.length, 'items');
```

---

## ✅ When to Ask for Help

Ask for help when:
- [ ] Error message doesn't make sense
- [ ] Tried solutions from this guide without success
- [ ] Issue blocks critical functionality
- [ ] Similar code works elsewhere but not here
- [ ] Security or data loss concern

**How to Ask**:
1. **Describe what you tried to do**
2. **Show exact error message**
3. **List what you already tried**
4. **Share relevant code snippets**
5. **Mention which file the error is in**

**Example Good Question**:
> "I'm trying to load cleaner properties in app/properties.tsx. The screen shows loading forever and console says 'Cannot read property id of undefined'. I checked that the user is logged in and has cleaner role. The getPropertiesForCleaner service method works in other screens. Here's the code: [paste code]"

---

**Last Updated**: January 2025  
**Maintenance**: Add new issues as they are discovered and solved
