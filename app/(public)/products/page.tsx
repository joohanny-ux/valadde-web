import { supabase } from '@/lib/supabase'
import ProductGrid from './ProductGrid'
import ProductFilters from './ProductFilters'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; brand?: string; category?: string; page?: string }>
}) {
  const params = await searchParams
  const q = params.q ?? ''
  const brandId = params.brand ?? ''
  const categoryId = params.category ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const perPage = 24
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('products')
    .select('id, name, name_en, price, promotion_price, images, brand_id, category_id', { count: 'exact' })
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`name.ilike.%${q}%,name_en.ilike.%${q}%`)
  }
  if (brandId) query = query.eq('brand_id', brandId)
  if (categoryId) query = query.eq('category_id', categoryId)

  const { data: products, count, error } = await query.range(from, to)

  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('id, name').eq('is_active', true).order('display_order'),
    supabase.from('categories').select('id, name').eq('is_active', true).order('display_order'),
  ])

  if (error) {
    return <p className="text-abu-pink p-4">오류: {error.message}</p>
  }

  const totalPages = Math.ceil((count ?? 0) / perPage)

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="font-serif text-xl md:text-2xl font-bold mb-10">상품</h1>
      <ProductFilters
        brands={brands ?? []}
        categories={categories ?? []}
        defaultQ={q}
        defaultBrand={brandId}
        defaultCategory={categoryId}
      />
      <ProductGrid
        products={products ?? []}
        totalCount={count ?? 0}
        page={page}
        totalPages={totalPages}
        searchParams={params}
      />
    </div>
  )
}
