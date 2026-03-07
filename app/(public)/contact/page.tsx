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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">문의</h1>
      <p className="text-white/70 mb-10">서비스 이용 문의, 협업 제안 등 편하게 남겨 주세요.</p>

      <div className="mb-10">
        <h2 className="text-sm font-medium text-white/60 mb-1">이메일</h2>
        <a href="mailto:contact@valadde.com" className="text-abu-pink hover:underline">
          contact@valadde.com
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-abu-charcoal border border-abu-gray rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">이름 *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 bg-abu-dark border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">이메일 *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-3 py-2 bg-abu-dark border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">제목</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            className="w-full px-3 py-2 bg-abu-dark border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
            placeholder="문의 유형 또는 제목"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">문의 내용 *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full px-3 py-2 bg-abu-dark border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50 h-32"
            required
          />
        </div>
        {msg && (
          <p className={`text-sm ${msg.includes('오류') || msg.includes('실패') ? 'text-abu-pink' : 'text-green-400'}`}>
            {msg}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="px-5 py-3 bg-abu-pink text-abu-dark rounded-lg hover:bg-abu-pink-dark font-medium disabled:opacity-50"
        >
          {sending ? '전송 중...' : '보내기'}
        </button>
      </form>
    </div>
  )
}
