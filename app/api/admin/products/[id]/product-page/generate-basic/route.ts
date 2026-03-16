import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'
import { getAllProductsWithMeta } from '@/lib/products-file'
import { generateImageWithReference } from '@/lib/agents/image-generator'

const PRODUCED_DIR = path.join(process.cwd(), 'products', 'images', 'produced')

/** 배경을 순백(#FFFFFF)으로 교체 - R,G,B 모두 threshold 이상인 픽셀 */
async function whitenBackground(inputBuffer: Buffer, threshold = 248): Promise<Buffer> {
  const img = sharp(inputBuffer)
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!
    const g = data[i + 1]!
    const b = data[i + 2]!
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
    }
  }
  return sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()
}

const DEFAULT_PROMPT = `Create a clean product image on a pure white (#FFFFFF) studio background.
Make the product sharp and clear.
Use a front-facing angle.
Keep the product shape, label, color, and packaging details as close to the original as possible.
Do not add extra objects, props, text, hands, or decorations.
Center the product in the frame.
Change the entire background to solid pure white #FFFFFF. The background must be completely flat white with zero shadows, gradients, or color variation.`

const DEFAULT_NEGATIVE = `Do not change the packaging design.
Do not alter the label text.
Do not add extra objects.
Do not create a side angle.
Do not distort the shape.
Do not add shadows on the background.
No grey or off-white background.
No gradients on the background.`

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const all = getAllProductsWithMeta()
    const product = all.find((p) => p.id === id)
    if (!product) return NextResponse.json({ message: '상품 없음' }, { status: 404 })
    const brand = (product.brand ?? '').trim()
    const nameEn = (product.name_en ?? '').trim()
    const baseFilename = `${brand}_${nameEn}_basic.png`.replace(/[<>:"/\\|?*]/g, '_')
    if (!baseFilename || baseFilename === '_basic.png') return NextResponse.json({ message: '브랜드명과 상품명(영어)이 필요합니다.' }, { status: 400 })
    const body = await request.json().catch(() => ({}))
    const { imageBase64, prompt = DEFAULT_PROMPT, negativePrompt = DEFAULT_NEGATIVE } = body as { imageBase64?: string; prompt?: string; negativePrompt?: string }
    if (!imageBase64) return NextResponse.json({ message: '상품 이미지가 필요합니다.' }, { status: 400 })
    const fullPrompt = `${prompt}\n\nNegative: ${negativePrompt}`
    const generated = await generateImageWithReference(fullPrompt, imageBase64, 600, 600)
    const buf = await whitenBackground(generated)
    if (!fs.existsSync(PRODUCED_DIR)) fs.mkdirSync(PRODUCED_DIR, { recursive: true })
    fs.writeFileSync(path.join(PRODUCED_DIR, baseFilename), buf)
    return NextResponse.json({ imageBase64: buf.toString('base64') })
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : '이미지 생성 실패' }, { status: 500 })
  }
}
