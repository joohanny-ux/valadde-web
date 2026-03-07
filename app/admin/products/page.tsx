import { supabase } from '@/lib/supabase'
import ProductList from './ProductList'
import ProductSearch from './ProductSearch'
import ProductImport from './ProductImport'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; brand?: string; category?: string; page?: string }>
}) {
  const params = await searchParams
  const q = params.q ?? ''
  const brandId = params.brand ?? ''
  const categoryId = params.category ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const perPage = 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('products')
    .select('id, name, name_en, sku, price, wholesale_price, stock, is_active, brand_id, category_id, images', { count: 'exact' })
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`name.ilike.%${q}%,name_en.ilike.%${q}%,sku.ilike.%${q}%`)
  }
  if (brandId) query = query.eq('brand_id', brandId)
  if (categoryId) query = query.eq('category_id', categoryId)

  const { data: products, count, error } = await query.range(from, to)

  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('id, name').order('display_order'),
    supabase.from('categories').select('id, name').order('display_order'),
  ])

  if (error) {
    return <p className="text-red-600">오류: {error.message}</p>
  }

  const totalPages = Math.ceil((count ?? 0) / perPage)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <ProductImport />
      </div>
      <ProductSearch
        brands={brands ?? []}
        categories={categories ?? []}
        defaultQ={q}
        defaultBrand={brandId}
        defaultCategory={categoryId}
      />
      <ProductList
        products={products ?? []}
        totalCount={count ?? 0}
        page={page}
        totalPages={totalPages}
        searchParams={params}
      />
    </div>
  )
}
