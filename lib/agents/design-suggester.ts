import { withModelFallback } from './gemini'

export type DesignSuggestion = {
  image_01: { copy: string; designNotes: string; prompt: string }
  image_02: { copy: string; designNotes: string; prompt: string }
  image_03: { copy: string; designNotes: string; prompt: string }
}

export async function suggestDesign(
  productName: string,
  specs: Record<string, unknown>
): Promise<DesignSuggestion> {
  return await withModelFallback(async (model) => {
  const result = await model.generateContent(`
화장품 상품 "${productName}"의 상세페이지 이미지를 생성하기 위한 제안을 해주세요.
상품 스펙: ${JSON.stringify(specs)}

다음 3가지 이미지용으로 각각:
1. image_01 (280x280): 상품 검색 페이지용 - 정사각형, 흰 배경, 제품 단독 샷
2. image_02 (600x600): 썸네일용 - 정사각형, 제품 강조
3. image_03 (860x1800): 상세페이지 본문용 - 세로 롱 이미지, 브랜드 느낌

각 이미지에 대해 { copy, designNotes, prompt }를 영어 prompt 형식으로 만들어주세요.
prompt는 이미지 생성 AI(Flux/Pollinations)에 넣을 문구입니다. 50~80 단어, 영어로.
다음 JSON 형식만 출력하세요:
{"image_01":{"copy":"","designNotes":"","prompt":""},"image_02":{"copy":"","designNotes":"","prompt":""},"image_03":{"copy":"","designNotes":"","prompt":""}}
`)

  const text = result.response.text()
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try {
      return JSON.parse(match[0]) as DesignSuggestion
    } catch {
      return getDefaultSuggestion(productName)
    }
  }
  return getDefaultSuggestion(productName)
  })
}

function getDefaultSuggestion(productName: string): DesignSuggestion {
  const base = `Professional K-beauty ${productName} product photography`
  return {
    image_01: {
      copy: '',
      designNotes: '280x280, white background',
      prompt: `${base}, white background, square, clean, minimal, e-commerce`,
    },
    image_02: {
      copy: '',
      designNotes: '600x600, product focus',
      prompt: `${base}, square format, soft lighting, premium cosmetic product shot`,
    },
    image_03: {
      copy: '',
      designNotes: '860x1800, vertical banner',
      prompt: `${base}, vertical banner, elegant, luxury skincare, minimalist design`,
    },
  }
}
