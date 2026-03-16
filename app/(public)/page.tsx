import Link from 'next/link'
import { Search, ShoppingBag, MessageCircle, FileCheck, Truck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type LandingProduct = {
  id: string
  name: string
  short_description: string | null
  images: string[] | null
  brand_id: string
  moq: number | null
}

export default async function HomePage() {
  const text = {
    eyebrow: 'ABU Commercial Hub',
    title: 'Discover products. Negotiate directly. Order with clarity.',
    subtitle:
      'The premium commerce hub for creators and buyers. Connect with verified brands, source trending beauty, and manage your trades in one place.',
    searchPlaceholder: 'Search brands and products...',
    primaryCta: 'Start Product Search',
    creatorCta: 'Join as a Creator',
    buyerCta: 'Join as a Buyer',
    cardTitle: 'Premium Product Discovery',
    cardSubtitle: 'Explore brands and prepare deals in one place.',
    processTitle: 'How It Works',
    processSteps: [
      {
        title: 'Search',
        desc: 'Find vetted products matched to your market.',
        icon: Search,
      },
      {
        title: 'Select',
        desc: 'Build your assortment and define quantity needs.',
        icon: ShoppingBag,
      },
      {
        title: 'Negotiate',
        desc: 'Request deals, samples, or bulk pricing directly.',
        icon: MessageCircle,
      },
      {
        title: 'Confirm',
        desc: 'Review quotation, terms, and digital agreement.',
        icon: FileCheck,
      },
      {
        title: 'Delivery',
        desc: 'Complete payment and track global fulfillment.',
        icon: Truck,
      },
    ],
    featuredTitle: 'Featured Products',
    featuredSubtitle: 'Preview a few of the products currently available on ABU Commercial Hub.',
    featuredEmpty: 'Products will appear here after you import them from the admin.',
    ctaTitle: 'Move Faster, Start Now',
    ctaSubtitle: 'Join the ABU Commercial Hub to discover, request, and transact seamlessly.',
    secondaryCta: 'Contact Us',
  }

  const { data: products } = await supabase
    .from('products')
    .select('id, name, short_description, images, brand_id, moq')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const landingProducts = (products ?? []) as LandingProduct[]

  return (
    <main className="bg-white text-neutral-900">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm font-medium text-neutral-700">
              {text.eyebrow}
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              {text.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              {text.subtitle}
            </p>

            <div className="mt-8 max-w-xl rounded-[28px] border border-neutral-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3 rounded-full bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>{text.searchPlaceholder}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
              >
                {text.primaryCta}
              </Link>

              <Link
                href="/signup"
                className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
              >
                {text.creatorCta}
              </Link>

              <Link
                href="/signup"
                className="rounded-full px-2 py-3 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
              >
                {text.buyerCta}
              </Link>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-[36px] border border-neutral-200 bg-neutral-50 shadow-sm">
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=900&h=1100')",
                }}
              >
                <div className="flex h-full items-end bg-gradient-to-t from-black/35 via-black/10 to-transparent p-6">
                  <div className="rounded-3xl bg-white/90 px-5 py-4 text-sm text-neutral-700 shadow-sm backdrop-blur">
                    <p className="font-medium text-neutral-900">{text.cardTitle}</p>
                    <p className="mt-1">{text.cardSubtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
                {text.featuredTitle}
              </h2>
              <p className="mt-2 text-sm text-neutral-600">{text.featuredSubtitle}</p>
            </div>
            <Link
              href="/products"
              className="hidden rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 lg:inline-flex"
            >
              View All Products
            </Link>
          </div>

          {landingProducts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/60 px-6 py-10 text-center text-sm text-neutral-500">
              {text.featuredEmpty}
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {landingProducts.map((p) => {
                const image = p.images?.[0]
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                        {p.brand_id}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900">
                        {p.name}
                      </h3>
                      {p.short_description && (
                        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-neutral-600">
                          {p.short_description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between text-[12px] text-neutral-500">
                        <span>{p.moq ? `MOQ ${p.moq}` : 'Negotiable'}</span>
                        <span className="text-neutral-400">View details →</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-neutral-900">
              {text.processTitle}
            </h2>
            <p className="mt-4 text-neutral-600">{text.processSubtitle}</p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-5">
            {text.processSteps.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="rounded-[32px] border border-neutral-200 bg-white px-8 py-14 text-center shadow-sm">
            <h2 className="text-4xl font-semibold tracking-tight text-neutral-900">
              {text.ctaTitle}
            </h2>
            <p className="mt-4 text-neutral-600">{text.ctaSubtitle}</p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
              >
                {text.primaryCta}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-800"
              >
                {text.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}