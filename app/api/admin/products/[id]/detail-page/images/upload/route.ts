import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { getAllProductsWithMeta } from '@/lib/products-file'

const IMAGES_DIR = path.join(process.cwd(), 'products', 'images')
const ALLOWED_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const all = getAllProductsWithMeta()
    const product = all.find((p) => p.id === id)
    if (!product) {
      return NextResponse.json({ message: '상품 없음' }, { status: 404 })
    }

    const brand = (product.brand ?? '').trim()
    const nameEn = (product.name_en ?? '').trim()
    const baseFilename = `${brand}_${nameEn}`.trim()
    if (!baseFilename || baseFilename === '_') {
      return NextResponse.json(
        { message: '브랜드명과 상품명(영어)이 필요합니다.' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file || !file.size) {
      return NextResponse.json({ message: '이미지 파일을 업로드해주세요.' }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        { message: 'png, jpg, jpeg, webp, gif만 업로드 가능합니다.' },
        { status: 400 }
      )
    }

    const filename = `${baseFilename}${ext}`
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true })
    }
    const filePath = path.join(IMAGES_DIR, filename)
    const buf = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buf)

    return NextResponse.json({
      success: true,
      filename,
      url: `/api/admin/products/detail-images?file=${encodeURIComponent(filename)}`,
    })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '업로드 실패' },
      { status: 500 }
    )
  }
}
