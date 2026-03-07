'use client'

import Link from 'next/link'

type Product = {
  id: string
  name: string
  name_en: string | null
  sku: string | null
  price: number | null
  wholesale_price: number | null
  stock: number | null
  is_active: boolean | null
  brand_id: string
  category_id: string
  images: string[] | null
}

export default function ProductList({
  products,
  totalCount,
  page,
  totalPages,
  searchParams = {},
}: {
  products: Product[]
  totalCount: number
  page: number
  totalPages: number
  searchParams?: Record<string, string>
}) {
  const imgUrl = (images: string[] | null) => images?.[0] || null

  const baseParams = new URLSearchParams(searchParams)

  function pageUrl(p: number) {
    const p2 = new URLSearchParams(baseParams)
    p2.set('page', String(p))
    return `/admin/products?${p2.toString()}`
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">총 {totalCount}건</p>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">이미지</th>
              <th className="px-4 py-2 text-left text-sm font-medium">상품명</th>
              <th className="px-4 py-2 text-left text-sm font-medium">SKU</th>
              <th className="px-4 py-2 text-right text-sm font-medium">소비자가</th>
              <th className="px-4 py-2 text-right text-sm font-medium">매입가 (부가세포함)</th>
              <th className="px-4 py-2 text-center text-sm font-medium">재고</th>
              <th className="px-4 py-2 text-center text-sm font-medium">노출</th>
              <th className="px-4 py-2 text-left text-sm font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div
                    className="w-12 h-12 bg-gray-100 rounded bg-cover"
                    style={imgUrl(p.images) ? { backgroundImage: `url(${imgUrl(p.images)})` } : undefined}
                  />
                </td>
                <td className="px-4 py-2">
                  <Link href={`/admin/products/${p.id}`} className="text-blue-600 hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{p.sku ?? '-'}</td>
                <td className="px-4 py-2 text-right">{p.price != null ? p.price.toLocaleString() : '-'}</td>
                <td className="px-4 py-2 text-right">{p.wholesale_price != null ? p.wholesale_price.toLocaleString() : '-'}</td>
                <td className="px-4 py-2 text-center">{p.stock ?? '-'}</td>
                <td className="px-4 py-2 text-center">
                  <span className={p.is_active ? 'text-green-600' : 'text-gray-400'}>
                    {p.is_active ? 'O' : 'X'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/products/${p.id}/detail-page`}
                    className="mr-2 text-sm px-2 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
                  >
                    상세페이지
                  </Link>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    수정
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 justify-center">
          {page > 1 && (
            <Link
              href={pageUrl(page - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              이전
            </Link>
          )}
          <span className="px-3 py-1">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={pageUrl(page + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              다음
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
