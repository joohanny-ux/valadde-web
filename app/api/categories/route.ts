import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { error } = await supabase.from('categories').insert({
      id: body.id,
      name: body.name,
      slug: body.slug,
      parent_id: body.parent_id,
      level: body.level ?? 1,
      display_order: body.display_order ?? 0,
      is_active: body.is_active ?? true,
      product_count: 0,
    })
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}
