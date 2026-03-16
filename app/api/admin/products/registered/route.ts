import { NextRequest, NextResponse } from 'next/server'
import {
  getAllProductsWithMeta,
  addProduct,
  updateProduct,
  deleteProduct,
  setProductDisplay,
} from '@/lib/products-file'
import type { ProductRow } from '@/lib/products-file'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const q = searchParams.get('q') ?? ''
    const brand = searchParams.get('brand') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const perPage = 20

    const all = getAllProductsWithMeta({ q: q || undefined, brand: brand || undefined })
    if (id) {
      const p = all.find((x) => x.id === id)
      if (!p) return NextResponse.json({ product: null }, { status: 404 })
      return NextResponse.json({ product: p })
    }
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = addProduct(body as ProductRow & { is_display?: boolean })
    return NextResponse.json({ success: true, product })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : '등록 실패' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ success: false, message: 'id 필요' }, { status: 400 })
    const product = updateProduct(id, data)
    if (!product) return NextResponse.json({ success: false, message: '상품 없음' }, { status: 404 })
    return NextResponse.json({ success: true, product })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : '수정 실패' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, message: 'id 필요' }, { status: 400 })
    const ok = deleteProduct(id)
    if (!ok) return NextResponse.json({ success: false, message: '삭제 실패' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : '삭제 실패' },
      { status: 500 }
    )
  }
}
