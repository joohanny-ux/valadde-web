import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/request-auth'

export async function GET(request: NextRequest) {
  const adminError = requireAdminRequest(request)
  if (adminError) {
    return adminError
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = Number(searchParams.get('limit')) || 50

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
  return NextResponse.json(data ?? [])
}
