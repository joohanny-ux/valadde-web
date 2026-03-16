'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase-client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<'creator' | 'buyer' | 'brand'>('creator')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, user_type: userType },
        },
      })
      if (error) throw error
      const dash = { creator: '/creator', buyer: '/buyer', brand: '/brand' }[userType] || '/'
      router.push(dash)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '가입 실패')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight text-neutral-900">회원가입</h1>
      <p className="mb-8 text-sm text-neutral-500">한국어 버전 기준으로 역할을 선택하고 Valadde 워크스페이스를 시작하세요.</p>
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
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
          minLength={6}
          required
        />
        <input
          type="text"
          placeholder="이름"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">회원 유형</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as 'creator' | 'buyer' | 'brand')}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-neutral-500 focus:outline-none"
          >
            <option value="creator">크리에이터</option>
            <option value="buyer">바이어</option>
            <option value="brand">브랜드</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-neutral-900 py-3 font-medium text-white hover:bg-neutral-700">
          가입하기
        </button>
      </form>
      <p className="mt-6 text-sm text-neutral-500">
        이미 계정이 있으신가요? <Link href="/login" className="text-neutral-900 hover:underline">로그인</Link>
      </p>
      </div>
    </div>
  )
}
