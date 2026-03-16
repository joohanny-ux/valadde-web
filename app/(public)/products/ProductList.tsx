'use client'

import Link from 'next/link'

type ProductItem = {
  id: string
  name: string
  name_en?: string | null
  brand_name?: string
  category_name?: string
  short_description?: string | null
  price?: number | null
  promotion_price?: number | null
  images?: string[] | string | null
  moq?: number | null
  country_of_origin?: string | null
}

type ProductListProps = {
  products: ProductItem[]
}

const text = {
  viewDetails: 'View Details',
  noImage: 'No image',
  origin: 'Origin',
  moq: 'MOQ',
  export: 'Export',
  sample: 'Sample',
  negotiable: 'Negotiable',
  unknown: '--',
}

function getImageSrc(images: ProductItem['images']) {
  if (!images) return null
  if (Array.isArray(images)) return images[0] || null
  if (typeof images === 'string') return images
  return null
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="space-y-4">
      {products.map((product) => {
        const imageSrc = getImageSrc(product.images)

        return (
          <article
            key={product.id}
            className="grid grid-cols-[84px_minmax(0,1fr)_180px] items-center gap-5 rounded-[18px] border border-neutral-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.03)]"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-[12px] bg-neutral-100">
              <div className="aspect-square w-[84px]">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[12px] text-neutral-400">
                    {text.noImage}
                  </div>
                )}
              </div>
            </div>

            {/* Main Info */}
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                {product.brand_name || text.unknown}
              </p>

              <h3 className="mt-1 truncate text-[20px] font-semibold leading-7 tracking-tight text-neutral-900">
                {product.name}
              </h3>

              <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-neutral-500">
                {product.short_description || product.name_en || ''}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-400">{text.origin}</span>
                  <span className="font-medium text-neutral-700">
                    {product.country_of_origin || text.unknown}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-400">{text.moq}</span>
                  <span className="font-medium text-neutral-700">
                    {product.moq ? product.moq.toLocaleString() : text.negotiable}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-400">{text.export}</span>
                  <span className="font-medium text-neutral-700">{text.unknown}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-400">{text.sample}</span>
                  <span className="font-medium text-neutral-700">{text.unknown}</span>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 transition-colors hover:text-neutral-700"
                aria-label="Favorite"
              >
                ♡
              </button>

              <Link
                href={`/products/${product.id}`}
                className="inline-flex min-w-[118px] items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-[14px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                {text.viewDetails}
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}