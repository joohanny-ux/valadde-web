import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { publishProductPage } from '@/lib/product-pages'
import { getAllProductsWithMeta } from '@/lib/products-file'

const PRODUCED_DIR = path.join(process.cwd(), 'products', 'images', 'produced')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { productId, productInfo } = body as {
      productId?: string
      productInfo?: { brand: string; category_1: string; category_2: string; category_3: string; name_kr: string; name_en: string; volume: string; msrp: number | null }
    }
    if (!productId || !productInfo) {
      return NextResponse.json({ message: 'productId, productInfo 필요' }, { status: 400 })
    }
    const all = getAllProductsWithMeta()
    const product = all.find((p) => p.id === productId)
    if (!product) return NextResponse.json({ message: '상품 없음' }, { status: 404 })
    const brand = (productInfo.brand ?? '').trim()
    const nameEn = (productInfo.name_en ?? '').trim()
    const filename = `${brand}_${nameEn}_basic.png`.replace(/[<>:"/\\|?*]/g, '_')
    const filePath = path.join(PRODUCED_DIR, filename)
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return NextResponse.json({ message: '먼저 기본 이미지를 생성해주세요.' }, { status: 400 })
    }
    const buf = fs.readFileSync(filePath)
    const basicImageBase64 = buf.toString('base64')
    publishProductPage(productId, { productId, basicImageBase64, productInfo })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : '게시 실패' }, { status: 500 })
  }
}
