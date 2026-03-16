import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { getAllProductsWithMeta } from '@/lib/products-file'
import { getGeminiModel } from '@/lib/agents/gemini'
import { generateImageWithMultipleReferences } from '@/lib/agents/image-generator'

function getTemplatePath(): string | null {
  const candidates = [
    path.join(process.cwd(), 'products', 'productdetails', 'templete01.png'),
    path.join(process.cwd(), 'products', 'productdetail', 'templete01.png'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return null
}

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
      styleImage1Base64,
      styleImage2Base64,
      copywriting = '',
      designConcept = '',
      productFeatures = '',
    } = body as {
      basicImageBase64?: string
      styleImage1Base64?: string
      styleImage2Base64?: string
      copywriting?: string
      designConcept?: string
      productFeatures?: string
    }

    if (!basicImageBase64) {
      return NextResponse.json(
        { message: '먼저 기본 이미지를 생성해주세요.' },
        { status: 400 }
      )
    }

    let copyToUse = copywriting
    let conceptToUse = designConcept

    const templatePath = getTemplatePath()
    if (templatePath) {
      const templateBuf = fs.readFileSync(templatePath)
      const templateBase64 = templateBuf.toString('base64')

      const model = getGeminiModel()
      const analysisResult = await model.generateContent([
        {
          inlineData: { mimeType: 'image/png', data: templateBase64 },
        },
        `이 상세페이지 템플릿 이미지를 분석해주세요.

상품 정보:
- 브랜드: ${product.brand}
- 상품명(한): ${product.name_kr}
- 상품명(영): ${product.name_en}
- 카테고리: ${product.category_1} > ${product.category_2} > ${product.category_3}
- 용량: ${product.volume || 'N/A'}
${productFeatures ? `- 상품 특징: ${productFeatures}` : ''}

다음을 분석·제안해주세요 (모두 한국어로):
1. 템플릿 안에 넣을 카피라이트: 적절한 글자수, 짧고 임팩트 있는 문구
2. 디자인 포인트: 템플릿 폰트 위치·사이즈를 유지하면서, 이 상품에 어울리는 톤앤매너·무드·컨셉
3. 체크무늬(투명) 영역에 기본 상품 이미지를 합성할 위치·방식 제안

반드시 아래 JSON 형식으로만 응답하세요. 가격은 포함하지 마세요.
{"copywriting": "제안 카피 문구", "designConcept": "디자인 컨셉 설명 (톤앤매너, 합성 위치 등)"}`,
      ])
      const text = analysisResult.response.text()
      try {
        const json = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(json) as { copywriting?: string; designConcept?: string }
        if (!copyToUse && parsed.copywriting) copyToUse = parsed.copywriting
        if (!conceptToUse && parsed.designConcept) conceptToUse = parsed.designConcept
      } catch {
        // ignore parse error
      }
    }

    const referenceImages: string[] = []
    if (templatePath) {
      referenceImages.push(fs.readFileSync(templatePath).toString('base64'))
    }
    referenceImages.push(basicImageBase64)
    if (styleImage1Base64) referenceImages.push(styleImage1Base64)
    if (styleImage2Base64) referenceImages.push(styleImage2Base64)

    const prompt = `상품 상세페이지 이미지를 생성하세요. 860x1800 픽셀.

[요구사항 - 반드시 한국어로]
1. 첫 번째 이미지: 상세페이지 템플릿. 템플릿의 사이즈, 폰트 위치, 레이아웃 구조를 그대로 유지하세요.
2. 두 번째 이미지: 기본 상품 이미지. 체크무늬(투명)로 표시된 영역에 이 제품을 자연스럽고 고급스럽게 합성하세요.
3. 연출 이미지가 제공된 경우, 해당 무드와 톤을 참고하여 디자인을 디벨롭하세요.

상품: ${product.brand} - ${product.name_kr} (${product.name_en})
카피라이트(한국어로 표시): ${copyToUse || '제품 소개'}
디자인 컨셉: ${conceptToUse || '깔끔하고 고급스러운 톤앤매너'}
${productFeatures ? `상품 특징: ${productFeatures}` : ''}

주의:
- 가격은 넣지 마세요.
- 템플릿 형태는 유지하되, 상품 이미지·카피·상품 특징에 맞게 디자인을 발전시킵니다.
- 모든 텍스트는 반드시 한국어로 출력하세요.
- 정확히 860x1800 픽셀로 생성하세요.`

    const buf = await generateImageWithMultipleReferences(
      prompt,
      referenceImages,
      860,
      1800
    )

    return NextResponse.json({
      imageBase64: buf.toString('base64'),
      suggestedCopywriting: copyToUse,
      suggestedDesignConcept: conceptToUse,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '상세 페이지 생성 실패'
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
