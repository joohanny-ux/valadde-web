import { NextRequest, NextResponse } from 'next/server'
import * as path from 'path'
import { getAllProductsWithMeta } from '@/lib/products-file'
import { hideImage } from '@/lib/product-page-hidden-images'

function isAllowedFile(filename: string, brand: string, nameEn: string): boolean {
  const exactBase = `${brand}_${nameEn}`.trim()
  if (!exactBase || exactBase === '_') return false
  return path.basename(filename, path.extname(filename)) === exactBase
}

/** 페이지에서만 숨김. 폴더 내 파일은 유지됨 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const file = request.nextUrl.searchParams.get('file')
    if (!file || file.includes('..') || file.includes('/') || file.includes('\\')) return NextResponse.json({ message: '잘못된 파일명' }, { status: 400 })
    const all = getAllProductsWithMeta()
    const product = all.find((p) => p.id === id)
    if (!product) return NextResponse.json({ message: '상품 없음' }, { status: 404 })
    const brand = (product.brand ?? '').trim()
    const nameEn = (product.name_en ?? '').trim()
    if (!isAllowedFile(file, brand, nameEn)) return NextResponse.json({ message: '해당 상품의 이미지가 아닙니다.' }, { status: 403 })
    hideImage(id, file)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : '실패' }, { status: 500 })
  }
}
