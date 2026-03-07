# ABU BUSINESS HUB — 화면 목록

**문서 버전:** 1.0  
**작성일:** 2025-03-04  
**기준:** www.valadde.com

---

## 1. 개요

본 문서는 ABU BUSINESS HUB의 **모든 화면(페이지)**을 체계적으로 나열한 목록입니다.  
각 화면의 목적, 대상 사용자, 진입 경로, 포함 요소를 정리합니다.

---

## 2. 화면 분류 체계

| 구분 | 설명 |
|------|------|
| **퍼블릭** | 로그인 없이 모든 방문자가 접근 |
| **크리에이터** | 크리에이터 로그인 후 전용 |
| **바이어** | 바이어 로그인 후 전용 |
| **브랜드** | 브랜드 로그인 후 전용 |
| **관리자** | 관리자 로그인 후 전용 |

---

## 3. 화면 목록 (전체)

### 3.1 퍼블릭 영역 (로그인 불필요)

| No. | 화면 ID | 화면명 | 설명 | URL 예시 | 우선순위 |
|-----|---------|--------|------|----------|----------|
| P-01 | HOME | 메인 (랜딩) | 서비스 소개, 사용자 유형별 CTA, 인기/최신 상품 | `/` | 1차 |
| P-02 | PRODUCT_LIST | 상품 목록 | 카테고리/브랜드 필터, 검색, 그리드 표시 | `/products` | 1차 |
| P-03 | PRODUCT_DETAIL | 상품 상세 | 상품 이미지, 스펙, 가격, CTA(협상/PO/문의) | `/products/{id}` | 1차 |
| P-04 | ABOUT | 회사 소개 | 회사/서비스 소개 | `/about` | 2차 |
| P-05 | CONTACT | 문의 | 연락처, 문의 폼 | `/contact` | 2차 |
| P-06 | LOGIN | 로그인 | 이메일/비밀번호, 소셜 로그인 | `/login` | 1차 |
| P-07 | SIGNUP | 회원가입 | 유형 선택(크리에이터/바이어/브랜드), 정보 입력 | `/signup` | 1차 |
| P-08 | NOTICE_LIST | 공지 목록 | 공지사항 목록 | `/notice` | 2차 |
| P-09 | NOTICE_DETAIL | 공지 상세 | 공지 내용 | `/notice/{id}` | 2차 |
| P-10 | FAQ | 자주 묻는 질문 | FAQ 목록·검색 | `/faq` | 2차 |
| P-11 | TERMS | 이용약관 | 이용약관 전문 | `/terms` | 1차 |
| P-12 | PRIVACY | 개인정보처리방침 | 개인정보처리방침 전문 | `/privacy` | 1차 |

---

### 3.2 크리에이터 전용

| No. | 화면 ID | 화면명 | 설명 | URL 예시 | 우선순위 |
|-----|---------|--------|------|----------|----------|
| C-01 | CREATOR_DASHBOARD | 크리에이터 대시보드 | 내 협상·주문 요약, 빠른 링크 | `/creator` | 1차 |
| C-02 | CREATOR_SALE_REQUEST | 판매 의사 신청 | 선택 상품에 대한 판매 의사·재고 문의 | `/creator/sale-request` | 1차 |
| C-03 | CREATOR_NEGOTIATION | 협상 진행 | 판매가·공급가 협상, 채팅/메모 | `/creator/negotiation/{id}` | 1차 |
| C-04 | CREATOR_ORDERS | 주문 목록 | 내 주문 목록, 상태 필터 | `/creator/orders` | 1차 |
| C-05 | CREATOR_ORDER_DETAIL | 주문 상세 | 주문 내용, 배송 추적 | `/creator/orders/{id}` | 1차 |
| C-06 | CREATOR_WISHLIST | 관심 상품 | 북마크/위시리스트 | `/creator/wishlist` | 2차 |
| C-07 | CREATOR_PROFILE | 프로필 | 내 정보 수정 | `/creator/profile` | 2차 |

---

### 3.3 바이어 전용

| No. | 화면 ID | 화면명 | 설명 | URL 예시 | 우선순위 |
|-----|---------|--------|------|----------|----------|
| B-01 | BUYER_DASHBOARD | 바이어 대시보드 | 내 PO·주문 요약 | `/buyer` | 1차 |
| B-02 | BUYER_PO_FORM | PO 작성 | 상품 선택 후 PO 폼 작성·제출 | `/buyer/po` | 1차 |
| B-03 | BUYER_PO_LIST | PO 목록 | 제출한 PO 목록, 상태 | `/buyer/po-list` | 1차 |
| B-04 | BUYER_ORDERS | 주문 목록 | 주문·인보이스·배송 상태 | `/buyer/orders` | 1차 |
| B-05 | BUYER_ORDER_DETAIL | 주문 상세 | 주문 내용, 인보이스, 배송 | `/buyer/orders/{id}` | 1차 |
| B-06 | BUYER_PROFILE | 프로필 | 내 정보 수정 | `/buyer/profile` | 2차 |

---

### 3.4 브랜드 전용

| No. | 화면 ID | 화면명 | 설명 | URL 예시 | 우선순위 |
|-----|---------|--------|------|----------|----------|
| BR-01 | BRAND_DASHBOARD | 브랜드 대시보드 | 검수·신상 요청 현황 | `/brand` | 1차 |
| BR-02 | BRAND_REVIEW_REQUEST | 검수 요청 | 기존 상품 가격/페이지 검수 요청 | `/brand/review-request` | 1차 |
| BR-03 | BRAND_NEW_PRODUCT | 신상품 요청 | 신상품 게시 요청 폼 | `/brand/new-product` | 1차 |
| BR-04 | BRAND_REQUESTS | 요청 내역 | 검수·신상 요청 목록·상태 | `/brand/requests` | 1차 |
| BR-05 | BRAND_CREATOR_SEARCH | 크리에이터 검색 | (차후) 판매 제안용 크리에이터 검색 | `/brand/creators` | 3차 |
| BR-06 | BRAND_PROFILE | 프로필 | 내 정보 수정 | `/brand/profile` | 2차 |

---

### 3.5 관리자 전용

| No. | 화면 ID | 화면명 | 설명 | URL 예시 | 우선순위 |
|-----|---------|--------|------|----------|----------|
| A-01 | ADMIN_LOGIN | 관리자 로그인 | Admin 전용 로그인 | `/admin/login` | 1차 |
| A-02 | ADMIN_DASHBOARD | 관리자 대시보드 | 통계 요약(브랜드/상품/주문/매출) | `/admin` | 1차 |
| A-03 | ADMIN_PRODUCT_LIST | 상품 목록 | 상품 CRUD, 카테고리/브랜드 필터 | `/admin/products` | 1차 |
| A-04 | ADMIN_PRODUCT_EDIT | 상품 등록/수정 | 상세페이지 편집 포함 | `/admin/products/new`, `/admin/products/{id}` | 1차 |
| A-05 | ADMIN_CATEGORY | 카테고리 관리 | 카테고리 CRUD | `/admin/categories` | 1차 |
| A-06 | ADMIN_BRAND | 브랜드 관리 | 브랜드 CRUD | `/admin/brands` | 1차 |
| A-07 | ADMIN_USER_LIST | 유저 목록 | 크리에이터/바이어/브랜드 목록 | `/admin/users` | 1차 |
| A-08 | ADMIN_USER_DETAIL | 유저 상세 | 유저 정보·주문 내역 | `/admin/users/{id}` | 2차 |
| A-09 | ADMIN_ORDER_LIST | 주문 목록 | 주문/인보이스/결제/배송 상태 | `/admin/orders` | 1차 |
| A-10 | ADMIN_ORDER_DETAIL | 주문 상세 | 주문 처리·인보이스·배송 입력 | `/admin/orders/{id}` | 1차 |
| A-11 | ADMIN_NEGOTIATION | 협상 관리 | 크리에이터 협상 목록·진행 | `/admin/negotiations` | 1차 |
| A-12 | ADMIN_BOARD | 게시판 관리 | 공지·FAQ CRUD | `/admin/board` | 2차 |
| A-13 | ADMIN_CRM | CRM | 문의·이벤트·메모 | `/admin/crm` | 2차 |
| A-14 | ADMIN_STATS | 통계 | 상세 통계·차트 | `/admin/stats` | 2차 |
| A-15 | ADMIN_TERMS | 약관 관리 | 이용약관·개인정보처리방침 등록·버전 | `/admin/terms` | 1차 |

---

## 4. 화면별 상세 (1차 MVP 핵심 화면)

### P-01 HOME (메인)
- **목적**: 서비스 인지, 사용자 유형별 진입 유도
- **포함 요소**  
  - 히어로: 슬로건, CTA 버튼  
  - 사용자 유형별 섹션(크리에이터/바이어/브랜드)  
  - 인기/최신 상품 미리보기(카드 4~8개)  
  - 푸터: 링크, 연락처
- **데이터 연동**: 상품 목록(최신 N개)

---

### P-02 PRODUCT_LIST (상품 목록)
- **목적**: 상품 검색·필터·목록 표시
- **포함 요소**  
  - 검색창  
  - 필터: 카테고리, 브랜드, 가격대  
  - 정렬: 최신순, 인기순, 가격순  
  - 상품 그리드(이미지, 이름, 가격, CTA)
- **데이터 연동**: Product DB (필터·검색 쿼리)

---

### P-03 PRODUCT_DETAIL (상품 상세)
- **목적**: 상품 정보 전달, 다음 행동 유도(협상/PO/문의)
- **포함 요소**  
  - 이미지 갤러리  
  - 상품명, 브랜드, 카테고리  
  - 가격(표시 정책에 따라)  
  - 상세 설명(스펙, 이미지)  
  - CTA: [판매 의사 신청](크리에이터) / [PO 작성](바이어) / [검수 요청](브랜드)
- **데이터 연동**: Product DB (단일 상품)

---

### A-02 ADMIN_DASHBOARD (관리자 대시보드)
- **목적**: 운영 현황 한눈에 파악
- **포함 요소**  
  - 카드: 브랜드 수, 상품 수, 방문자 수, 주문 수, 매출 수량, 매출 금액  
  - 최근 주문/협상 요약  
  - 빠른 링크(상품 추가, 주문 처리 등)
- **데이터 연동**: 집계 쿼리(Products, Orders, Users 등)

---

### A-04 ADMIN_PRODUCT_EDIT (상품 등록/수정)
- **목적**: 상품·상세페이지 입력·수정
- **포함 요소**  
  - 기본정보: 이름, 카테고리, 브랜드, SKU, 가격, 재고  
  - 이미지 업로드(다중)  
  - 상세페이지: HTML/마크다운 또는 위지윅 에디터  
  - 저장/미리보기 버튼
- **데이터 연동**: Product DB (Create/Update)

---

## 5. 우선순위별 구현 순서

### 1차 MVP (필수)
```
P-01 HOME → P-02 PRODUCT_LIST → P-03 PRODUCT_DETAIL → P-06 LOGIN → P-07 SIGNUP
→ A-01 ADMIN_LOGIN → A-02 ADMIN_DASHBOARD → A-03~A-04 상품 관리 → A-09~A-10 주문 관리
→ P-11 TERMS, P-12 PRIVACY
```

### 2차 (사용자 플로우)
```
C-01~C-05 (크리에이터) / B-01~B-05 (바이어) / BR-01~BR-04 (브랜드)
→ A-11 협상관리, A-12 게시판, A-14 통계
```

### 3차 (확장)
```
다국어, P-04~P-05, C-06~C-07, BR-05 등
```

---

## 6. 화면 수 요약

| 구분 | 1차 | 2차 | 3차 | 합계 |
|------|-----|-----|-----|------|
| 퍼블릭 | 7 | 5 | 0 | 12 |
| 크리에이터 | 5 | 2 | 0 | 7 |
| 바이어 | 5 | 1 | 0 | 6 |
| 브랜드 | 4 | 1 | 1 | 6 |
| 관리자 | 10 | 4 | 0 | 15 |
| **합계** | **31** | **13** | **1** | **45** |

---

**다음 단계**: Product DB 스키마 정의 — 각 화면에서 사용할 필드를 기준으로 스키마를 설계합니다.
