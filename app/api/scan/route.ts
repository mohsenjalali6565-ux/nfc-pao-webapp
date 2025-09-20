import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tagId } = body

    if (!tagId) {
      return NextResponse.json({ error: 'tagId is required' }, { status: 400 })
    }

    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .eq('tag_code', tagId)
      .single()

    if (error || !tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    if (!tag.opened_at) {
      const now = new Date().toISOString()
      const { error: upErr } = await supabaseAdmin
        .from('tags')
        .update({ opened_at: now, tamper_state: 'opened' })
        .eq('id', tag.id)

      if (upErr) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
}
