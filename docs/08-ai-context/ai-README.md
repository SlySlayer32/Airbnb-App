# AI Context Guide

> Quick reference for AI assistants working on this project

## 30-Second Project Overview

**What**: Mobile-first Airbnb property cleaning management platform
**Tech**: React Native + Expo, TypeScript, Supabase
**Users**: Property owners, cleaners, co-hosts
**Core**: 4-hour cleaning window (11 AM - 3 PM), photo proof, real-time updates

## Critical Business Rules (ALWAYS Enforce)

1. **Cleaning Window**: 11 AM - 3 PM only
2. **Cancellation**: 24-hour notice required
3. **Financial Privacy**: Cleaners NEVER see rates/invoices
4. **Photo Proof**: Minimum 3 photos required
5. **Linen Calc**: Auto-calculate based on guest count

## File Structure

```
/app/           → Screens (13 total)
/components/    → UI components (18 total)
/services/      → Business logic (8 total)
/types/         → TypeScript definitions (all in index.ts)
```

## Quick Commands

```bash
npm start       # Start dev server
npm run lint    # Type check
npm test        # Run tests
```

## Common Patterns

**Component**:
```typescript
export default function ComponentName({ prop }: Props) {
  const [loading, setLoading] = useState(false);
  const handleAction = async () => { /* ... */ };
  return <View>{/* JSX */}</View>;
}
```

**Service**:
```typescript
export const serviceName = {
  async getData(): Promise<Type[]> {
    try {
      const { data, error } = await supabase.from('table').select();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[serviceName.getData]', error);
      Alert.alert('Error', 'User-friendly message');
      throw error;
    }
  },
};
```

## Documentation Navigation

- **Start Here**: `docs/README.md`
- **Architecture**: `docs/02-architecture/`
- **Development**: `docs/03-development/`
- **Patterns**: `docs/06-patterns/`
- **Project Status**: `docs/07-project-management/phase-status.md`

## Quality Standards

- ✅ No 'any' types
- ✅ All functions typed
- ✅ Error handling in try/catch
- ✅ Loading/error/empty states
- ✅ Role-based access control
- ✅ Mobile responsive

---

**Last Updated**: January 2025

