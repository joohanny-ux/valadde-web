import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { error } = await supabase.from('brands').insert({
      id: body.id,
      name: body.name,
      name_kr: body.name_kr,
      slug: body.slug,
      logo_url: body.logo_url,
      description: body.description,
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
