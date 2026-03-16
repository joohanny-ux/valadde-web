import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/request-auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  let query = supabase
    .from('faqs')
    .select('id, question, answer, display_order')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (q) {
    query = query.or(`question.ilike.%${q}%,answer.ilike.%${q}%`)
  }

  const { data, error } = await query

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
    const { error } = await supabase.from('faqs').insert({
      question: body.question,
      answer: body.answer,
      display_order: body.display_order ?? 0,
    })
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
