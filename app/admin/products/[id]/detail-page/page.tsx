import { notFound } from 'next/navigation'
import Link from 'next/link'
import DetailPageClient from './DetailPageClient'
import { getAllProductsWithMeta } from '@/lib/products-file'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const all = getAllProductsWithMeta()
  const product = all.find((p) => p.id === id)

  if (!product) notFound()

  return (
    <div className="max-w-4xl">
      <Link href="/admin/products/manage" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← 상품 관리
      </Link>
      <h1 className="text-xl font-bold mb-6">상세페이지 작업: {product.name_kr}</h1>
      <DetailPageClient product={product} />
    </div>
  )
}
