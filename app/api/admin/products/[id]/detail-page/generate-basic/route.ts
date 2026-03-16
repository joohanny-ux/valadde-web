import { NextRequest, NextResponse } from 'next/server'
import { getAllProductsWithMeta } from '@/lib/products-file'
import { generateImageWithReference } from '@/lib/agents/image-generator'

const DEFAULT_PROMPT = `Create a clean product image on a pure white studio background.
Make the product sharp and clear.
Use a front-facing angle.
Keep the product shape, label, color, and packaging details as close to the original as possible.
Do not add extra objects, props, text, shadows, hands, or decorations.
Center the product in the frame.

Output a single square image, 600x600 pixels.`

const DEFAULT_NEGATIVE = `Do not change the packaging design.
Do not alter the label text.
Do not add extra objects.
Do not create a side angle.
Do not distort the shape.`

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

    const body = await request.json().catch(() => ({}))
    const {
      imageBase64,
      prompt = DEFAULT_PROMPT,
      negativePrompt = DEFAULT_NEGATIVE,
    } = body as { imageBase64?: string; prompt?: string; negativePrompt?: string }

    if (!imageBase64) {
      return NextResponse.json(
        { message: '상품 이미지가 필요합니다. products/images에서 불러온 이미지를 사용해주세요.' },
        { status: 400 }
      )
    }

    const fullPrompt = `${prompt}\n\nNegative: ${negativePrompt}`
    const buf = await generateImageWithReference(
      fullPrompt,
      imageBase64,
      600,
      600
    )
    const base64 = buf.toString('base64')
    return NextResponse.json({ imageBase64: base64 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '이미지 생성 실패'
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
