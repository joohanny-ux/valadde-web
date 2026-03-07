import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

const genAI = process.env.GOOGLE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null

const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
  'gemini-pro-latest',
].filter(Boolean) as string[]

export function getGeminiModel(): GenerativeModel {
  if (!genAI) throw new Error('GOOGLE_AI_API_KEY 필요')
  const modelId = FALLBACK_MODELS[0] || 'gemini-2.5-flash'
  return genAI.getGenerativeModel({ model: modelId })
}

export async function withModelFallback<T>(
  fn: (model: GenerativeModel) => Promise<T>
): Promise<T> {
  if (!genAI) throw new Error('GOOGLE_AI_API_KEY 필요')
  let lastErr: Error | null = null
  for (const modelId of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelId })
      return await fn(model)
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err))
      const msg = lastErr.message || ''
      if (msg.includes('404') || msg.includes('not found')) continue
      throw lastErr
    }
  }
  throw lastErr ?? new Error('사용 가능한 모델 없음')
}
