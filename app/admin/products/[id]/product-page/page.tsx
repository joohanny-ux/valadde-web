import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductPageClient from './ProductPageClient'
import { getAllProductsWithMeta } from '@/lib/products-file'

export default async function ProductPageWorkPage({
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
      <h1 className="text-xl font-bold mb-6">상품 정보 페이지: {product.name_kr}</h1>
      <ProductPageClient product={product} />
    </div>
  )
}
