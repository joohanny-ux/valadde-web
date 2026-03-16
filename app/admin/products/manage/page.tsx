'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Product = {
  id: string
  brand: string
  image: string
  name_kr: string
  name_en: string
  is_display?: boolean
}

function ProductManagePageInner() {
  const searchParams = useSearchParams()
  const brand = searchParams.get('brand') ?? ''
  const q = searchParams.get('q') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)

  const [data, setData] = useState<{
    products: Product[]
    total: number
    totalPages: number
    brands: string[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (brand) params.set('brand', brand)
    params.set('page', String(page))
    fetch(`/api/admin/products/registered?${params}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [q, brand, page])

  async function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    const res = await fetch(`/api/admin/products/registered?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    if (res.ok) window.location.reload()
    else alert((await res.json()).message ?? '삭제 실패')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">상품 관리</h1>

      {/* 상품 검색 */}
      <form method="get" action="/admin/products/manage" className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="상품명, 브랜드 검색"
          className="px-3 py-2 border rounded w-56"
        />
        <select name="brand" defaultValue={brand} className="px-3 py-2 border rounded w-48">
          <option value="">전체 브랜드</option>
          {(data?.brands ?? []).map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          검색
        </button>
      </form>

      {/* 상품 리스트 */}
      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">총 {data?.total ?? 0}건</p>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">브랜드</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">이미지</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">한글 상품명</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">영문 상품명</th>
                  <th className="px-4 py-2 text-center text-sm font-medium">진열 여부</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">작업</th>
                </tr>
              </thead>
              <tbody>
                {(data?.products ?? []).map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{p.brand}</td>
                    <td className="px-4 py-2">
                      <div
                        className="w-12 h-12 bg-gray-100 rounded bg-cover bg-center"
                        style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
                      />
                    </td>
                    <td className="px-4 py-2">{p.name_kr}</td>
                    <td className="px-4 py-2 text-gray-600">{p.name_en || '-'}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={p.is_display !== false ? 'text-green-600 font-medium' : 'text-gray-400'}>
                        {p.is_display !== false ? 'O' : 'X'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/admin/products/edit/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-3 text-sm text-blue-600 hover:underline"
                      >
                        수정
                      </Link>
                      <Link
                        href={`/admin/products/${p.id}/product-page`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-3 text-sm text-green-600 hover:underline"
                      >
                        상품페이지 생성
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="mr-3 text-sm text-red-600 hover:underline"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(data?.totalPages ?? 0) > 1 && (
            <div className="mt-4 flex gap-2 justify-center">
              {page > 1 && (
                <Link
                  href={`/admin/products/manage?${new URLSearchParams({
                    ...(q && { q }),
                    ...(brand && { brand }),
                    page: String(page - 1),
                  })}`}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  이전
                </Link>
              )}
              <span className="px-3 py-1">
                {page} / {data?.totalPages ?? 1}
              </span>
              {page < (data?.totalPages ?? 1) && (
                <Link
                  href={`/admin/products/manage?${new URLSearchParams({
                    ...(q && { q }),
                    ...(brand && { brand }),
                    page: String(page + 1),
                  })}`}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  다음
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function AdminProductsManagePage() {
  return (
    <Suspense fallback={<div className="py-12 text-gray-500">로딩 중...</div>}>
      <ProductManagePageInner />
    </Suspense>
  )
}
