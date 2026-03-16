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
  totalCount?: number
}

type ProductGridProps = {
  products: ProductItem[]
  totalCount?: number
  page?: number
  totalPages?: number
  searchParams?: Record<string, string | undefined>
}

const text = {
  viewDetails: 'View Details',
  loadMore: 'Load More Products',
  noImage: 'No image',
}

function getImageSrc(images: ProductItem['images']) {
  if (!images) return null
  if (Array.isArray(images)) return images[0] || null
  if (typeof images === 'string') return images
  return null
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const imageSrc = getImageSrc(product.images)

          return (
            <article
              key={product.id}
              className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]"
            >
              <div className="relative">
                <div className="aspect-[4/4.5] overflow-hidden bg-neutral-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                      {text.noImage}
                    </div>
                  )}
                </div>

                <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
                  {product.category_name ? (
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-600">
                      {product.category_name}
                    </span>
                  ) : null}

                  {product.moq ? (
                    <span className="rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                      MOQ {product.moq}
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-500"
                  aria-label="Favorite"
                >
                  ♡
                </button>
              </div>

              <div className="px-4 pb-4 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                  {product.brand_name || '--'}
                </p>

                <h3 className="mt-1 text-[22px] font-semibold leading-7 tracking-tight text-neutral-900">
                  {product.name}
                </h3>

                <p className="mt-2 min-h-[44px] text-[13px] leading-6 text-neutral-500">
                  {product.short_description || product.name_en || ''}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[11px] font-medium text-neutral-400">
                  <span>{product.country_of_origin ? product.country_of_origin : 'Origin --'}</span>
                  <span>{product.moq ? `MOQ: ${product.moq}` : 'MOQ --'}</span>
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-3 text-[14px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                >
                  {text.viewDetails}
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          className="rounded-full border border-neutral-200 bg-white px-8 py-3 text-[14px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        >
          {text.loadMore}
        </button>
      </div>
    </div>
  )
}