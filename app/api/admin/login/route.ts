import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7일

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json(
      { message: 'ADMIN_PASSWORD가 설정되지 않았습니다.' },
      { status: 500 }
    )
  }

  const { password } = await request.json()
  if (password !== adminPassword) {
    return NextResponse.json({ message: 'Invalid' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
