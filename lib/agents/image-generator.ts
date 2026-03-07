/**
 * 이미지 생성 - Gemini 2.5 Flash Image (Nano Banana)
 * Pollinations 대신 Google AI Studio 키 사용
 */

const KEY = process.env.GOOGLE_AI_API_KEY
const MODEL = 'gemini-2.5-flash-image'

export async function generateImage(
  prompt: string,
  _width: number,
  _height: number
): Promise<Buffer> {
  if (!KEY) throw new Error('GOOGLE_AI_API_KEY 필요')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'] },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      err?.error?.message || `Gemini 이미지 생성 실패: ${res.status}`
    )
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
