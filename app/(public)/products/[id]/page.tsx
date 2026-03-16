import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type ProductDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

function getImageSrc(images: string[] | string | null | undefined) {
  if (!images) return null
  if (Array.isArray(images)) return images[0] || null
  if (typeof images === 'string') return images
  return null
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      name_en,
      short_description,
      description,
      images,
      brand_id,
      category_id,
      price,
      promotion_price,
      moq,
      country_of_origin,
      is_active
    `
    )
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  const [{ data: brand }, { data: category }] = await Promise.all([
    supabase.from('brands').select('id, name').eq('id', product.brand_id).single(),
    supabase.from('categories').select('id, name').eq('id', product.category_id).single(),
  ])

  const imageSrc = getImageSrc(product.images)

  const text = {
    backHref: '/products',
    closeLabel: 'Close',
    supplyPrice: 'SUPPLY PRICE',
    moq: 'MOQ',
    exportReadiness: 'EXPORT READINESS',
    sampleAvailability: 'SAMPLE AVAILABILITY',
    countryOfOrigin: 'COUNTRY OF ORIGIN',
    leadTime: 'LEAD TIME',
    requestSample: 'Request Sample',
    inquire: 'Inquire / Negotiate',
    contactUs: 'Contact Us',
    unknown: '--',
    leadTimeValue: '14-21 Days',
  }

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-4 py-10 lg:px-10 lg:py-12">
        <div className="w-full max-w-[960px] overflow-hidden rounded-[20px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left Image Panel */}
            <div className="relative bg-neutral-100">
              <div className="relative aspect-[4/5] h-full min-h-[360px] w-full">
                {imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageSrc} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Right Info Panel */}
            <div className="relative px-6 py-7 lg:px-10 lg:py-9">
              <Link
                href={text.backHref}
                aria-label={text.closeLabel}
                className="absolute right-8 top-8 inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <span className="text-[30px] leading-none">×</span>
              </Link>

              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                {brand?.name || text.unknown}
              </p>

              <h1 className="mt-3 max-w-[480px] text-[30px] font-semibold leading-[1.2] tracking-tight text-neutral-900 lg:text-[34px]">
                {product.name}
              </h1>

              <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-neutral-600">
                {product.short_description ||
                  product.description ||
                  product.name_en ||
                  text.unknown}
              </p>

              <div className="my-7 border-t border-neutral-200" />

              <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {text.supplyPrice}
                  </p>
                  <p className="mt-2 text-[16px] font-semibold text-neutral-900">
                    {product.price ? `$${product.price}` : text.contactUs}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {text.moq}
                  </p>
                  <p className="mt-2 text-[16px] font-semibold text-neutral-900">
                    {product.moq ? product.moq.toLocaleString() : text.unknown}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {text.exportReadiness}
                  </p>
                  <p className="mt-2 text-[16px] font-semibold text-neutral-900">
                    {text.unknown}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {text.sampleAvailability}
                  </p>
                  <p className="mt-2 text-[16px] font-semibold text-neutral-900">
                    {text.unknown}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {text.countryOfOrigin}
                  </p>
                  <p className="mt-2 text-[16px] font-semibold text-neutral-900">
                    {product.country_of_origin || text.unknown}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {text.leadTime}
                  </p>
                  <p className="mt-2 text-[16px] font-semibold text-neutral-900">
                    {text.leadTimeValue}
                  </p>
                </div>
              </div>

              <div className="my-7 border-t border-neutral-200" />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-full border border-neutral-200 bg-white px-7 text-[15px] font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
                >
                  {text.requestSample}
                </button>

                <button
                  type="button"
                  className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-7 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {text.inquire}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}