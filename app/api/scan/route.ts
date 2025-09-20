import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// -------------------------
// گرفتن URL و KEY از env
// -------------------------
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("❌ Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// -------------------------
// Route اصلی
// -------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // نمونه: فرض کنیم body شامل { tagId: "abc123" } هست
    const { tagId } = body;

    if (!tagId) {
      return NextResponse.json(
        { error: "tagId is required" },
        { status: 400 }
      );
    }

    // کوئری از جدول products
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("tagId", tagId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}