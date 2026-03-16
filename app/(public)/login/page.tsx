'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase-client'

const DASHBOARD_BY_TYPE: Record<string, string> = {
  creator: '/creator',
  buyer: '/buyer',
  brand: '/brand',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const res = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (res.ok) {
          const { profile } = await res.json()
          const dash = DASHBOARD_BY_TYPE[profile?.user_type]
          router.push(dash || nextUrl)
        } else {
          router.push(nextUrl)
        }
      } else {
        router.push(nextUrl)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">로그인</h1>
      <p className="mb-8 text-sm text-neutral-500">계정에 로그인하고 역할에 맞는 워크스페이스로 이동하세요.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-neutral-900 py-3 font-medium text-white hover:bg-neutral-700">
          로그인
        </button>
      </form>
      <p className="mt-6 text-sm text-neutral-500">
        계정이 없으신가요? <Link href="/signup" className="text-neutral-900 hover:underline">회원가입</Link>
      </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto py-20 px-4 animate-pulse">로딩 중...</div>}>
      <LoginForm />
    </Suspense>
  )
}
