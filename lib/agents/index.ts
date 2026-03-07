/**
 * 상품 상세페이지 에이전트 - 전체 파이프라인
 */

import { analyzeProductImage } from './product-search'
import { searchProductInfo } from './web-search'
import { extractSpecsFromSearchResults, type ProductSpecs } from './product-info'
import { suggestDesign, type DesignSuggestion } from './design-suggester'
import { generateImage } from './image-generator'
import { supabase } from '@/lib/supabase'

export type AgentResult = {
  status: 'done' | 'error'
  specs?: ProductSpecs
  designSuggestion?: DesignSuggestion
  generatedImages?: { image_01: string; image_02: string; image_03: string }
  errorMessage?: string
}

export async function runDetailPageAgent(
  productId: string,
  productName: string,
  imageBuffer: Buffer,
  onProgress?: (status: string) => void
): Promise<AgentResult> {
  try {
    onProgress?.('searching')
    const queries = await analyzeProductImage(imageBuffer, productName)
    const searchResults = await searchProductInfo(queries)

    let specs: ProductSpecs = {}
    if (searchResults) {
      specs = await extractSpecsFromSearchResults(searchResults, productName)
    } else {
      // Serper 미설정 시 Gemini로 이미지에서 추출
      const { extractSpecsFromImage } = await import('./product-info')
      specs = await extractSpecsFromImage(imageBuffer, productName)
    }

    onProgress?.('suggesting')
    const designSuggestion = await suggestDesign(productName, specs as Record<string, unknown>)

    onProgress?.('generating')
    const bucket = 'product-images'
    const prefix = `products/${productId}/detail`
    const upload = async (buf: Buffer, name: string): Promise<string> => {
      const path = `${prefix}/${name}_${Date.now()}.png`
      const { error } = await supabase.storage.from(bucket).upload(path, buf, {
        contentType: 'image/png',
        upsert: true,
      })
      if (error) throw error
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      return data.publicUrl
    }

    const [img01, img02, img03] = await Promise.all([
      generateImage(designSuggestion.image_01.prompt, 280, 280),
      generateImage(designSuggestion.image_02.prompt, 600, 600),
      generateImage(designSuggestion.image_03.prompt, 860, 1200),
    ])

    const image_01 = await upload(img01, 'search')
    const image_02 = await upload(img02, 'thumb')
    const image_03 = await upload(img03, 'detail')

    return {
      status: 'done',
      specs,
      designSuggestion,
      generatedImages: { image_01, image_02, image_03 },
    }
  } catch (err) {
    return {
      status: 'error',
      errorMessage: err instanceof Error ? err.message : '알 수 없는 오류',
    }
  }
}
