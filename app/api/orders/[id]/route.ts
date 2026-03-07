import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ message: '찾을 수 없음' }, { status: 404 })
  }

  if (!token) return NextResponse.json({ message: '인증 필요' }, { status: 401 })

  const client = createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
  const { data: { user } } = await client.auth.getUser(token)
  if (!user) return NextResponse.json({ message: '세션 만료' }, { status: 401 })
  if (order.user_id !== user.id) return NextResponse.json({ message: '권한 없음' }, { status: 403 })

  return NextResponse.json(order)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { error } = await supabase
      .from('orders')
      .update({
        status: body.status ?? undefined,
        memo: body.memo ?? undefined,
      })
      .eq('id', id)
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}
