import { createClient } from '@supabase/supabase-js';

let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
if (rawUrl.includes('/rest/v1')) {
  rawUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
}
if (rawUrl.endsWith('/')) {
  rawUrl = rawUrl.slice(0, -1);
}
const supabaseUrl = rawUrl;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl.includes('your-project') ||
    supabaseAnonKey.includes('your-supabase-anon') ||
    !supabaseUrl.startsWith('https://')
  ) {
    return false;
  }
  return true;
};

let client = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.info('[KisanFlow] Connected to Supabase backend.');
  } catch (err) {
    console.warn('[KisanFlow] Failed to initialize Supabase client. Falling back to local storage:', err);
    client = null;
  }
} else {
  // Informative notice for developer evaluation
  console.info('[KisanFlow] Supabase credentials not yet supplied. Operating in resilient local storage mode.');
}

export const supabase = client;
