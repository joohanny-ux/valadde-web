'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Brand = {
  id: string
  name: string
  name_kr: string | null
  slug: string
  logo_url: string | null
  description: string | null
  display_order: number | null
  is_active: boolean | null
}

export default function BrandEditForm({ brand }: { brand: Brand }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    name: brand.name ?? '',
    name_kr: brand.name_kr ?? '',
    slug: brand.slug ?? '',
    logo_url: brand.logo_url ?? '',
    description: brand.description ?? '',
    display_order: brand.display_order ?? 0,
    is_active: brand.is_active ?? true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch(`/api/brands/${brand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          name_kr: form.name_kr || null,
          slug: form.slug,
          logo_url: form.logo_url || null,
          description: form.description || null,
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
          <p className="text-gray-500">{brand.id}</p>
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
          <label className="block text-sm font-medium mb-1">이름 (한글)</label>
          <input
            type="text"
            value={form.name_kr}
            onChange={(e) => setForm((f) => ({ ...f, name_kr: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
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
          <label className="block text-sm font-medium mb-1">로고 URL</label>
          <input
            type="text"
            value={form.logo_url}
            onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 border rounded h-20"
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
