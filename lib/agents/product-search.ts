import { withModelFallback } from './gemini'

export async function analyzeProductImage(
  imageBuffer: Buffer,
  productName: string
): Promise<string[]> {
  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: imageBuffer.toString('base64'),
    },
  }

  return await withModelFallback(async (model) => {
  const result = await model.generateContent([
    imagePart,
    `이 화장품/뷰티 제품 이미지를 분석해주세요. 제품명: ${productName}
다음과 같은 상품 상세 정보를 웹에서 검색할 수 있는 영어 검색어 3개를 JSON 배열로만 응답해주세요.
예: ["brand name product name", "product name ingredients", "product name amazon"]
JSON만 출력하고 다른 설명은 하지 마세요.`,
  ])

  const text = result.response.text()
  const match = text.match(/\[[\s\S]*?\]/)
  if (match) {
    try {
      const arr = JSON.parse(match[0]) as string[]
      return Array.isArray(arr) ? arr.slice(0, 3) : [productName]
    } catch {
      return [productName]
    }
  }
  return [productName]
  })
}
