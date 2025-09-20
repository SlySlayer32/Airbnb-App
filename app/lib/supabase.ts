// This file lives under the `app/` directory, so expo-router treats it as a route.
// To prevent route errors while keeping backward-compat imports, we re-export the
// real client from `@/lib/supabase` and provide a no-op default component.

export { supabase } from '@/lib/supabase';

// Default export to satisfy expo-router's route requirement; this screen is unused.
export default function SupabaseShim() {
    return null;
}