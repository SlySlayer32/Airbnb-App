# Copilot agent instructions for this repo

This is an Expo + React Native app using expo-router and Supabase for auth/profile data. Use these conventions to be productive and avoid breaking cross-cutting behaviors.

## Architecture
- Routing: file-based via `expo-router` with typed routes enabled (see `app/_layout.tsx`, `app/**`). The root stack is declared in `_layout.tsx` and includes modal screens for auth (`auth/login`, `auth/register`, `auth/forgot-password`).
- Auth: `contexts/AuthContext.tsx` wraps the app (`AuthProvider` in `_layout.tsx`). It manages Supabase session, listens to `onAuthStateChange`, and loads the user’s row from `profiles` (note: `PGRST116` means “no rows”). Use `useAuth()` for `user`, `profile`, `loading`, and auth methods.
- Navigation guard: `AuthGuard` inside `_layout.tsx` redirects to `/auth/login` if no user, or `/onboarding` if `profile.onboarded === false`.
- Role-based access: Wrap restricted UI in `components/RoleBasedWrapper.tsx` and pass `allowedRoles` of `property_owner | cleaner | co_host`.
- Data models: Centralized in `types/index.ts` (e.g., `Property`, `TeamMember`, `CleaningTask`, `Invoice`, `MaintenanceTicket`). Mock UI uses `data/mockData.ts`.
- Supabase: Client is created in `app/lib/supabase.ts` using the public anon key. Profiles are fetched via `from('profiles').select('*').eq('id', userId).single()`.

## Tooling and runtime
- Start dev server: `npm install` then `npx expo start` (or `npm run start`). Use `--android`, `--ios`, or `--web` as needed.
- Lint: `npm run lint` (uses `eslint-config-expo`). TypeScript config extends `expo/tsconfig.base` with `strict: true` and path alias `@/*` to repo root.
- Web export: `npm run build` calls `npx expo export --platform web --clear` and uses Metro bundler (`app.json:web.output=static`).
- Metro/Babel: `metro.config.js` adds `mjs` support, disables hierarchical lookup, and aliases `@supabase/node-fetch` to `shims/node-fetch.js` to force RN’s global `fetch`. Babel enables `react-native-worklets/plugin` (must be last) and `@babel/plugin-proposal-export-namespace-from`.

## Conventions and patterns
- Imports: Prefer `@/` absolute imports (e.g., `@/contexts/AuthContext`).
- Auth-first flow: Don’t mount screens outside `AuthProvider`. For redirects, rely on `AuthGuard` in `_layout.tsx` rather than per-screen checks.
- Role gating: Use `RoleBasedWrapper` at render sites; avoid duplicating role checks in business logic.
- Navigation: Use `router.push('/path')` or `router.replace('/path')` from `expo-router`. Match file names to routes (e.g., `app/properties.tsx` -> `/properties`).
- UI: Components use React Native `StyleSheet` with a consistent primary color `#007AFF`. Examples: `DashboardStats`, `QuickActions`, `PropertyCard`.
- Mock vs live data: Many screens read from `data/mockData.ts`. When wiring live data, keep `types/` aligned and prefer replacing fetch points in screens/components, not in the context.

## Integration notes and pitfalls
- Supabase in RN: Do not import `node-fetch`. The Metro alias and `shims/node-fetch.js` ensure Supabase uses the built-in RN `fetch`.
- Profiles table: The auth context expects a `profiles` table with `id`, `email`, `full_name`, `role`, `onboarded`, etc. Update `Profile` in the context (not `types/`) if columns change.
- React Native Reanimated/worklets: Keep the Babel plugin ordering; placing other plugins after `react-native-worklets/plugin` may break builds.
- Module resolution: Metro `disableHierarchicalLookup` is true—dependencies must live in this project’s `node_modules`.

## Examples
- Protect a section for owners only:
  - `<RoleBasedWrapper allowedRoles={["property_owner", "co_host"]}>...children...</RoleBasedWrapper>`
- Navigate from a component: `import { router } from 'expo-router'; router.push('/profile')`.

If anything above is unclear or you find patterns that differ from these, leave a short note in your PR and I’ll update this guide.
