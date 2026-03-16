import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/request-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminError = requireAdminRequest(request)
  if (adminError) {
    return adminError
  }

  try {
    const { id } = await params
    const body = await request.json()

    const update: Record<string, unknown> = {}
    if (body.name !== undefined) update.name = body.name
    if (body.slug !== undefined) update.slug = body.slug
    if (body.parent_id !== undefined) update.parent_id = body.parent_id
    if (body.level !== undefined) update.level = body.level
    if (body.display_order !== undefined) update.display_order = body.display_order
    if (body.is_active !== undefined) update.is_active = body.is_active

    const { error } = await supabase.from('categories').update(update).eq('id', id)
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}
