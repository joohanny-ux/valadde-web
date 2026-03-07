'use client'

import Link from 'next/link'

type Product = {
  id: string
  name: string
  name_en: string | null
  price: number | null
  promotion_price: number | null
  images: string[] | null
  brand_id: string
  category_id: string
}

export default function ProductGrid({
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
  const baseParams = new URLSearchParams(searchParams)

  function pageUrl(p: number) {
    const p2 = new URLSearchParams(baseParams)
    p2.set('page', String(p))
    return `/products?${p2.toString()}`
  }

  return (
    <div>
      <p className="text-xs text-white/60 mb-8">총 {totalCount}건</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="border border-abu-gray rounded-lg overflow-hidden hover:border-abu-pink/50 transition-colors group"
          >
            <div
              className="aspect-square bg-abu-gray bg-cover bg-center"
              style={p.images?.[0] ? { backgroundImage: `url(${p.images[0]})` } : undefined}
            />
            <div className="p-4">
              <p className="font-medium text-xs line-clamp-2 group-hover:text-abu-pink transition-colors">{p.name}</p>
              <p className="text-xs text-white/60 mt-1.5">
                {p.promotion_price != null ? (
                  <>
                    <span className="text-abu-pink">{p.promotion_price.toLocaleString()}원</span>
                    {p.price != null && (
                      <span className="line-through ml-1 text-xs text-white/50">{p.price.toLocaleString()}</span>
                    )}
                  </>
                ) : p.price != null ? (
                  `${p.price.toLocaleString()}원`
                ) : (
                  '문의'
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex gap-2 justify-center">
          {page > 1 && (
            <Link
              href={pageUrl(page - 1)}
              className="px-4 py-2 border border-abu-gray rounded hover:bg-abu-gray/30 text-white/90"
            >
              이전
            </Link>
          )}
          <span className="px-4 py-2 text-white/70">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={pageUrl(page + 1)}
              className="px-4 py-2 border border-abu-gray rounded hover:bg-abu-gray/30 text-white/90"
            >
              다음
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
