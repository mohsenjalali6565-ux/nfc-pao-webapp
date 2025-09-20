import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('❌ متغیرهای محیطی Supabase برای سمت سرور پیدا نشدند.');
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
