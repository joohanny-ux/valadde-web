'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || '전송 실패')
      setMsg('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '전송 중 오류가 발생했습니다.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-semibold tracking-tight text-neutral-900">문의</h1>
      <p className="mb-10 text-base leading-7 text-neutral-600">서비스 이용 문의, 협업 제안, 운영 관련 질문을 남겨 주세요.</p>

      <div className="mb-10">
        <h2 className="mb-1 text-sm font-medium text-neutral-500">이메일</h2>
        <a href="mailto:contact@valadde.com" className="text-neutral-900 hover:underline">
          contact@valadde.com
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">이름 *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">이메일 *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">제목</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
            placeholder="문의 유형 또는 제목"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">문의 내용 *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="h-32 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
            required
          />
        </div>
        {msg && (
          <p className={`text-sm ${msg.includes('오류') || msg.includes('실패') ? 'text-red-600' : 'text-emerald-600'}`}>
            {msg}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-neutral-900 px-5 py-3 font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {sending ? '전송 중...' : '보내기'}
        </button>
      </form>
    </div>
  )
}
