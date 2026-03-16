/**
 * 이미지 생성 - Gemini 2.5 Flash Image
 * Google AI Studio 키 사용
 */

const KEY = process.env.GOOGLE_AI_API_KEY
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'

export async function generateImage(
  prompt: string,
  _width: number,
  _height: number
): Promise<Buffer> {
  return generateImageWithReference(prompt, null, _width, _height)
}

/** 참조 이미지를 기반으로 새 이미지 생성 (image-to-image) */
export async function generateImageWithReference(
  prompt: string,
  referenceImageBase64: string | null,
  width: number,
  height: number
): Promise<Buffer> {
  if (!KEY) throw new Error('GOOGLE_AI_API_KEY 필요. .env.local에 설정해주세요.')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = []
  if (referenceImageBase64) {
    parts.push({
      inlineData: { mimeType: 'image/png', data: referenceImageBase64 },
    })
  }
  parts.push({ text: prompt })

  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['IMAGE'],
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `Gemini 이미지 생성 실패: ${res.status}`
    throw new Error(msg)
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> }
    }>
  }

  const part = data.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.data
  )
  if (!part?.inlineData?.data) {
    throw new Error('Gemini 이미지 생성: 이미지 데이터 없음')
  }

  return Buffer.from(part.inlineData.data, 'base64')
}

/** 여러 참조 이미지를 기반으로 새 이미지 생성 (템플릿 + 상품 + 연출 등) */
export async function generateImageWithMultipleReferences(
  prompt: string,
  referenceImagesBase64: string[],
  width: number,
  height: number
): Promise<Buffer> {
  if (!KEY) throw new Error('GOOGLE_AI_API_KEY 필요. .env.local에 설정해주세요.')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = []
  for (const data of referenceImagesBase64) {
    if (data) parts.push({ inlineData: { mimeType: 'image/png', data } })
  }
  parts.push({ text: prompt })

  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['IMAGE'],
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `Gemini 이미지 생성 실패: ${res.status}`
    throw new Error(msg)
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> }
    }>
  }

  const part = data.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.data
  )
  if (!part?.inlineData?.data) {
    throw new Error('Gemini 이미지 생성: 이미지 데이터 없음')
  }

  return Buffer.from(part.inlineData.data, 'base64')
}
