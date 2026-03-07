import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { error } = await supabase
      .from('faqs')
      .update({
        question: body.question,
        answer: body.answer,
        display_order: body.display_order ?? 0,
      })
      .eq('id', id)
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    revalidatePath('/admin/faqs')
    revalidatePath('/faq')
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
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    revalidatePath('/admin/faqs')
    revalidatePath('/faq')
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}
