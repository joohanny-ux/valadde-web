'use client'

import { useRouter } from 'next/navigation'

type Brand = { id: string; name: string }
type Category = { id: string; name: string }

export default function ProductFilters({
  brands,
  categories,
  defaultQ,
  defaultBrand,
  defaultCategory,
}: {
  brands: Brand[]
  categories: Category[]
  defaultQ: string
  defaultBrand: string
  defaultCategory: string
}) {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const q = (form.q as HTMLInputElement).value
    const brand = (form.brand as HTMLSelectElement).value
    const category = (form.category as HTMLSelectElement).value

    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (brand) params.set('brand', brand)
    if (category) params.set('category', category)
    params.set('page', '1')

    router.push(`/products?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-10 text-sm">
      <input
        type="text"
        name="q"
        defaultValue={defaultQ}
        placeholder="상품명 검색"
        className="px-3 py-2 text-sm bg-abu-charcoal border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
      />
      <select
        name="brand"
        defaultValue={defaultBrand}
        className="px-3 py-2 bg-abu-charcoal border border-abu-gray rounded text-white focus:outline-none focus:border-abu-pink/50"
      >
        <option value="">전체 브랜드</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <select
        name="category"
        defaultValue={defaultCategory}
        className="px-3 py-2 bg-abu-charcoal border border-abu-gray rounded text-white focus:outline-none focus:border-abu-pink/50"
      >
        <option value="">전체 카테고리</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-abu-pink text-abu-dark rounded hover:bg-abu-pink-dark transition-colors font-medium"
      >
        검색
      </button>
    </form>
  )
}
