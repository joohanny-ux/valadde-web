/**
 * Serper API - Google 검색 (무료 2,500/월)
 * SERPER_API_KEY 없으면 빈 문자열 반환 → Gemini로 이미지/상품명 기반 추출
 */

export async function searchProductInfo(queries: string[]): Promise<string> {
  const key = process.env.SERPER_API_KEY
  if (!key) return ''

  const results: string[] = []
  for (const q of queries.slice(0, 2)) {
    try {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q, num: 5 }),
      })
      if (!res.ok) continue
      const data = (await res.json()) as { organic?: Array<{ title?: string; snippet?: string }> }
      const items = data.organic ?? []
      for (const it of items) {
        if (it.title) results.push(it.title)
        if (it.snippet) results.push(it.snippet)
      }
    } catch {
      // ignore
    }
  }
  return results.join('\n\n')
}
