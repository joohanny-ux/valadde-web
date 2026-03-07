import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductEditForm from './ProductEditForm'

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('id, name').order('display_order'),
    supabase.from('categories').select('id, name').order('display_order'),
  ])

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">← 목록</Link>
        <h1 className="text-2xl font-bold">상품 수정: {product.name}</h1>
      </div>
      <ProductEditForm
        product={product}
        brands={brands ?? []}
        categories={categories ?? []}
      />
    </div>
  )
}
