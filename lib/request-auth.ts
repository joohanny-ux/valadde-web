import { createClient, type User } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifyAdminSessionValue } from './admin-session'

export type UserType = 'creator' | 'buyer' | 'brand' | 'admin'

type Profile = {
  user_type: UserType
  full_name: string | null
  email: string | null
  company_name: string | null
}

type AuthSuccess = {
  ok: true
  token: string
  user: User
  profile: Profile | null
  supabase: ReturnType<typeof createUserScopedClient>
}

type AuthFailure = {
  ok: false
  response: NextResponse
}

function getAnonEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 필요')
  }

  return { url, anonKey }
}

export function createUserScopedClient(token: string) {
  const { url, anonKey } = getAnonEnv()
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
}

export function readBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '').trim()
  return token || null
}

export async function requireAuthenticatedProfile(
  request: NextRequest,
  allowedTypes?: UserType[]
): Promise<AuthSuccess | AuthFailure> {
  const token = readBearerToken(request)
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 }),
    }
  }

  const supabase = createUserScopedClient(token)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: '세션이 만료되었습니다.' }, { status: 401 }),
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type, full_name, email, company_name')
    .eq('id', user.id)
    .single()

  if (allowedTypes?.length && (!profile?.user_type || !allowedTypes.includes(profile.user_type as UserType))) {
    return {
      ok: false,
      response: NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 }),
    }
  }

  return {
    ok: true,
    token,
    user,
    profile: (profile as Profile | null) ?? null,
    supabase,
  }
}

export function requireAdminRequest(request: NextRequest) {
  const sessionValue = request.cookies.get(ADMIN_COOKIE)?.value
  if (!verifyAdminSessionValue(sessionValue)) {
    return NextResponse.json({ error: '관리자 인증이 필요합니다.' }, { status: 401 })
  }

  return null
}
