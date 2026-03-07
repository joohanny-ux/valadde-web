import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  const url = new URL(request.url)
  const redirect = NextResponse.redirect(new URL('/admin/login', url.origin))
  redirect.cookies.delete('admin_session')
  return redirect
}
