# 무료 스택 요약: 상품 상세페이지 에이전트

## 핵심 정리

- **NotebookLM**: 자동화용 공개 API 없음 → **Gemini API**로 대체
- **이미지 생성**: **Pollinations.ai** (완전 무료) 또는 **Gemini 2.5 Flash Image** (500/일)

---

## 무료 구성도

```
┌─────────────────────────────────────────────────────────────────┐
│                    무료 AI 스택                                   │
├─────────────────────────────────────────────────────────────────┤
│  정보 수집 (NotebookLM 역할)                                      │
│  → Gemini API (Vision) : 이미지 분석, 검색 쿼리 생성               │
│  → Serper API : 웹 검색 (2,500회/월 무료)                         │
│  → Gemini API : 검색 결과에서 스펙 추출                            │
├─────────────────────────────────────────────────────────────────┤
│  카피·디자인 제안                                                  │
│  → Gemini API : 템플릿 기반 제안 생성                              │
├─────────────────────────────────────────────────────────────────┤
│  이미지 생성                                                      │
│  → Pollinations.ai : 무제한, API 키 불필요                         │
│  → 또는 Gemini 2.5 Flash Image : 500장/일 무료                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pollinations.ai 연동 예시 (Node.js)

```javascript
// API 키 없이 URL만으로 이미지 생성
function getPollinationsImageUrl(prompt, width = 600, height = 600) {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}`;
}

// 사용
const url = getPollinationsImageUrl('K-beauty serum product shot, white background', 280, 280);
// fetch(url) → Blob → Supabase Storage 업로드
```

---

## Gemini API 연동 예시 (정보 추출)

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// 이미지 분석 + 검색 쿼리 생성
async function analyzeProductImage(imageBuffer) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent([
    {
      inlineData: { mimeType: 'image/png', data: imageBuffer.toString('base64') }
    },
    '이 화장품 이미지를 분석하고, 이 제품의 상세 정보를 검색할 수 있는 검색어 3개를 영어로 추천해줘.'
  ]);
  return result.response.text();
}
```

---

## 체크리스트 (무료 버전)

- [ ] Google AI Studio에서 API 키 발급 (Gemini)
- [ ] Serper.dev 가입 후 API 키 발급 (무료)
- [ ] Pollinations.ai - 별도 가입/키 불필요
- [ ] 이미지 01 (280x280), 02 (600x600) → Pollinations로 직접 생성
- [ ] 이미지 03 (860x1800) → 860x1200으로 생성 후 리사이즈 또는 600x1200 등으로 분할
