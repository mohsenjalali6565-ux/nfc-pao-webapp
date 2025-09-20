export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseService: process.env.SUPABASE_SERVICE_ROLE!,
  scanHmacSecret: process.env.SCAN_HMAC_SECRET || 'dev-secret'
};
