import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/request-auth'

export async function GET() {
  const { data, error } = await supabase
    .from('notices')
    .select('id, title, is_pinned, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const adminError = requireAdminRequest(request)
  if (adminError) {
    return adminError
  }

  try {
    const body = await request.json()
    const { error } = await supabase.from('notices').insert({
      title: body.title,
      content: body.content ?? null,
      is_pinned: body.is_pinned ?? false,
    })
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    revalidatePath('/admin/notices')
    revalidatePath('/notice')
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}
