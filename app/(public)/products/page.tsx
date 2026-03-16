import { supabase } from '@/lib/supabase'
import ProductGrid from './ProductGrid'
import ProductList from './ProductList'
import ProductFilters from './ProductFilters'
import ProductsCategoryTabs from './ProductsCategoryTabs'
import { categoryTree } from './categoryTree'

// 새로 업로드된 상품이 바로 노출되도록 캐시 사용 안 함
export const dynamic = 'force-dynamic'
export const revalidate = 0

type ProductsSearchParams = Promise<{
  q?: string
  brand?: string
  c1?: string
  c2?: string
  c3?: string
  page?: string
  view?: string
  sort?: string
}>

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams
}) {
  const params = await searchParams

  const q = params.q?.trim() ?? ''
  const brandId = params.brand ?? ''
  const activeCategory1 = params.c1 ?? 'COSMETICS'
  const activeCategory2 =
    params.c2 ?? Object.keys(categoryTree[activeCategory1] ?? {})[0] ?? 'ALL'
  const activeCategory3 = params.c3 ?? 'ALL'
  const view = params.view === 'list' ? 'list' : 'grid'
  const sort = params.sort ?? 'featured'
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)

  const perPage = 24
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const [{ data: brands, error: brandsError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabase.from('brands').select('id, name').eq('is_active', true).order('display_order'),
      supabase.from('categories').select('id, name').eq('is_active', true).order('display_order'),
    ])

  if (brandsError) {
    return (
      <div className="bg-white px-6 py-14 lg:px-10">
        <p className="text-red-600">브랜드 조회 오류: {brandsError.message}</p>
      </div>
    )
  }

  if (categoriesError) {
    return (
      <div className="bg-white px-6 py-14 lg:px-10">
        <p className="text-red-600">카테고리 조회 오류: {categoriesError.message}</p>
      </div>
    )
  }

  const category2Map = categoryTree[activeCategory1] ?? {}
  const thirdCategories = category2Map[activeCategory2] ?? ['ALL']

  // category-3 이름과 DB category.name 매핑
  const matchedCategory =
    activeCategory3 && activeCategory3 !== 'ALL'
      ? (categories ?? []).find((category) => category.name === activeCategory3)
      : null

  const matchedCategoryId = matchedCategory?.id ?? ''

  let query = supabase
    .from('products')
    .select(
      `
        id,
        name,
        name_en,
        price,
        promotion_price,
        images,
        brand_id,
        category_id,
        short_description,
        moq,
        country_of_origin,
        created_at,
        display_order
      `,
      { count: 'exact' }
    )
    .eq('is_active', true)

  if (q) {
    query = query.or(`name.ilike.%${q}%,name_en.ilike.%${q}%`)
  }

  if (brandId) {
    query = query.eq('brand_id', brandId)
  }

  if (matchedCategoryId) {
    query = query.eq('category_id', matchedCategoryId)
  }

  if (sort === 'latest') {
    query = query.order('created_at', { ascending: false })
  } else if (sort === 'price-asc') {
    query = query.order('price', { ascending: true, nullsFirst: false })
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false, nullsFirst: false })
  } else {
    query = query
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
  }

  const { data: products, count, error: productsError } = await query.range(from, to)

  if (productsError) {
    return (
      <div className="bg-white px-6 py-14 lg:px-10">
        <p className="text-red-600">상품 조회 오류: {productsError.message}</p>
      </div>
    )
  }

  const brandMap = new Map((brands ?? []).map((brand) => [brand.id, brand.name]))
  const categoryMap = new Map((categories ?? []).map((category) => [category.id, category.name]))

  const normalizedProducts =
    products?.map((product) => ({
      ...product,
      brand_name: brandMap.get(product.brand_id) || '',
      category_name: categoryMap.get(product.category_id) || '',
    })) ?? []

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

  return (
    <div className="min-h-screen bg-neutral-50">
      <ProductsCategoryTabs
        activeCategory1={activeCategory1}
        activeCategory2={activeCategory2}
        searchParams={{
          q,
          brand: brandId,
          c1: activeCategory1,
          c2: activeCategory2,
          c3: activeCategory3,
          sort,
          view,
        }}
      />

      <ProductFilters
        brands={brands ?? []}
        thirdCategories={thirdCategories}
        activeCategory1={activeCategory1}
        activeCategory2={activeCategory2}
        activeCategory3={activeCategory3}
        defaultQ={q}
        defaultBrand={brandId}
        defaultSort={sort}
        defaultView={view}
        totalCount={totalCount}
      >
        {view === 'list' ? (
          <ProductList products={normalizedProducts} />
        ) : (
          <ProductGrid
            products={normalizedProducts}
            totalCount={totalCount}
            page={page}
            totalPages={totalPages}
            searchParams={params}
          />
        )}
      </ProductFilters>
    </div>
  )
}