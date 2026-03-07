'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Notice = {
  id: string
  title: string
  content: string | null
  is_pinned: boolean | null
}

export default function NoticeForm({ notice }: { notice?: Notice }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    title: notice?.title ?? '',
    content: notice?.content ?? '',
    is_pinned: notice?.is_pinned ?? false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const url = notice ? `/api/notices/${notice.id}` : '/api/notices'
      const method = notice ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `저장 실패 (${res.status})`)
      setMsg('저장되었습니다.')
      if (!notice) router.push('/admin/notices')
      router.refresh()
    } catch (err) {
      const msgText = err instanceof Error ? err.message : '오류'
      setMsg(msgText)
      console.error('Notice save error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full px-3 py-2 border rounded h-40"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_pinned}
            onChange={(e) => setForm((f) => ({ ...f, is_pinned: e.target.checked }))}
          />
          상단 고정
        </label>
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
