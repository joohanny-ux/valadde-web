'use client'

import { useState, useRef } from 'react'

export default function ProductImport() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ count: number; errors?: string[] } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const file = (form.elements.namedItem('file') as HTMLInputElement)?.files?.[0]
    if (!file) return
    setLoading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '가져오기 실패')
      setResult({ count: data.count, errors: data.errors })
      if (data.count > 0) window.location.reload()
      inputRef.current!.value = ''
    } catch (err) {
      setResult({ count: 0, errors: [err instanceof Error ? err.message : '오류'] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept=".xlsx,.xls"
          className="text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '가져오는 중...' : 'Excel 가져오기'}
        </button>
      </form>
      {result && (
        <p className="text-sm mt-1 text-gray-600">
          {result.count}건 등록됨
          {result.errors && result.errors.length > 0 && (
            <span className="text-amber-600 ml-2">({result.errors.length}건 오류)</span>
          )}
        </p>
      )}
    </div>
  )
}
