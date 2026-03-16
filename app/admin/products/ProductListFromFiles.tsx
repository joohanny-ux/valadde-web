'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type ProductRow = {
  brand: string
  image: string
  name_kr: string
  name_en: string
  msrp?: number
}

function ProductListInner() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const brand = searchParams.get('brand') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)

  const [data, setData] = useState<{
    products: ProductRow[]
    total: number
    totalPages: number
    brands: string[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [updateResult, setUpdateResult] = useState<{ success: boolean; count?: number; message?: string } | null>(null)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (brand) params.set('brand', brand)
    params.set('page', String(page))
    fetch(`/api/admin/products/list-from-files?${params}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [q, brand, page])

  async function handleUpdateProducts() {
    setUpdating(true)
    setUpdateResult(null)
    try {
      const res = await fetch('/api/admin/products/update-from-files', { method: 'POST' })
      const json = await res.json()
      setUpdateResult({
        success: json.success,
        count: json.count,
        message: json.message,
      })
      if (json.success && json.count > 0) {
        window.location.reload()
      }
    } catch (err) {
      setUpdateResult({ success: false, message: err instanceof Error ? err.message : '업데이트 실패' })
    } finally {
      setUpdating(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="py-12 text-center text-gray-500">
        로딩 중...
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">상품 목록</h1>
        <button
          type="button"
          onClick={handleUpdateProducts}
          disabled={updating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {updating ? '업데이트 중...' : 'Update Products'}
        </button>
      </div>
      {updateResult && (
        <div
          className={`mb-4 p-3 rounded text-sm ${updateResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
        >
          {updateResult.success
            ? `${updateResult.count ?? 0}건 업데이트됨`
            : updateResult.message ?? '업데이트 실패'}
        </div>
      )}

      <ProductSearchForm defaultQ={q} defaultBrand={brand} brands={data.brands} />

      <p className="text-sm text-gray-500 mb-4">총 {data.total}건</p>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">브랜드</th>
              <th className="px-4 py-2 text-left text-sm font-medium">이미지</th>
              <th className="px-4 py-2 text-left text-sm font-medium">한글 상품명</th>
              <th className="px-4 py-2 text-left text-sm font-medium">영문 상품명</th>
              <th className="px-4 py-2 text-right text-sm font-medium">소비자가</th>
              <th className="px-4 py-2 text-center text-sm font-medium">진열여부</th>
              <th className="px-4 py-2 text-left text-sm font-medium">상세페이지</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((p, i) => (
              <tr key={`${p.brand}-${p.name_kr}-${i}`} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{p.brand}</td>
                <td className="px-4 py-2">
                  <div
                    className="w-12 h-12 bg-gray-100 rounded bg-cover bg-center"
                    style={
                      p.image
                        ? { backgroundImage: `url(${p.image})` }
                        : undefined
                    }
                  />
                </td>
                <td className="px-4 py-2">{p.name_kr}</td>
                <td className="px-4 py-2 text-gray-600">{p.name_en || '-'}</td>
                <td className="px-4 py-2 text-right">
                  {p.msrp != null ? p.msrp.toLocaleString() : '-'}
                </td>
                <td className="px-4 py-2 text-center text-gray-400">-</td>
                <td className="px-4 py-2 text-gray-400">차후 설정</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="mt-4 flex gap-2 justify-center">
          {page > 1 && (
            <a
              href={`/admin/products?${new URLSearchParams({
                ...(q && { q }),
                ...(brand && { brand }),
                page: String(page - 1),
              })}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              이전
            </a>
          )}
          <span className="px-3 py-1">
            {page} / {data.totalPages}
          </span>
          {page < data.totalPages && (
            <a
              href={`/admin/products?${new URLSearchParams({
                ...(q && { q }),
                ...(brand && { brand }),
                page: String(page + 1),
              })}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              다음
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function ProductSearchForm({
  defaultQ,
  defaultBrand,
  brands,
}: {
  defaultQ: string
  defaultBrand: string
  brands: string[]
}) {
  return (
    <form
      method="get"
      action="/admin/products"
      className="flex flex-wrap gap-3 mb-6"
    >
      <input
        type="text"
        name="q"
        defaultValue={defaultQ}
        placeholder="상품명, 브랜드 검색"
        className="px-3 py-2 border rounded w-48"
      />
      <select name="brand" defaultValue={defaultBrand} className="px-3 py-2 border rounded w-40">
        <option value="">전체 브랜드</option>
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        검색
      </button>
    </form>
  )
}

export default function ProductListFromFiles() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-500">로딩 중...</div>}>
      <ProductListInner />
    </Suspense>
  )
}
