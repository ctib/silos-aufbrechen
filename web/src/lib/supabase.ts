import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://cbybfmnbojklqbkmuwto.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Client is created eagerly but only functional with a real anon key.
// During SSG build, the placeholder key means API calls will fail gracefully.
// At runtime in the browser, the real key from env vars will be used.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
