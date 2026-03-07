# PRD: 상품 상세페이지 자동 생성 에이전트

**버전**: 1.0  
**작성일**: 2025-03-05  
**상태**: Draft

---

## 1. 개요

### 1.1 목적
- Excel 상품 파일 업로드 시 Admin 상품 관리 페이지에 자동 등록
- 상품 이미지 기반으로 AI가 상세페이지용 이미지·정보를 자동 생성
- 이미지당 과금형 AI 사용으로 **이미지 생성 제한 없이** 확장 가능

### 1.2 추천 AI 스택

| 용도 | AI 서비스 | 비고 |
|------|-----------|------|
| **이미지 생성** | **Replicate** (Flux, SDXL) | 이미지당 과금 (~$0.003/장), 일일 제한 없음 |
| 대안 이미지 | Fal.ai | 낮은 레이턴시, 한국 네트워크 |
| **검색·오케스트레이션** | OpenAI GPT-4o | 상품 검색 쿼리, 정보 추출, 카피·디자인 제안 |
| **웹 검색** | Serper API 또는 Google Custom Search | 상품 정보 수집 |

### 1.3 사용자 플로우

```
[Admin] Excel 업로드 → 상품 일괄 생성
     ↓
[Admin] 상품관리 페이지에서 "상세페이지 작업" 클릭
     ↓
[상세페이지 작업 페이지] 상품 이미지 업로드
     ↓
[Agent] 1. 상품 검색 → 2. 정보 수집 → 3. 제안 생성 → 4. 이미지 생성
     ↓
[Admin] 미리보기 → 수정/재생성 → 게시
```

---

## 2. 기능 요구사항

### 2.1 Excel 업로드 → 상품 자동 생성

| 항목 | 내용 |
|------|------|
| **입력** | Excel 파일 (.xlsx, .xls) |
| **처리** | 백엔드에서 파싱 후 `products` 테이블에 INSERT |
| **필수 컬럼** | name, name_en, price, brand_id(또는 brand_name), category_id 등 |
| **출력** | Admin 상품관리 페이지에 상품 목록 자동 노출 |

**Excel 예시 컬럼:**
- name, name_en, price, promotion_price
- brand_name (또는 brand_id)
- category_name (또는 category_id)
- short_description, description (선택)

### 2.2 상품관리 페이지 변경

| 항목 | 내용 |
|------|------|
| **추가 UI** | 각 상품 행에 "상세페이지 작업" 버튼 |
| **동작** | 클릭 시 `/admin/products/[id]/detail-page` 로 이동 |

### 2.3 상세페이지 작업 페이지

**경로**: `/admin/products/[id]/detail-page`

**기능:**
1. 상품 기본 정보 표시
2. 상품 이미지 업로드 영역
3. "상세페이지 생성 시작" 버튼
4. 진행 상태 표시 (검색 중 → 정보 수집 → 제안 생성 → 이미지 생성)
5. 생성 결과 미리보기 및 수정/재생성/게시

### 2.4 상세페이지 Agent 프로세스

#### Phase 1: 상품 검색 및 정보 습득

1. **입력**: 업로드된 상품 이미지 + 상품명(name, name_en)
2. **처리**:
   - GPT-4o Vision으로 이미지 분석 → 검색 쿼리 생성
   - Serper/Google Search로 상품 정보 검색
   - 검색 결과에서 아래 스펙 추출

**수집 스펙:**
- Brand
- Item Volume
- Active Ingredients
- About this item
- Age Range Description
- Item Form
- Target Use Body Part
- Country as Labeled
- Number per Carton

#### Phase 2: 디자인·카피 제안

1. **입력**: 상세페이지 템플릿 + 수집된 상품 정보
2. **처리**:
   - GPT-4o가 템플릿의 글자 수 제한, 레이아웃 제약 분석
   - 각 이미지별 카피워딩(글자 수, 톤) 제안
   - 디자인 포인트(색상, 강조 영역 등) 제안
3. **출력**: JSON 형태의 제안서 → 사용자 확인/수정

#### Phase 3: 이미지 생성

| 이미지 | 용도 | 사이즈 | 생성 API |
|--------|------|--------|----------|
| **이미지 01** | 상품 검색 페이지 | 280 x 280 px | Replicate (Flux) |
| **이미지 02** | 썸네일 | 600 x 600 px | Replicate (Flux) |
| **이미지 03** | 상세페이지 본문 | 860 x 1800 px | Replicate (Flux) |

**프롬프트**: Phase 2 제안 + 상품 정보 기반으로 각 이미지용 프롬프트 생성 → Replicate API 호출

#### Phase 4: 결과 정리 및 게시

- 생성된 이미지 URL 저장
- 상품 스펙(specs) JSON 업데이트
- 미리보기 후 "게시" 시 products 테이블 업데이트

### 2.5 이미지 다운로드 및 재생성

| 버튼 | 동작 |
|------|------|
| **다운로드** | 이미지 URL에서 파일 다운로드 |
| **재생성** | 해당 이미지만 다시 생성 (프롬프트 수정 가능) |

---

## 3. 데이터 모델

### 3.1 products 테이블 확장 (가정)

```sql
-- 이미 존재하는 products 에 추가/활용할 필드
-- images: 상품 이미지 URL 배열
-- specs: JSONB - Brand, Item Volume, Active Ingredients 등
-- detail_images: 상세페이지용 이미지 URL (01, 02, 03)
```

### 3.2 상세페이지 작업 상태 (선택)

```sql
CREATE TABLE product_detail_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  status TEXT, -- 'pending' | 'searching' | 'suggesting' | 'generating' | 'done' | 'error'
  search_result JSONB,
  design_suggestion JSONB,
  generated_images JSONB, -- { image_01: url, image_02: url, image_03: url }
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. API 설계

### 4.1 Excel 업로드

```
POST /api/admin/products/import
Content-Type: multipart/form-data
Body: file (Excel 파일)

Response: { count: number, productIds: string[], errors?: string[] }
```

### 4.2 상세페이지 Agent 실행

```
POST /api/admin/products/[id]/detail-page/run
Content-Type: multipart/form-data
Body: image (상품 이미지 파일)

Response: { jobId: string, status: string }
```

### 4.3 Agent 상태 조회 (폴링)

```
GET /api/admin/products/[id]/detail-page/status?jobId=xxx

Response: {
  status: 'searching' | 'suggesting' | 'generating' | 'done',
  searchResult?: { ... },
  designSuggestion?: { ... },
  generatedImages?: { image_01: string, image_02: string, image_03: string },
  specs?: { ... }
}
```

### 4.4 이미지 재생성

```
POST /api/admin/products/[id]/detail-page/regenerate
Body: { imageKey: 'image_01' | 'image_02' | 'image_03', promptOverride?: string }

Response: { imageUrl: string }
```

### 4.5 게시

```
POST /api/admin/products/[id]/detail-page/publish
Body: { images: {...}, specs: {...} }

Response: { success: boolean }
```

---

## 5. 외부 API 연동

### 5.1 Replicate (이미지 생성)

```env
REPLICATE_API_TOKEN=xxx
```

- 모델: `black-forest-labs/flux-schnell` 또는 `stability-ai/sdxl`
- 오차 크기: 280x280, 600x600, 860x1800 등 지원

### 5.2 Serper (검색)

```env
SERPER_API_KEY=xxx
```

- 사용: `POST https://google.serper.dev/search` 또는 `search` 엔드포인트

### 5.3 OpenAI (GPT-4o)

```env
OPENAI_API_KEY=xxx
```

- Vision: 이미지 분석
- Completion: 검색 쿼리, 카피·디자인 제안, 이미지용 프롬프트 생성

---

## 6. 상세페이지 템플릿

- 템플릿 구조(섹션, 글자 수 제한 등)는 별도 문서 또는 코드에서 정의
- Agent는 템플릿 스펙을 입력받아 카피·디자인 제안 생성

---

## 7. 작업 우선순위

| Phase | 작업 | 예상 |
|-------|------|------|
| P0 | Excel 업로드 → 상품 생성 API + Admin UI | 2–3일 |
| P0 | 상품관리 페이지에 "상세페이지 작업" 버튼 + 라우팅 | 0.5일 |
| P1 | 상세페이지 작업 페이지 기본 UI | 1일 |
| P1 | Agent Phase 1: 검색·정보 수집 (Serper + GPT) | 2일 |
| P1 | Agent Phase 2: 카피·디자인 제안 (GPT) | 1일 |
| P1 | Agent Phase 3: 이미지 생성 (Replicate) | 2일 |
| P2 | 미리보기, 다운로드, 재생성, 게시 | 1–2일 |
| P2 | 에러 처리, 재시도, 로딩 UX | 1일 |

---

## 8. 환경 변수 요약

```env
# 이미지 생성 (Replicate - 제한 없음)
REPLICATE_API_TOKEN=

# 검색
SERPER_API_KEY=

# 오케스트레이션
OPENAI_API_KEY=
```

---

## 9. 참고 자료

- [Replicate API Docs](https://replicate.com/docs)
- [Serper API](https://serper.dev/)
- [OpenAI GPT-4o](https://platform.openai.com/docs)

---

## 10. 무료 스택 버전 (Free Tier Alternative)

### 10.1 NotebookLM 제한 사항

**NotebookLM은 자동화용 공식 API가 없습니다.**

| 구분 | 내용 |
|------|------|
| **NotebookLM** | 문서 업로드 후 대화형 연구용 웹 앱, 자동화 API 없음 |
| **NotebookLM Enterprise** | Google Cloud API 존재하나 유료 라이선스 필요 |
| **커뮤니티 도구** | notebooklm-mcp, Playwright 자동화 등 → 비공식, 변경 시 동작 중단 위험 |

→ **완전 자동화 파이프라인에서는 NotebookLM 직접 연동은 불가**하며, 비슷한 역할을 하는 **Gemini API (무료)** 를 사용하는 것을 권장합니다.

### 10.2 무료 추천 스택

| 용도 | 서비스 | 무료 한도 | 비고 |
|------|--------|-----------|------|
| **이미지 생성** | **Pollinations.ai** | **무제한** (API 키 불필요) | 완전 무료, 1280x1280 이하 |
| 이미지 생성 (대안) | **Gemini 2.5 Flash Image** (Nano Banana) | 500장/일 | Google AI Studio, 1024x1024 |
| **정보 수집·분석** | **Gemini API** (gemini-2.0-flash) | 무료 tier | 이미지 분석 + 텍스트 추출, NotebookLM 대체 |
| **웹 검색** | **Serper** | 2,500 검색/월 무료 | 상품 정보 수집 |
| 검색 (대안) | **Google Custom Search** | 100 쿼리/일 무료 | |

### 10.3 무료 플로우

```
[상품 이미지 업로드]
     ↓
Gemini API (Vision) : 이미지 분석 → 검색 쿼리 + 초기 스펙 추출
     ↓
Serper (무료 2,500/월) : 웹 검색 → 상품 상세 정보 수집
     ↓
Gemini API : 검색 결과 요약 → Brand, Active Ingredients 등 스펙 정리 (NotebookLM 역할)
     ↓
Gemini API : 카피·디자인 제안 생성
     ↓
Pollinations.ai (무료 무제한) : 이미지 01, 02, 03 생성
  - 280x280, 600x600 → 직접 요청
  - 860x1800 → 860x1200 등으로 생성 후 리사이즈 또는 최대 1280x1280 사용
```

### 10.4 Pollinations.ai 사용법 (API 키 불필요)

```
# 이미지 생성 - 간단 URL 호출
GET https://image.pollinations.ai/prompt/{URL인코딩된_프롬프트}?width=600&height=600

# 예시
https://image.pollinations.ai/prompt/product%20photo%20cosmetics?width=280&height=280
```

- width, height 파라미터로 280x280, 600x600 등 지정 가능
- 860x1800은 한 축이 1280을 초과 → 860x1200 생성 후 클라이언트에서 확대/리사이즈 권장

### 10.5 Gemini 2.5 Flash Image (Nano Banana) 사용법

- **Google AI Studio**에서 API 키 발급 (무료)
- 모델: `gemini-2.5-flash-preview-05-20` (이미지 생성 지원)
- 제한: 500 요청/일, 분당 ~60
- 해상도: 1024x1024 등 비율 지원

### 10.6 무료 버전 환경 변수

```env
# 이미지 - Pollinations (API 키 불필요)
# 별도 설정 없음

# 또는 Gemini 이미지 (선택)
GOOGLE_AI_API_KEY=   # Google AI Studio에서 발급

# 정보 수집
GOOGLE_AI_API_KEY=   # Gemini Vision + 텍스트 (NotebookLM 대체)
SERPER_API_KEY=      # 무료 2,500/월
```

### 10.7 결론: 무료로 자동화 가능 여부

| 항목 | 가능 여부 |
|------|-----------|
| Excel → 상품 생성 | ✅ 가능 (백엔드 구현) |
| 상품 검색·정보 수집 | ✅ 가능 (Gemini + Serper 무료 tier) |
| NotebookLM 대체 | ✅ Gemini API로 동일 목적 구현 |
| 이미지 생성 | ✅ Pollinations (무제한) 또는 Gemini Nano Banana (500/일) |
| 전체 파이프라인 자동화 | ✅ 무료 스택으로 구현 가능 |
