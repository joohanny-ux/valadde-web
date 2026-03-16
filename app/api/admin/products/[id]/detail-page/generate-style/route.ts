import { NextRequest, NextResponse } from 'next/server'
import { getAllProductsWithMeta } from '@/lib/products-file'
import { generateImageWithReference } from '@/lib/agents/image-generator'

const STYLE_1_PROMPT = `Create a lifestyle product image. 
Analyze the product category and characteristics.
Show the product in a clean, creative lifestyle setting that matches the product.
Make it appealing and professional.
Output a square 600x600 image.`

const STYLE_2_PROMPT = `Create a product usage image.
Analyze the product information, category, and target use/body part.
Include hand model or person model using the product in a realistic setting.
Show the usage context as background.
Output a square 600x600 image.`

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
      basicImageBase64,
      productFeatures = '',
      style1Prompt = STYLE_1_PROMPT,
      style2Prompt = STYLE_2_PROMPT,
    } = body as {
      basicImageBase64?: string
      productFeatures?: string
      style1Prompt?: string
      style2Prompt?: string
    }

    if (!basicImageBase64) {
      return NextResponse.json(
        { message: '먼저 기본 이미지를 생성해주세요.' },
        { status: 400 }
      )
    }

    const features = productFeatures ? `\nProduct features: ${productFeatures}` : ''
    const cat = [product.category_1, product.category_2, product.category_3].filter(Boolean).join(', ')
    const context = `Product: ${product.brand} - ${product.name_en}. Categories: ${cat || 'N/A'}.${features}`

    const [buf1, buf2] = await Promise.all([
      generateImageWithReference(
        `${style1Prompt}\n\n${context}`,
        basicImageBase64,
        600,
        600
      ),
      generateImageWithReference(
        `${style2Prompt}\n\n${context}`,
        basicImageBase64,
        600,
        600
      ),
    ])

    return NextResponse.json({
      image1Base64: buf1.toString('base64'),
      image2Base64: buf2.toString('base64'),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '연출 이미지 생성 실패'
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
