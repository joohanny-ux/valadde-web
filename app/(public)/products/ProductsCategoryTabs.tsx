import Link from 'next/link'
import { categoryTree } from './categoryTree'

type ProductsCategoryTabsProps = {
  activeCategory1: string
  activeCategory2: string
  searchParams: {
    q?: string
    brand?: string
    c1?: string
    c2?: string
    c3?: string
    sort?: string
    view?: string
  }
}

function buildHref(
  nextParams: Record<string, string | undefined>,
  currentParams: ProductsCategoryTabsProps['searchParams']
) {
  const params = new URLSearchParams()

  const merged = {
    q: currentParams.q,
    brand: currentParams.brand,
    c1: currentParams.c1,
    c2: currentParams.c2,
    c3: currentParams.c3,
    sort: currentParams.sort,
    view: currentParams.view,
    ...nextParams,
  }

  Object.entries(merged).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.set(key, value)
    }
  })

  return `/products?${params.toString()}`
}

export default function ProductsCategoryTabs({
  activeCategory1,
  activeCategory2,
  searchParams,
}: ProductsCategoryTabsProps) {
  const category1List = Object.keys(categoryTree)
  const category2List = Object.keys(categoryTree[activeCategory1] ?? {})

  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-8 text-[18px] font-medium">
          {category1List.map((category1) => (
            <Link
              key={category1}
              href={buildHref(
                {
                  c1: category1,
                  c2: Object.keys(categoryTree[category1])[0] ?? 'ALL',
                  c3: 'ALL',
                },
                searchParams
              )}
              className={`transition-colors ${
                category1 === activeCategory1
                  ? 'text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {category1}
            </Link>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {category2List.map((category2) => (
            <Link
              key={category2}
              href={buildHref(
                {
                  c1: activeCategory1,
                  c2: category2,
                  c3: 'ALL',
                },
                searchParams
              )}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                category2 === activeCategory2
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {category2}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}