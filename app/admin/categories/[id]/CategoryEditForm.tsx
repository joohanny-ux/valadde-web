'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  id: string
  name: string
  slug: string
  parent_id: string | null
  level: number | null
  display_order: number | null
  is_active: boolean | null
}

export default function CategoryEditForm({
  category,
  parentOptions,
}: {
  category: Category
  parentOptions: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    name: category.name ?? '',
    slug: category.slug ?? '',
    parent_id: category.parent_id ?? '',
    level: category.level ?? 1,
    display_order: category.display_order ?? 0,
    is_active: category.is_active ?? true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          parent_id: form.parent_id || null,
          level: form.level,
          display_order: form.display_order,
          is_active: form.is_active,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setMsg('저장되었습니다.')
      router.refresh()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '오류')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">ID</label>
          <p className="text-gray-500">{category.id}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">이름 *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
      {msg && <p className={`mt-4 text-sm ${msg.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
      <button type="submit" disabled={saving} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {saving ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
