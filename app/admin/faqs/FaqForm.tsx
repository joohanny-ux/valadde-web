'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Faq = {
  id: string
  question: string
  answer: string
  display_order: number | null
}

export default function FaqForm({ faq }: { faq?: Faq }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    question: faq?.question ?? '',
    answer: faq?.answer ?? '',
    display_order: faq?.display_order ?? 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const url = faq ? `/api/faqs/${faq.id}` : '/api/faqs'
      const method = faq ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `저장 실패 (${res.status})`)
      setMsg('저장되었습니다.')
      if (!faq) router.push('/admin/faqs')
      router.refresh()
    } catch (err) {
      const msgText = err instanceof Error ? err.message : '오류'
      setMsg(msgText)
      console.error('FAQ save error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">질문 *</label>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">답변 *</label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            className="w-full px-3 py-2 border rounded h-32"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">표시 순서</label>
          <input
            type="number"
            value={form.display_order}
            onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
            className="w-24 px-3 py-2 border rounded"
          />
        </div>
      </div>
      {msg && <p className={`mt-4 text-sm ${msg.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
