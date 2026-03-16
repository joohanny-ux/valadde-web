import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedProfile } from '@/lib/request-auth'

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedProfile(request, ['creator'])
  if (!auth.ok) {
    return auth.response
  }

  try {
    const body = await request.json()
    const { product_id, message } = body

    if (!product_id) {
      return NextResponse.json({ message: '상품을 선택해 주세요.' }, { status: 400 })
    }

    const { error } = await auth.supabase.from('sale_requests').insert({
      user_id: auth.user.id,
      product_id,
      message: message ?? null,
      status: 'pending',
    })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}
