import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!rawUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Ensure the URL is the base Supabase project URL (not the REST endpoint)
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

