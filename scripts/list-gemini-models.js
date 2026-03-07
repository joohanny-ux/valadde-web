/**
 * API 키로 사용 가능한 Gemini 모델 목록 조회
 * 실행: npm run list-models
 */
const fs = require('fs')
const path = require('path')
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const idx = line.indexOf('=')
    if (idx > 0 && !line.startsWith('#')) {
      const k = line.slice(0, idx).trim()
      const v = line.slice(idx + 1).trim()
      if (v && !v.startsWith('#')) process.env[k] = v
    }
  })
}

const key = process.env.GOOGLE_AI_API_KEY
if (!key) {
  console.error('GOOGLE_AI_API_KEY가 .env.local에 없습니다.')
  process.exit(1)
}

async function main() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
  )
  const data = await res.json()
  if (!res.ok) {
    console.error('오류:', data.error?.message || res.status)
    process.exit(1)
  }
  const models = data.models || []
  console.log('사용 가능한 모델 (generateContent 지원):\n')
  for (const m of models) {
    const methods = m.supportedGenerationMethods || []
    if (methods.includes('generateContent')) {
      console.log(`  ${m.name.replace('models/', '')}`)
    }
  }
}

main().catch(console.error)
