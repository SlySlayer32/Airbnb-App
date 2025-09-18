import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://qvvfjxjwuucmkjrvaqxf.supabase.co';
const supabaseKey = 'sb_publishable_dJi8cFhhTAVJvE682L1x8A_JkHc-PAP';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };