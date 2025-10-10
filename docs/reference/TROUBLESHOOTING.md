# 🔧 Troubleshooting Guide

> Common issues and solutions for development problems

## 📋 Table of Contents
- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [Supabase Issues](#supabase-issues)
- [UI Issues](#ui-issues)
- [Git Issues](#git-issues)

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
npm start -- --clear
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

---

## ⚡ Runtime Errors

### Error: "Cannot read property 'X' of undefined"

**Cause**: Accessing nested property before data loads

**Solution**:
```typescript
// ❌ Bad
const name = user.profile.name; // Crashes if user or profile is undefined

// ✅ Good - Use optional chaining
const name = user?.profile?.name;

// ✅ Good - With default value
const name = user?.profile?.name ?? 'Unknown';

// ✅ Good - Check first
if (user && user.profile) {
  const name = user.profile.name;
}
```

---

### Error: "Invalid hook call"

**Cause**: Using React hooks in wrong place

**Solution**:
```typescript
// ✅ Always at top level
function Component() {
  const [state, setState] = useState(false);
  
  if (condition) {
    // Use state here
  }
  
  const handleClick = () => {
    setState(true); // Use setState here
  };
}
```

---

### Error: "Network request failed"

**Cause**: Can't connect to Supabase

**Solution**:
```bash
# 1. Check .env file exists in root
# Should contain:
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# 2. Restart dev server after changing .env
npm start -- --clear
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

### Issue: "Realtime subscription not working"

**Cause**: Channel not subscribing or RLS blocking updates

**Solution**:
```typescript
// Check subscription status
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
```

---

## 🎨 UI Issues

### Issue: "Component not rendering"

**Solutions**:

**1. Check conditional rendering**
```typescript
{loading && <Component />} // Only shows when loading is true
console.log('Should render?', !loading && data.length > 0);
```

**2. Check for zero height/width**
```typescript
// Add border to see if component exists
<View style={{ borderWidth: 1, borderColor: 'red' }}>
  <Component />
</View>
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

# 2. Edit file to keep what you want
# 3. Remove conflict markers (<<<, ===, >>>)
# 4. Save file
# 5. Mark as resolved
git add conflicted-file.txt
git commit -m "Resolved merge conflict"
```

---

### Issue: ".gitignore not working"

**Solution**:
```bash
# Remove from tracking (keeps local file)
git rm --cached filename

# Commit the removal
git add .
git commit -m "Remove ignored files from tracking"
```

---

**Last Updated**: January 2025  
**Maintenance**: Add new issues as discovered

