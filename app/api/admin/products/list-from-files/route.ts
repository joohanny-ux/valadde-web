import { NextRequest, NextResponse } from 'next/server'
import { getProductsForList } from '@/lib/products-file'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') ?? ''
    const brand = searchParams.get('brand') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const perPage = 20

    const all = getProductsForList({ q: q || undefined, brand: brand || undefined })
    const total = all.length
    const start = (page - 1) * perPage
    const products = all.slice(start, start + perPage)

    const brands = Array.from(new Set(all.map((p) => p.brand))).filter(Boolean).sort()

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / perPage),
      brands,
    })
  } catch (err) {
    return NextResponse.json(
      { products: [], total: 0, message: err instanceof Error ? err.message : '조회 실패' },
      { status: 500 }
    )
  }
}
