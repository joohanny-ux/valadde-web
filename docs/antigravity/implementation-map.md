# Antigravity Implementation Map

`docs/antigravity`는 Valadde 서비스 UI의 디자인 원본이다. 정적 HTML을 직접 서비스에 연결하지 않고, 아래 매핑 기준에 따라 Next.js 컴포넌트와 페이지로 재구현한다.

## Public
- `index.html`
  - `app/(public)/page.tsx`
  - `components/PublicHeader.tsx`
  - `components/PublicFooter.tsx`
- `products.html`
  - `app/(public)/products/page.tsx`
  - `app/(public)/products/ProductFilters.tsx`
  - `app/(public)/products/ProductGrid.tsx`
- `products-list.html`
  - `app/(public)/products/ProductList.tsx`
- `style.css`
  - spacing, radius, toolbar, card hierarchy 기준

## Member Workflow
- `selected-products.html`
  - `app/(member)/creator/sale-request/page.tsx`
  - `components/member/MemberSubnav.tsx`
  - `components/member/MemberPageIntro.tsx`
- `creator-deals.html`
  - `app/(member)/creator/page.tsx`
  - `app/(member)/creator/orders/page.tsx`
- `deals-quotations.html`
  - 추후 `creator` / `buyer` 문서 상태 화면으로 분리
- `deals-purchase-orders.html`
  - `app/(member)/buyer/po/page.tsx`
  - `app/(member)/buyer/po-list/page.tsx`
- `deals-invoices.html`
  - `app/(member)/buyer/orders/page.tsx`
  - `app/(member)/creator/orders/page.tsx`
- `payments.html`
  - `app/(member)/buyer/orders/page.tsx`
- `creator-payments.html`
  - `app/(member)/creator/orders/page.tsx`

## Admin And Security
- Admin은 Antigravity 직접 매핑 대상이 아니다.
- 관리 화면은 `app/admin`에서 정보 구조와 운영성 중심으로 구현한다.
- 권한 검사는 다음 기준을 따른다.
  - `/api/admin/*`: 관리자 세션 필수
  - `orders`, `sale-requests`: 인증 필수, 역할 검증 필수
  - 공개 GET API와 관리용 write API를 분리

## Implementation Rules
- 섹션 단위로 JSX로 옮긴다.
- `class`는 `className`으로 변환한다.
- 링크는 `next/link`를 사용한다.
- 한국어를 기본 언어로 구현하고, 공통 문구는 `messages/*.ts`로 점진 분리한다.
- 데이터 연결 순서는 `구조 -> 텍스트 -> 이미지 -> 데이터 -> 인터랙션`이다.
