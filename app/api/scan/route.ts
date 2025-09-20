// /app/api/scan/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export async function GET() {
  try {
    // یک تست ساده: گرفتن یک ردیف از جدول products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      count: data?.length ?? 0,
      firstRow: data?.[0] ?? null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}