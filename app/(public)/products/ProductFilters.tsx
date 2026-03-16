import Link from 'next/link'

type BrandItem = {
  id: string
  name: string
}

type ProductFiltersProps = {
  brands: BrandItem[]
  thirdCategories: string[]
  activeCategory1: string
  activeCategory2: string
  activeCategory3: string
  defaultQ: string
  defaultBrand: string
  defaultSort: string
  defaultView: string
  totalCount: number
  children: React.ReactNode
}

function buildHref(paramsObj: Record<string, string | undefined>) {
  const params = new URLSearchParams()

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.set(key, value)
    }
  })

  return `/products?${params.toString()}`
}

export default function ProductFilters({
  brands,
  thirdCategories,
  activeCategory1,
  activeCategory2,
  activeCategory3,
  defaultQ,
  defaultBrand,
  defaultSort,
  defaultView,
  totalCount,
  children,
}: ProductFiltersProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="border border-neutral-200 bg-white p-5">
            <h3 className="text-[15px] font-semibold text-neutral-900">{activeCategory2}</h3>

            <div className="mt-4 space-y-3 text-[14px] text-neutral-600">
              {thirdCategories.map((item) => (
                <Link
                  key={item}
                  href={buildHref({
                    q: defaultQ || undefined,
                    brand: defaultBrand || undefined,
                    c1: activeCategory1,
                    c2: activeCategory2,
                    c3: item,
                    sort: defaultSort,
                    view: defaultView,
                  })}
                  className={`block transition-colors hover:text-neutral-900 ${
                    item === activeCategory3 ? 'font-medium text-neutral-900' : ''
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-neutral-200 bg-white p-5">
            <h3 className="text-[15px] font-semibold text-neutral-900">Filters</h3>

            <div className="mt-4">
              <div className="flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[13px] text-neutral-400">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Search products...
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                Brand
              </p>
              <div className="mt-2 rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-700">
                {defaultBrand
                  ? brands.find((brand) => brand.id === defaultBrand)?.name ?? 'Selected Brand'
                  : 'All Brands'}
              </div>
            </div>

            <div className="mt-5 space-y-3 text-[13px] text-neutral-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                <span>Export Ready</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                <span>Sample Available</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                <span>Negotiable</span>
              </label>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                MOQ
              </p>
              <div className="mt-2 rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-700">
                Any MOQ
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] font-medium text-neutral-700">
              {totalCount.toLocaleString()} products found
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-[14px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Sort by: {defaultSort === 'featured' ? 'Relevance' : defaultSort}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={buildHref({
                    q: defaultQ || undefined,
                    brand: defaultBrand || undefined,
                    c1: activeCategory1,
                    c2: activeCategory2,
                    c3: activeCategory3,
                    sort: defaultSort,
                    view: undefined,
                  })}
                  aria-label="Grid view"
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-[15px] ${
                    defaultView === 'grid'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:text-neutral-700'
                  }`}
                >
                  ▦
                </Link>
                <Link
                  href={buildHref({
                    q: defaultQ || undefined,
                    brand: defaultBrand || undefined,
                    c1: activeCategory1,
                    c2: activeCategory2,
                    c3: activeCategory3,
                    sort: defaultSort,
                    view: 'list',
                  })}
                  aria-label="List view"
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-[15px] ${
                    defaultView === 'list'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:text-neutral-700'
                  }`}
                >
                  ☰
                </Link>
              </div>
            </div>
          </div>

          {children}
        </div>
      </div>
    </section>
  )
}