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
    <div className="max-w-sm mx-auto py-20 px-4">
      <h1 className="font-serif text-2xl font-bold mb-8">회원가입</h1>
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
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-abu-charcoal border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
          minLength={6}
          required
        />
        <input
          type="text"
          placeholder="이름"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 bg-abu-charcoal border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
        />
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">회원 유형</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as 'creator' | 'buyer' | 'brand')}
            className="w-full px-3 py-2 bg-abu-charcoal border border-abu-gray rounded text-white focus:outline-none focus:border-abu-pink/50"
          >
            <option value="creator" className="bg-abu-dark">크리에이터</option>
            <option value="buyer" className="bg-abu-dark">바이어</option>
            <option value="brand" className="bg-abu-dark">브랜드</option>
          </select>
        </div>
        {error && <p className="text-abu-pink text-sm">{error}</p>}
        <button type="submit" className="w-full py-3 bg-abu-pink text-abu-dark rounded font-medium hover:bg-abu-pink-dark">
          가입하기
        </button>
      </form>
      <p className="mt-6 text-sm text-white/60">
        이미 계정이 있으신가요? <Link href="/login" className="text-abu-pink hover:underline">로그인</Link>
      </p>
    </div>
  )
}
