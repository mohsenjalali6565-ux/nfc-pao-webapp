import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Public client (browser) — uses anon key
export const supabasePublic = createClient(env.supabaseUrl, env.supabaseAnon)

// Admin client (server-only) — uses service role key (NEVER expose to browser)
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseService, {
  auth: { persistSession: false }
})
