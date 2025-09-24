---
applyTo: '**/*test*'
---

# Testing & Debugging Guidelines

## Common Issues & Solutions

### "Cannot read property of undefined"

**Cause**: Accessing nested properties without checking existence
**Solution**: Use optional chaining

```tsx
// Problem: user.profile.name
// Solution: user?.profile?.name
```

### "Network request failed"

**Cause**: Supabase connection issues
**Solution**: Check environment variables and network

```tsx
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Supabase Key exists:', !!supabase.supabaseKey);
```

### "Invalid hook call"

**Cause**: Using React hooks inside callbacks or conditionals
**Solution**: Only call hooks at component top level

```tsx
// Problem: if (condition) { const [state] = useState(false); }
// Solution: const [state] = useState(false); if (condition) { /* use state */ }
```

### White screen on app start

**Cause**: Navigation or authentication issues
**Solution**: Check AuthGuard logic in _layout.tsx

## Debug Steps for Non-Technical Users

1. Look at error message in terminal - often tells you exactly what's wrong
2. Check if similar working code exists in the project
3. Verify all imports are present at top of files
4. Ensure types match between components (props interfaces)
5. Test with mock data first before connecting to real Supabase

## Error Handling Checklist

- [ ] All async operations wrapped in try/catch
- [ ] User-friendly error messages (no technical jargon)
- [ ] Loading states shown during operations
- [ ] Network errors handled gracefully
- [ ] Fallback UI for error states
- [ ] Console errors logged for debugging
