import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedProfile } from '@/lib/request-auth'

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedProfile(request, ['creator', 'buyer', 'brand'])
  if (!auth.ok) {
    return auth.response
  }

  const { data, error } = await auth.supabase
    .from('sale_requests')
    .select('id, product_id, message, status, created_at')
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
  return NextResponse.json(data ?? [])
}
