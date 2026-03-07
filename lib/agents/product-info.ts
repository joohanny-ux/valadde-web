import { withModelFallback } from './gemini'

export type ProductSpecs = {
  Brand?: string
  'Item Volume'?: string
  'Active Ingredients'?: string
  'About this item'?: string
  'Age Range Description'?: string
  'Item Form'?: string
  'Target Use Body Part'?: string
  'Country as Labeled'?: string
  'Number per Carton'?: string
}

export async function extractSpecsFromSearchResults(
  searchResults: string,
  productName: string
): Promise<ProductSpecs> {
  return await withModelFallback(async (model) => {
  const result = await model.generateContent(`
다음은 "${productName}" 제품에 대한 웹 검색 결과입니다. 
검색 결과에서 아래 필드에 해당하는 정보를 추출해 JSON으로 반환해주세요.
없는 필드는 생략하세요. JSON만 출력하세요.

필드: Brand, Item Volume, Active Ingredients, About this item, Age Range Description, 
Item Form, Target Use Body Part, Country as Labeled, Number per Carton

검색 결과:
${searchResults.slice(0, 15000)}
`)

  const text = result.response.text()
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try {
      return JSON.parse(match[0]) as ProductSpecs
    } catch {
      return {}
    }
  }
  return {}
  })
}

/** Serper 미설정 시: 이미지 + 상품명으로 스펙 추출 */
export async function extractSpecsFromImage(
  imageBuffer: Buffer,
  productName: string
): Promise<ProductSpecs> {
  return await withModelFallback(async (model) => {
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/png',
        data: imageBuffer.toString('base64'),
      },
    },
    `이 화장품 이미지와 제품명 "${productName}"을 기반으로 다음 필드를 추측해 JSON으로 반환하세요.
없는 필드는 생략. JSON만 출력.
필드: Brand, Item Volume, Active Ingredients, About this item, Age Range Description, 
Item Form, Target Use Body Part, Country as Labeled, Number per Carton`,
  ])

  const text = result.response.text()
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try {
      return JSON.parse(match[0]) as ProductSpecs
    } catch {
      return {}
    }
  }
  return {}
  })
}
