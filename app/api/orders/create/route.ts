import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 })
  }

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) {
    return NextResponse.json({ error: '세션 만료' }, { status: 401 })
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

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        user_type: user_type ?? 'buyer',
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
