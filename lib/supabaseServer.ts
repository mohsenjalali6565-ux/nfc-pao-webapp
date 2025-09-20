import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  throw new Error('❌ Missing Supabase environment variables for server-side.');
}
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
