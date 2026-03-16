import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { getAllProductsWithMeta } from '@/lib/products-file'

const IMAGES_DIR = path.join(process.cwd(), 'products', 'images')

function isAllowedFile(filename: string, brand: string, nameEn: string): boolean {
  const exactBase = `${brand}_${nameEn}`.trim()
  if (!exactBase || exactBase === '_') return false
  const base = path.basename(filename, path.extname(filename))
  return base === exactBase
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const file = request.nextUrl.searchParams.get('file')
    if (!file || file.includes('..') || file.includes('/') || file.includes('\\')) {
      return NextResponse.json({ message: '잘못된 파일명' }, { status: 400 })
    }

    const all = getAllProductsWithMeta()
    const product = all.find((p) => p.id === id)
    if (!product) {
      return NextResponse.json({ message: '상품 없음' }, { status: 404 })
    }

    const brand = (product.brand ?? '').trim()
    const nameEn = (product.name_en ?? '').trim()
    if (!isAllowedFile(file, brand, nameEn)) {
      return NextResponse.json({ message: '해당 상품의 이미지가 아닙니다.' }, { status: 403 })
    }

    const filePath = path.join(IMAGES_DIR, file)
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return NextResponse.json({ message: '파일을 찾을 수 없습니다.' }, { status: 404 })
    }

    fs.unlinkSync(filePath)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '삭제 실패' },
      { status: 500 }
    )
  }
}
