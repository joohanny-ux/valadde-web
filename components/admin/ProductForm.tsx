'use client'

import { useState, useRef } from 'react'

type FieldConfig = { key: string; label: string; required?: boolean; type?: 'number' | 'url' }

const FIELDS: FieldConfig[] = [
  { key: 'brand', label: 'brand', required: true },
  { key: 'image', label: 'image', type: 'url' },
  { key: 'category_1', label: 'category_1' },
  { key: 'category_2', label: 'category_2' },
  { key: 'category_3', label: 'category_3' },
  { key: 'name_kr', label: 'name_kr', required: true },
  { key: 'name_en', label: 'name_en' },
  { key: 'name_cn_s', label: 'name_cn_s' },
  { key: 'name_cn_f', label: 'name_cn_f' },
  { key: 'name_jp', label: 'name_jp' },
  { key: 'volume', label: 'volume' },
  { key: 'quantity_per_carton', label: 'quantity_per_carton', type: 'number' },
  { key: 'shelf_life_month', label: 'shelf_life_month', type: 'number' },
  { key: 'msrp', label: 'msrp', type: 'number' },
  { key: 'buying_price_-vat', label: 'buying_price_-vat', type: 'number' },
  { key: 'buying_price_+vat', label: 'buying_price_+vat', type: 'number' },
  { key: 'buying_price_rate', label: 'buying_price_rate', type: 'number' },
  { key: 'product_barcode', label: 'product_barcode' },
  { key: 'carton_barcode', label: 'carton_barcode' },
  { key: 'country_of_origin', label: 'country_of_origin' },
]

type FormData = Record<string, string | number | boolean | undefined>

type ProductFormProps = {
  initialData?: FormData | null
  mode: 'register' | 'edit'
  onSubmit: (data: FormData) => Promise<void>
  submitLabel?: string
  submitLoadingLabel?: string
}

export default function ProductForm({
  initialData,
  mode,
  onSubmit,
  submitLabel,
  submitLoadingLabel,
}: ProductFormProps) {
  const [form, setForm] = useState<FormData>(() => (initialData && Object.keys(initialData).length > 0) ? initialData : getEmptyForm())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const imageUrl = typeof form.image === 'string' ? form.image : ''

  function handleChange(key: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '업로드 실패')
      handleChange('image', data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드 실패')
      setForm((prev) => ({ ...prev, image: '' }))
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : mode === 'edit' ? '수정 실패' : '등록 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <p className="text-red-600 text-sm p-3 bg-red-50 rounded">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.key === 'image' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            {f.key === 'image' ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2 flex-wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm border rounded px-3 py-2"
                    disabled={loading}
                  />
                  <input
                    type="url"
                    value={typeof form.image === 'string' ? form.image : ''}
                    onChange={(e) => handleChange('image', e.target.value)}
                    placeholder="또는 URL 입력"
                    className="flex-1 min-w-48 px-3 py-2 border rounded"
                  />
                </div>
                {imageUrl && (
                  <div className="shrink-0">
                    <p className="text-xs text-gray-500 mb-1">미리보기</p>
                    <img
                      src={imageUrl}
                      alt="미리보기"
                      className="w-24 h-24 object-cover rounded border bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <input
                type={f.type === 'number' ? 'number' : 'text'}
                value={typeof form[f.key] === 'string' || typeof form[f.key] === 'number' ? String(form[f.key]) : ''}
                onChange={(e) =>
                  handleChange(f.key, f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)
                }
                required={f.required}
                className="w-full px-3 py-2 border rounded"
              />
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">진열 여부</label>
          <select
            value={form.is_display ? '1' : '0'}
            onChange={(e) => setForm((prev) => ({ ...prev, is_display: e.target.value === '1' }))}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="1">O (노출)</option>
            <option value="0">X (비노출)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {loading ? (submitLoadingLabel ?? '처리 중...') : (submitLabel ?? '저장')}
      </button>
    </form>
  )
}

function getEmptyForm(): FormData {
  const out: FormData = { is_display: true }
  for (const f of FIELDS) out[f.key] = ''
  return out
}
