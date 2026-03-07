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
    <div className="max-w-sm mx-auto py-20 px-4">
      <h1 className="font-serif text-2xl font-bold mb-8">로그인</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-abu-charcoal border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-abu-charcoal border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
          required
        />
        {error && <p className="text-abu-pink text-sm">{error}</p>}
        <button type="submit" className="w-full py-3 bg-abu-pink text-abu-dark rounded font-medium hover:bg-abu-pink-dark">
          로그인
        </button>
      </form>
      <p className="mt-6 text-sm text-white/60">
        계정이 없으신가요? <Link href="/signup" className="text-abu-pink hover:underline">회원가입</Link>
      </p>
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
