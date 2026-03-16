import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedProfile } from '@/lib/request-auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedProfile(request)
    if (!auth.ok) {
      return auth.response
    }

    return NextResponse.json({
      user: { id: auth.user.id, email: auth.user.email },
      profile:
        auth.profile || {
          user_type: 'creator',
          full_name: null,
          email: auth.user.email ?? null,
          company_name: null,
        },
    })
  } catch {
    return NextResponse.json({ error: '오류' }, { status: 500 })
  }
}
