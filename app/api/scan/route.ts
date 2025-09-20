import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export async function GET(req: Request) {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      count: data?.length ?? 0,
      firstRow: data?.[0] ?? null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
