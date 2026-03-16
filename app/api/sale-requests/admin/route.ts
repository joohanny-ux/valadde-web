import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/request-auth'

export async function GET(request: NextRequest) {
  const adminError = requireAdminRequest(request)
  if (adminError) {
    return adminError
  }

  const { data, error } = await supabase
    .from('sale_requests')
    .select('id, user_id, product_id, message, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  return NextResponse.json(data ?? [])
}
