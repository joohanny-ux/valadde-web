import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedProfile } from '@/lib/request-auth'

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedProfile(request, ['buyer'])
  if (!auth.ok) {
    return auth.response
  }

  try {
    const body = await request.json()
    const { user_type, order_type, items, memo } = body

    if (!items?.length) {
      return NextResponse.json({ message: '상품을 선택해 주세요.' }, { status: 400 })
    }

    const totalAmount = items.reduce(
      (sum: number, it: { qty?: number; unit_price?: number }) =>
        sum + (it.qty ?? 0) * (it.unit_price ?? 0),
      0
    )

    const { data: order, error } = await auth.supabase
      .from('orders')
      .insert({
        user_id: auth.user.id,
        user_type: auth.profile?.user_type ?? user_type ?? 'buyer',
        order_type: order_type ?? 'po',
        items,
        total_amount: totalAmount,
        memo: memo ?? null,
        status: 'submitted',
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, id: order?.id })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}
