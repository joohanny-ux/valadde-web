import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '인증 필요' }, { status: 401 })
    }

    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: '세션 만료' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type, full_name, email, company_name')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      profile: profile || { user_type: 'creator', full_name: null, email: user.email, company_name: null },
    })
  } catch {
    return NextResponse.json({ error: '오류' }, { status: 500 })
  }
}
