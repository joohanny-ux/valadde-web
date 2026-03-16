import Link from 'next/link'
import CatalogClient from './CatalogClient'
import { getPublishedProductPages } from '@/lib/product-pages'
import { getAllProductsWithMeta } from '@/lib/products-file'

export default async function ProductCatalogPage() {
  const published = getPublishedProductPages()
  const all = getAllProductsWithMeta()
  const products = published.map((p) => {
    const product = all.find((x) => x.id === p.productId)
    return {
      ...p,
      name_kr: product?.name_kr ?? p.productInfo.name_kr,
      name_en: product?.name_en ?? p.productInfo.name_en,
      brand: product?.brand ?? p.productInfo.brand,
    }
  })

  return (
    <div className="max-w-5xl">
      <Link href="/admin/products/manage" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← 상품 관리
      </Link>
      <h1 className="text-xl font-bold mb-6">상품 페이지 (게시된 상품)</h1>
      <p className="text-sm text-gray-500 mb-4">
        상품을 클릭하면 팝업으로 상품 정보를 볼 수 있습니다.
      </p>
      <CatalogClient products={products} />
    </div>
  )
}
