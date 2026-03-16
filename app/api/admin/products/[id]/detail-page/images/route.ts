import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { getAllProductsWithMeta } from '@/lib/products-file'

const IMAGES_DIR = path.join(process.cwd(), 'products', 'images')
const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

/** 상품정보와 정확히 일치하는 이미지: 브랜드명_상품명영어 */
function findExactMatch(brand: string, nameEn: string): Array<{ name: string; mtime: number }> {
  if (!fs.existsSync(IMAGES_DIR)) return []
  const exactBase = `${brand}_${nameEn}`.trim()
  if (!exactBase || exactBase === '_') return []
  const files = fs.readdirSync(IMAGES_DIR)
  const out: Array<{ name: string; mtime: number }> = []
  for (const f of files) {
    const ext = path.extname(f).toLowerCase()
    if (!IMAGE_EXT.includes(ext)) continue
    const base = path.basename(f, ext)
    if (base === exactBase) {
      const fp = path.join(IMAGES_DIR, f)
      const stat = fs.statSync(fp)
      out.push({ name: f, mtime: stat.mtimeMs })
    }
  }
  return out
}

export async function GET(
  _request: NextRequest,
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
    const matching = findExactMatch(brand, nameEn)
    const expectedFilename = `${brand}_${nameEn}`.trim()

    const images = matching.map(({ name, mtime }) => ({
      name,
      url: `/api/admin/products/detail-images?file=${encodeURIComponent(name)}&v=${mtime}`,
    }))

    return NextResponse.json({ images, expectedFilename })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '조회 실패' },
      { status: 500 }
    )
  }
}
