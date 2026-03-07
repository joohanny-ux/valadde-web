import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DetailPageClient from './DetailPageClient'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: product, error } = await supabase
    .from('products')
    .select('id, name, name_en, images')
    .eq('id', id)
    .single()

  if (error || !product) notFound()

  return (
    <div className="max-w-4xl">
      <Link href="/admin/products" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← 상품 목록
      </Link>
      <h1 className="text-xl font-bold mb-6">상세페이지 작업: {product.name}</h1>
      <DetailPageClient product={product} />
    </div>
  )
}
