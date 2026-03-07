'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function toSlug(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

export default function CategoryNewForm({
  parentOptions,
}: {
  parentOptions: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    name: '',
    slug: '',
    parent_id: '',
    level: 1,
    display_order: 0,
    is_active: true,
  })

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: f.slug || toSlug(name) || '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const slug = form.slug || toSlug(form.name) || `cat_${Date.now()}`
      const id = form.parent_id ? `${form.parent_id}_${slug}` : `cat_${slug}`
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: form.name,
          slug,
          parent_id: form.parent_id || null,
          level: form.level,
          display_order: form.display_order,
          is_active: form.is_active,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      router.push('/admin/categories')
      router.refresh()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '오류')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">이름 *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            placeholder="자동 생성"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">상위 카테고리</label>
          <select
            value={form.parent_id}
            onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">없음</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">단계</label>
          <input
            type="number"
            min={1}
            max={3}
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: Number(e.target.value) }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">표시 순서</label>
          <input
            type="number"
            value={form.display_order}
            onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
          />
          노출
        </label>
      </div>
      {msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}
      <button type="submit" disabled={saving} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {saving ? '저장 중...' : '추가'}
      </button>
    </form>
  )
}
