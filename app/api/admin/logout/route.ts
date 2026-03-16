import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE } from '@/lib/admin-session'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  const url = new URL(request.url)
  const redirect = NextResponse.redirect(new URL('/admin/login', url.origin))
  redirect.cookies.delete(ADMIN_COOKIE)
  return redirect
}
