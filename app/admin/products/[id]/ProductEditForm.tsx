'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Brand = { id: string; name: string }
type Category = { id: string; name: string }

type Product = {
  id: string
  name: string
  name_en: string | null
  name_zh_s: string | null
  name_zh_f: string | null
  name_jp: string | null
  sku: string | null
  category_id: string
  brand_id: string
  short_description: string | null
  description: string | null
  images: string[] | null
  price: number | null
  promotion_price: number | null
  wholesale_price: number | null
  stock: number | null
  is_active: boolean | null
  is_featured: boolean | null
  specs: Record<string, unknown> | null
  manufacturer: string | null
  country_of_origin: string | null
  moq: number | null
  [key: string]: unknown
}

export default function ProductEditForm({
  product,
  brands,
  categories,
}: {
  product: Product
  brands: Brand[]
  categories: Category[]
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const [form, setForm] = useState({
    name: product.name ?? '',
    name_en: product.name_en ?? '',
    sku: product.sku ?? '',
    category_id: product.category_id ?? '',
    brand_id: product.brand_id ?? '',
    short_description: product.short_description ?? '',
    description: product.description ?? '',
    images: (product.images as string[]) ?? [],
    price: product.price ?? '',
    promotion_price: product.promotion_price ?? '',
    wholesale_price: product.wholesale_price ?? '',
    stock: product.stock ?? '',
    is_active: product.is_active ?? true,
    is_featured: product.is_featured ?? false,
    manufacturer: product.manufacturer ?? '',
    country_of_origin: product.country_of_origin ?? '',
    moq: product.moq ?? '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          name_en: form.name_en || null,
          sku: form.sku || null,
          category_id: form.category_id,
          brand_id: form.brand_id,
          short_description: form.short_description || null,
          description: form.description || null,
          images: form.images,
          price: form.price !== '' ? Number(form.price) : null,
          promotion_price: form.promotion_price !== '' ? Number(form.promotion_price) : null,
          wholesale_price: form.wholesale_price !== '' ? Number(form.wholesale_price) : null,
          stock: form.stock !== '' ? Number(form.stock) : null,
          is_active: form.is_active,
          is_featured: form.is_featured,
          manufacturer: form.manufacturer || null,
          country_of_origin: form.country_of_origin || null,
          moq: form.moq !== '' ? Number(form.moq) : null,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || '저장 실패')
      }
      setMsg('저장되었습니다.')
      router.refresh()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '오류 발생')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">상품명 (한글) *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">상품명 (영어)</label>
          <input
            type="text"
            value={form.name_en}
            onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">브랜드</label>
            <select
              value={form.brand_id}
              onChange={(e) => setForm((f) => ({ ...f, brand_id: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              required
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">카테고리</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">이미지</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.images.map((url, i) => (
              <div key={i} className="relative">
                <div
                  className="w-20 h-20 bg-gray-100 rounded bg-cover"
                  style={{ backgroundImage: `url(${url})` }}
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const fd = new FormData()
              fd.set('file', file)
              fd.set('productId', product.id)
              const res = await fetch('/api/upload', { method: 'POST', body: fd })
              if (!res.ok) return
              const { url } = await res.json()
              setForm((f) => ({ ...f, images: [...f.images, url] }))
              e.target.value = ''
            }}
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">한 줄 요약</label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">상세 설명</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 border rounded h-24"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">소비자가 (MSRP)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">프로모션가</label>
            <input
              type="number"
              value={form.promotion_price}
              onChange={(e) => setForm((f) => ({ ...f, promotion_price: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">매입가 (부가세포함)</label>
            <input
              type="number"
              value={form.wholesale_price}
              onChange={(e) => setForm((f) => ({ ...f, wholesale_price: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">재고</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">MOQ</label>
            <input
              type="number"
              value={form.moq}
              onChange={(e) => setForm((f) => ({ ...f, moq: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">제조사</label>
            <input
              type="text"
              value={form.manufacturer}
              onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">원산지</label>
            <input
              type="text"
              value={form.country_of_origin}
              onChange={(e) => setForm((f) => ({ ...f, country_of_origin: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            노출
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
            />
            메인 노출
          </label>
        </div>
      </div>

      {msg && (
        <p className={`mt-4 text-sm ${msg.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>
          {msg}
        </p>
      )}

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
