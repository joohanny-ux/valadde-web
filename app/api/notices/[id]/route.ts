import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ message: '찾을 수 없음' }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { error } = await supabase
      .from('notices')
      .update({
        title: body.title,
        content: body.content ?? null,
        is_pinned: body.is_pinned ?? false,
      })
      .eq('id', id)
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

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase.from('notices').delete().eq('id', id)
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
