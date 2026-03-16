import { NextResponse } from 'next/server'
import { getPublishedProductPages } from '@/lib/product-pages'
import { getAllProductsWithMeta } from '@/lib/products-file'

export async function GET() {
  try {
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
    return NextResponse.json({ products })
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : '조회 실패' }, { status: 500 })
  }
}
