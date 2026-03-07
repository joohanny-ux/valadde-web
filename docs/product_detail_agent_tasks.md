# 상품 상세페이지 에이전트 - 작업 체크리스트

## 사전 준비

- [ ] Replicate 계정 생성 및 API 토큰 발급 (https://replicate.com)
- [ ] Serper API 키 발급 (https://serper.dev) - 무료 2,500 검색/월
- [ ] OpenAI API 키 확인 (GPT-4o Vision 사용)

---

## Phase 0: Excel 업로드 → 상품 생성

### 백엔드
- [ ] `xlsx` 또는 `exceljs` 패키지 설치
- [ ] `POST /api/admin/products/import` API 구현
- [ ] Excel 파싱 → brands/categories 매칭 또는 생성
- [ ] products 테이블 bulk insert

### Admin UI
- [ ] 상품관리 페이지에 "Excel 가져오기" 버튼 추가
- [ ] 파일 선택 → 업로드 → 결과(성공/실패 건수) 표시

---

## Phase 1: 상세페이지 작업 진입점

### Admin UI
- [ ] `app/admin/products/page.tsx` - 각 행에 "상세페이지 작업" 버튼 추가
- [ ] `app/admin/products/[id]/detail-page/page.tsx` 페이지 생성
- [ ] 상품 기본 정보 표시
- [ ] 상품 이미지 업로드 영역 (drag & drop 또는 file input)

---

## Phase 2: Agent Pipeline

### 2.1 검색·정보 수집
- [ ] `lib/agents/product-search.ts` - GPT-4o Vision으로 이미지 분석 → 검색 쿼리 생성
- [ ] Serper API 연동 → 상품 정보 검색
- [ ] 검색 결과 파싱 → Brand, Item Volume, Active Ingredients 등 추출
- [ ] `product_detail_jobs` 테이블 생성 (또는 in-memory + products 업데이트)

### 2.2 카피·디자인 제안
- [ ] 상세페이지 템플릿 스펙 정의 (섹션별 글자 수 등)
- [ ] GPT-4o로 카피워딩·디자인 포인트 제안 생성
- [ ] 제안 확인/수정 UI (선택)

### 2.3 이미지 생성
- [ ] Replicate SDK 설치 (`npm i replicate`)
- [ ] Flux 모델로 280x280, 600x600, 860x1800 이미지 생성
- [ ] Supabase Storage 또는 S3에 업로드 후 URL 저장

### 2.4 API 구현
- [ ] `POST /api/admin/products/[id]/detail-page/run` - Agent 전체 실행
- [ ] `GET /api/admin/products/[id]/detail-page/status` - 진행 상태 폴링
- [ ] `POST /api/admin/products/[id]/detail-page/regenerate` - 단일 이미지 재생성
- [ ] `POST /api/admin/products/[id]/detail-page/publish` - 최종 게시

---

## Phase 3: UI 완성

- [ ] 진행 상태 표시 (검색 중 → 제안 생성 → 이미지 생성)
- [ ] 생성 결과 미리보기 (이미지 01, 02, 03 + 스펙)
- [ ] 각 이미지별 "다운로드" 버튼
- [ ] 각 이미지별 "재생성" 버튼
- [ ] "게시" 버튼 → products 업데이트

---

## 디렉터리 구조 (권장)

```
app/
  admin/
    products/
      page.tsx              # 상품 목록 + Excel 가져오기 + 상세페이지 작업 버튼
      [id]/
        detail-page/
          page.tsx          # 상세페이지 작업 페이지

lib/
  agents/
    product-search.ts       # 검색 쿼리 생성
    product-info-extractor.ts # 검색 결과에서 스펙 추출
    design-suggester.ts    # 카피·디자인 제안
    image-generator.ts     # Replicate 호출

api/
  admin/
    products/
      import/
        route.ts           # Excel 업로드
      [id]/
        detail-page/
          run/
            route.ts       # Agent 실행
          status/
            route.ts       # 상태 조회
          regenerate/
            route.ts      # 이미지 재생성
          publish/
            route.ts      # 게시
```
