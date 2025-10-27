# Quick Start Guide - Nx Monorepo

Your Expo app is now in an Nx monorepo! Here's how to work with it.

---

## 🚀 Running the App

### Start Development Server

```bash
# Using Nx
nx start mobile

# Or the Expo way (still works)
cd apps/mobile && npx expo start
```

### Platform-Specific

```bash
# iOS
nx run-ios mobile

# Android
nx run-android mobile

# Web
nx start mobile --web
```

---

## �� Where Everything Is

| Old Location        | New Location                                       | Import As                  |
| ------------------- | -------------------------------------------------- | -------------------------- |
| `app/` (routes)     | `apps/mobile/app/`                                 | Same relative imports      |
| `assets/`           | `apps/mobile/assets/`                              | Same relative imports      |
| `components/`       | Still in root (migrate to `libs/ui/components`)    | `@/components/...` (works) |
| `types/`            | Still in root (migrate to `libs/core/models`)      | `@/types/...` (works)      |
| `utils/supabase.ts` | Still in root (migrate to `libs/data-access/api`)  | `@/utils/supabase` (works) |
| `contexts/`         | Still in root (migrate to `libs/data-access/auth`) | `@/contexts/...` (works)   |
| `services/`         | Still in root (migrate to `libs/data-access/api`)  | `@/services/...` (works)   |

**Your existing `@/` imports still work!** We kept backwards compatibility.

---

## 🎯 Available Nx Commands

### Development

```bash
nx start mobile          # Start dev server
nx serve mobile          # Alias for start
nx lint mobile           # Run linter
nx test mobile           # Run tests
```

### Building

```bash
nx build mobile          # Build for production
nx export mobile         # Export static web build
```

### Utilities

```bash
nx graph                 # Visualize project dependencies
nx show project mobile   # Show mobile project details
nx affected:test         # Test only affected projects
nx reset                 # Clear Nx cache
```

---

## 🆕 Using New Libraries

### Import from New Libraries

```typescript
// Core types (when migrated)
import { Property, User } from '@airbnb/core-models';
// Core utils (when migrated)
import { formatDate } from '@airbnb/core-utils';
// Data access (when migrated)
import { supabase } from '@airbnb/data-access-api';
import { useAuth } from '@airbnb/data-access-auth';
// UI components (when migrated)
import { Button } from '@airbnb/ui-components';
```

### Old Paths Still Work

```typescript
// These still work during migration
import { Button } from '@/components/Button';
import { User } from '@/types';
import { supabase } from '@/utils/supabase';
```

---

## 🔧 Development Tips

### Metro Config

- Metro bundler is configured at `apps/mobile/metro.config.js`
- Uses `withNxMetro` for Nx integration
- Includes all your existing aliases and SVG support

### Babel Config

- Located at `apps/mobile/.babelrc.js`
- Includes all your plugins (reanimated, module-resolver, dotenv)
- Module aliases point to both old (`@/`) and new (`@airbnb/`) paths

### Environment Variables

- `.env` still lives at workspace root
- Access via `@env` module (react-native-dotenv)
- Works the same as before

---

## 📦 Adding Dependencies

### App-Specific Dependencies

```bash
# Add to mobile app
cd apps/mobile
yarn add some-package
```

### Shared Dependencies (Workspace Root)

```bash
# Add to workspace (shared across all projects)
yarn add some-package
```

### Dev Dependencies

```bash
yarn add -D some-dev-package
```

---

## 🧪 Testing

```bash
# Run tests for mobile app
nx test mobile

# Run tests for a library
nx test models
nx test utils

# Run all affected tests (after making changes)
nx affected:test
```

---

## 🐛 Troubleshooting

### Clear All Caches

```bash
nx reset                                    # Clear Nx cache
rm -rf apps/mobile/.expo                   # Clear Expo cache
rm -rf apps/mobile/.metro-cache            # Clear Metro cache
nx start mobile --clear                    # Start with cleared Metro
```

### Import Errors

1. Check `tsconfig.base.json` for correct path mappings
2. Verify barrel exports in `libs/*/src/index.ts`
3. Restart TypeScript server in VS Code (Cmd+Shift+P → "Restart TS Server")

### Metro Bundler Issues

```bash
# Hard reset
nx reset
rm -rf node_modules
yarn install
nx start mobile --clear
```

### TypeScript Errors

```bash
# Rebuild TS project references
npx tsc --build --clean
npx tsc --build
```

---

## 📚 Next Steps

1. ✅ **Verify the app runs:** `nx start mobile`
2. 🔲 **Read the migration summary:** See `NX_MIGRATION_SUMMARY.md`
3. 🔲 **Start migrating files:** Begin with types → `libs/core/models`
4. 🔲 **Update imports gradually:** Use `@airbnb/*` paths
5. 🔲 **Enable module boundaries:** Add ESLint rule (see migration doc)

---

## 🆘 Need Help?

- **Nx Docs:** https://nx.dev
- **Nx Expo Plugin:** https://nx.dev/nx-api/expo
- **Migration Summary:** `NX_MIGRATION_SUMMARY.md`
- **Expo Docs:** https://docs.expo.dev

---

**Your app structure is ready!** Everything works as before, plus you now have the foundation for a
scalable Nx monorepo. 🎉
