# 관리자 대시보드

## 실행 방법

```powershell
# 패키지 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 **http://localhost:3000** 접속

## 환경 설정

프로젝트 루트에 `.env` 또는 `.env.local` 파일에 다음 변수 설정:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

## 화면 구성

| 경로 | 설명 |
|------|------|
| `/` | 메인 (관리자 링크) |
| `/admin` | 대시보드 (통계 요약) |
| `/admin/products` | 상품 목록 (검색, 브랜드/카테고리 필터, 페이징) |
| `/admin/products/[id]` | 상품 수정 |
| `/admin/categories` | 카테고리 (준비 중) |
| `/admin/brands` | 브랜드 (준비 중) |

## 상품 목록

- 검색: 상품명, SKU
- 필터: 브랜드, 카테고리
- 페이징: 20건/페이지
- 수정 링크: 상품 행 클릭 또는 "수정" 버튼

## 상품 수정

- 상품명(한/영), SKU, 브랜드, 카테고리
- 한 줄 요약, 상세 설명
- 소비자가, 프로모션가, 도매가, 재고, MOQ
- 제조사, 원산지
- 노출/메인 노출 체크
- 저장 버튼으로 Supabase 업데이트
