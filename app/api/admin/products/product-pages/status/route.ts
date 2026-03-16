import { NextRequest, NextResponse } from 'next/server'
import { getProductPage } from '@/lib/product-pages'

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId')
    if (!productId) return NextResponse.json({ published: false })
    const page = getProductPage(productId)
    return NextResponse.json({ published: !!page?.publishedAt, data: page ?? null })
  } catch {
    return NextResponse.json({ published: false })
  }
}
