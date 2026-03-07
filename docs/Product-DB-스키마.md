# ABU BUSINESS HUB — Product DB 스키마

**문서 버전:** 2.0  
**작성일:** 2025-03-04  
**수정일:** 2025-03-04 (정샘물 포맷 기준 반영)  
**기준 DB:** Google Cloud Firestore (권장)  
**기준 데이터:** `PRODUCT LIST_JUNGSAEMMOOL_20251015.xlsx` (정샘물 브랜드, 327건, 38컬럼)

---

## 1. 개요

본 문서는 **Product(상품)** 관련 DB 스키마를 정의합니다.  
**브랜드별 상품 리스트 엑셀 포맷**을 기준으로 설계하여, 엑셀 → DB 일괄 이관이 가능합니다.

### 1.1 기준 엑셀 포맷 (브랜드별 공통)
- **파일명 예시**: `PRODUCT LIST_{BRAND}_{YYMMDD}.xlsx`
- **컬럼 수**: 38개
- **용도**: 정샘물(JUNGSAEMMOOL) 등 브랜드별 상품 자료의 기본 포맷

### 1.2 컬렉션/테이블 구성
| 컬렉션 ID | 설명 | 화면 연동 |
|-----------|------|----------|
| `products` | 상품 마스터 | 목록, 상세, 관리자 |
| `categories` | 카테고리 (3단계) | 필터, 상품 분류 |
| `brands` | 브랜드 | 필터, 상품 분류 |

---

## 2. 엑셀 → DB 매핑 (브랜드별 상품 포맷)

### 2.1 엑셀 컬럼 목록 (38개)
| No. | 엑셀 컬럼명 | products 필드 | 비고 |
|-----|-------------|---------------|------|
| 1 | NO. | `rowNo` 또는 문서 ID 생성 시 참조 | 엑셀 행 번호 |
| 2 | BRAND | → `brandId` (brands 매칭) | 예: JUNGSAEMMOOL |
| 3 | IMAGE | `images` | URL 또는 경로, 없으면 `[]` |
| 4 | CATEGORY I | `categoryId` (1단계) | 예: COSMETICS |
| 5 | CATEGORY II | `categoryId` (2단계) | 예: SKIN CARE |
| 6 | CATEGORY III | `categoryId` (3단계) | 하위 없으면 null |
| 7 | PRODUCT NAME KR | `name` | 상품명 (한글), 검색 대상 |
| 8 | PRODUCT NAME KR II | `sku` 또는 `internalCode` | 내부 식별용 (예: BRAND_ProductName) |
| 9 | PRODUCT NAME EN | `nameEn` | 영어 |
| 10 | PRODUCT NAME CN S | `nameZhS` | 중국어 간체 |
| 11 | PRODUCT NAME CN F | `nameZhF` | 중국어 번체 |
| 12 | PRODUCT NAME JP | `nameJp` | 일본어 |
| 13 | VOLUME | `specs.용량` | 예: 50ml |
| 14 | Q'ty/INBOX | `qtyInbox` | 박스당 수량 |
| 15 | Q'ty/CTN | `qtyCarton` | 카톤당 수량 |
| 16 | SHELF LIFE (MONTH) | `shelfLifeMonths` | 유통기한(월) |
| 17 | MSRP | `price` (msrp) | 소비자 권장가 |
| 18 | PROMOTION PRICE | `promotionPrice` | 프로모션가 |
| 19 | PURCHSE PRICE VAT- | `purchasePriceVatExcl` | 구매가(부가세 미포함) |
| 20 | PURCHSE PRICE VAT+ | `wholesalePrice` | 구매가(부가세 포함) = 도매가 |
| 21 | PURCHSE PRICE RATE (VAT+) | `purchasePriceRate` | 구매가율 |
| 22 | PRODUCT BARCODE | `barcode` | 상품 바코드 |
| 23 | INBOX BARCODE | `inboxBarcode` | 인박스 바코드 |
| 24 | CARTON BARCODE | `cartonBarcode` | 카톤 바코드 |
| 25 | CARTON SIZE ALL | `cartonSizeAll` | 카톤 크기 전체 문자열 |
| 26 | CARTON SIZE WIDTH | `cartonSizeWidth` | 가로(cm) |
| 27 | CARTON SIZE DEPTH | `cartonSizeDepth` | 세로(cm) |
| 28 | CARTON SIZE HEIGHT | `cartonSizeHeight` | 높이(cm) |
| 29 | CARTON SIZE CBM | `cartonSizeCbm` | CBM |
| 30 | CARTONS/PALLET | `cartonsPerPallet` | 팔레트당 카톤 수 |
| 31 | WEIGHT EACH | `weightEach` | 단품 무게(g) |
| 32 | WEIGHT SINGLE BOX | `weightSingleBox` | 단박스 무게 |
| 33 | WEIGHT CARTON | `weightCarton` | 카톤 무게 |
| 34 | LEAD TIME | `leadTime` | 리드타임(일) |
| 35 | MOQ | `moq` | 최소 주문 수량 |
| 36 | MANUFACTURER | `manufacturer` | 제조사 |
| 37 | HS CODE | `hsCode` | HS코드 (관세 분류) |
| 38 | COUNTRY OF ORIGIN | `countryOfOrigin` | 원산지 |

---

## 3. products (상품) — 필드 정의

### 3.1 기본·노출 필드 (화면용)
| 필드명 | 타입 | 필수 | 설명 | 엑셀 매핑 |
|--------|------|------|------|------------|
| `id` | string | ✓ | 문서 ID | 자동 생성 (브랜드_행번호 등) |
| `name` | string | ✓ | 상품명 (한글) | PRODUCT NAME KR |
| `nameEn` | string |  | 상품명 (영어) | PRODUCT NAME EN |
| `nameZhS` | string |  | 상품명 (중국어 간체) | PRODUCT NAME CN S |
| `nameZhF` | string |  | 상품명 (중국어 번체) | PRODUCT NAME CN F |
| `nameJp` | string |  | 상품명 (일본어) | PRODUCT NAME JP |
| `sku` | string |  | 내부 코드/SKU | PRODUCT NAME KR II 또는 별도 생성 |
| `categoryId` | string | ✓ | 카테고리 ID (3단계 조합) | CATEGORY I + II + III |
| `brandId` | string | ✓ | 브랜드 ID | BRAND → brands.id |
| `shortDescription` | string |  | 한 줄 요약 | 관리자 입력 (엑셀 없음) |
| `description` | string |  | 상세 설명 (HTML) | 관리자 입력 또는 에이전트 생성 |
| `images` | array |  | 이미지 URL 배열 | IMAGE (단일→배열) |
| `price` | number |  | 소비자 권장가 (MSRP) | MSRP |
| `promotionPrice` | number |  | 프로모션가 | PROMOTION PRICE |
| `wholesalePrice` | number |  | 도매가 (부가세 포함) | PURCHSE PRICE VAT+ |
| `purchasePriceVatExcl` | number |  | 구매가 (부가세 미포함) | PURCHSE PRICE VAT- |
| `purchasePriceRate` | number |  | 구매가율 | PURCHSE PRICE RATE |
| `stock` | number |  | 재고 수량 | 별도 관리 (엑셀 없음) |
| `stockStatus` | string |  | 재고 상태 | `in_stock` 등 |
| `specs` | map |  | 스펙 (용량, 무게 등) | VOLUME, WEIGHT EACH 등 조합 |
| `tags` | array |  | 검색용 태그 | 관리자 입력 |
| `isActive` | boolean | ✓ | 노출 여부 | 기본 `true` |
| `isFeatured` | boolean |  | 메인 노출 | 기본 `false` |
| `displayOrder` | number |  | 정렬 순서 | NO. 또는 0 |
| `rowNo` | number |  | 엑셀 행 번호 (이관 추적) | NO. |

### 3.2 B2B·물류 필드 (바이어·관리자용)
| 필드명 | 타입 | 설명 | 엑셀 매핑 |
|--------|------|------|------------|
| `qtyInbox` | number | 박스당 수량 | Q'ty/INBOX |
| `qtyCarton` | number | 카톤당 수량 | Q'ty/CTN |
| `shelfLifeMonths` | number | 유통기한(월) | SHELF LIFE (MONTH) |
| `barcode` | string | 상품 바코드 | PRODUCT BARCODE |
| `inboxBarcode` | string | 인박스 바코드 | INBOX BARCODE |
| `cartonBarcode` | string | 카톤 바코드 | CARTON BARCODE |
| `cartonSizeAll` | string | 카톤 크기 전체 | CARTON SIZE ALL |
| `cartonSizeWidth` | number | 카톤 가로(cm) | CARTON SIZE WIDTH |
| `cartonSizeDepth` | number | 카톤 세로(cm) | CARTON SIZE DEPTH |
| `cartonSizeHeight` | number | 카톤 높이(cm) | CARTON SIZE HEIGHT |
| `cartonSizeCbm` | number | CBM | CARTON SIZE CBM |
| `cartonsPerPallet` | number | 팔레트당 카톤 수 | CARTONS/PALLET |
| `weightEach` | number | 단품 무게(g) | WEIGHT EACH |
| `weightSingleBox` | number | 단박스 무게 | WEIGHT SINGLE BOX |
| `weightCarton` | number | 카톤 무게 | WEIGHT CARTON |
| `leadTime` | number | 리드타임(일) | LEAD TIME |
| `moq` | number | 최소 주문 수량 | MOQ |
| `manufacturer` | string | 제조사 | MANUFACTURER |
| `hsCode` | string | HS코드 | HS CODE |
| `countryOfOrigin` | string | 원산지 | COUNTRY OF ORIGIN |

### 3.3 메타·시스템 필드
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `createdAt` | timestamp | 생성일시 |
| `updatedAt` | timestamp | 수정일시 |
| `createdBy` | string | 생성자 ID |
| `updatedBy` | string | 수정자 ID |
| `sourceFile` | string | 이관 출처 파일명 (예: PRODUCT LIST_JUNGSAEMMOOL_20251015.xlsx) |
| `metaTitle` | string | SEO 타이틀 (2차) |
| `metaDescription` | string | SEO 설명 (2차) |

### 3.4 stockStatus 코드
| 값 | 설명 |
|----|------|
| `in_stock` | 재고 있음 |
| `low_stock` | 재고 부족 (임계값 이하) |
| `out_of_stock` | 품절 |
| `discontinued` | 단종 |
| `preorder` | 예약 판매 |

### 3.5 specs 권장 구조 (엑셀 VOLUME 등 활용)
`specs`는 상세페이지 스펙 테이블용입니다. 엑셀 데이터를 다음과 같이 매핑합니다.
```json
{
  "용량": "50ml",
  "박스당수량": 12,
  "카톤당수량": 144,
  "유통기한": "24개월",
  "원산지": "대한민국",
  "제조사": "정샘물"
}
```

### 3.6 Firestore 문서 예시 (정샘물 포맷 기반)
```json
{
  "name": "정샘물 에센셜 물 스틱",
  "nameEn": "JUNGSAEMMOOL Essential Mool Stick",
  "nameZhS": "",
  "nameZhF": "",
  "nameJp": "",
  "sku": "JUNGSAEMMOOL_JUNGSAEMMOOL Essential Mool Stick",
  "categoryId": "cat_cosmetics_skincare",
  "brandId": "brand_jungsaemmool",
  "shortDescription": "",
  "description": "",
  "images": [],
  "price": 35000,
  "promotionPrice": null,
  "wholesalePrice": 28000,
  "purchasePriceVatExcl": 25455,
  "purchasePriceRate": 80,
  "stock": 0,
  "stockStatus": "in_stock",
  "specs": {
    "용량": "15g",
    "박스당수량": 12,
    "카톤당수량": 144,
    "유통기한": "24개월",
    "원산지": "대한민국"
  },
  "tags": [],
  "isActive": true,
  "isFeatured": false,
  "displayOrder": 1,
  "rowNo": 1,
  "qtyInbox": 12,
  "qtyCarton": 144,
  "shelfLifeMonths": 24,
  "barcode": "",
  "moq": 1,
  "manufacturer": "정샘물",
  "hsCode": "",
  "countryOfOrigin": "대한민국",
  "cartonSizeWidth": null,
  "cartonSizeDepth": null,
  "cartonSizeHeight": null,
  "cartonSizeCbm": null,
  "weightEach": null,
  "weightCarton": null,
  "leadTime": null,
  "createdAt": "2025-03-04T10:00:00Z",
  "updatedAt": "2025-03-04T10:00:00Z",
  "sourceFile": "PRODUCT LIST_JUNGSAEMMOOL_20251015.xlsx"
}
```

### 3.7 Firestore 복합 인덱스 (필요 시)
| 컬렉션 | 필드 | 용도 |
|--------|------|------|
| products | `isActive` ASC, `displayOrder` ASC, `createdAt` DESC | 목록 기본 정렬 |
| products | `isActive` ASC, `categoryId` ASC, `createdAt` DESC | 카테고리 필터 |
| products | `isActive` ASC, `brandId` ASC, `createdAt` DESC | 브랜드 필터 |
| products | `isActive` ASC, `price` ASC | 가격순 정렬 |
| products | `isActive` ASC, `isFeatured` ASC, `createdAt` DESC | 메인 인기상품 |

---

## 4. categories (카테고리) — 3단계 계층

엑셀의 **CATEGORY I, II, III**를 지원합니다.

### 4.1 categoryId 규칙
- **1단계만**: `cat_{slug}` 예: `cat_cosmetics`
- **2단계**: `cat_{I}_{II}` 예: `cat_cosmetics_skincare`
- **3단계**: `cat_{I}_{II}_{III}` 예: `cat_cosmetics_skincare_cream`

### 4.2 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 엑셀 매핑 |
|--------|------|------|------|------------|
| `id` | string | ✓ | 문서 ID (slug 기반) | CATEGORY I/II/III 조합 |
| `name` | string | ✓ | 카테고리명 | COSMETICS, SKIN CARE 등 |
| `nameKr` | string |  | 한글명 | 관리자 입력 |
| `nameEn` | string |  | 영어 | 엑셀 값 그대로 |
| `slug` | string | ✓ | URL용 (소문자, _ 구분) | cosmetics, skin_care |
| `parentId` | string |  | 상위 카테고리 ID | 1단계=null, 2단계=1단계 id |
| `level` | number | ✓ | 단계 (1, 2, 3) | 1=CATEGORY I, 2=II, 3=III |
| `displayOrder` | number | ✓ | 표시 순서 | `1` |
| `isActive` | boolean | ✓ | 사용 여부 | `true` |
| `productCount` | number |  | (캐시) 상품 수 | 집계 |
| `createdAt` | timestamp | ✓ | 생성일시 | |
| `updatedAt` | timestamp | ✓ | 수정일시 | |

### 4.3 정샘물 엑셀 예시 → categories
| CATEGORY I | CATEGORY II | CATEGORY III | categoryId |
|------------|-------------|--------------|------------|
| COSMETICS | SKIN CARE | (없음) | `cat_cosmetics_skincare` |
| COSMETICS | MAKEUP | LIP | `cat_cosmetics_makeup_lip` |

### 4.4 Firestore 문서 예시 (2단계)
```json
{
  "id": "cat_cosmetics_skincare",
  "name": "SKIN CARE",
  "nameKr": "스킨케어",
  "slug": "skincare",
  "parentId": "cat_cosmetics",
  "level": 2,
  "displayOrder": 1,
  "isActive": true,
  "productCount": 120,
  "createdAt": "2025-03-04T00:00:00Z",
  "updatedAt": "2025-03-04T00:00:00Z"
}
```

---

## 5. brands (브랜드)

### 5.1 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `id` | string | ✓ | 문서 ID | `brand_oliveyoung` |
| `name` | string | ✓ | 브랜드명 | `올리브영` |
| `nameEn` | string |  | 영어 | `Olive Young` |
| `nameZh` | string |  | 중국어 | `欧利芙洋` |
| `slug` | string | ✓ | URL용 | `oliveyoung` |
| `logoUrl` | string |  | 로고 이미지 URL | `https://...` |
| `description` | string |  | 브랜드 소개 | |
| `websiteUrl` | string |  | 공식 사이트 | `https://...` |
| `displayOrder` | number | ✓ | 표시 순서 | `1` |
| `isActive` | boolean | ✓ | 사용 여부 | `true` |
| `productCount` | number |  | (캐시) 상품 수 | `80` |
| `createdAt` | timestamp | ✓ | 생성일시 | |
| `updatedAt` | timestamp | ✓ | 수정일시 | |

### 5.2 엑셀 BRAND → brands 매핑
| 엑셀 BRAND | brandId | 비고 |
|------------|---------|------|
| JUNGSAEMMOOL | `brand_jungsaemmool` | 정샘물 |

### 5.3 Firestore 문서 예시 (정샘물)
```json
{
  "id": "brand_jungsaemmool",
  "name": "JUNGSAEMMOOL",
  "nameKr": "정샘물",
  "slug": "jungsaemmool",
  "logoUrl": "",
  "displayOrder": 1,
  "isActive": true,
  "productCount": 327,
  "createdAt": "2025-03-04T00:00:00Z",
  "updatedAt": "2025-03-04T00:00:00Z"
}
```

---

## 6. 화면-필드 매핑

### 6.1 P-02 상품 목록 (그리드 카드)
| 표시 항목 | products 필드 |
|----------|----------------|
| 이미지 | `images[0]` |
| 상품명 | `name` |
| 가격 | `price` (또는 `wholesalePrice` · 정책에 따름) |
| 브랜드 | `brandId` → brands.name 조인 |
| 카테고리 | `categoryId` → categories.name 조인 |
| 품절 배지 | `stockStatus` = out_of_stock |

### 6.2 P-03 상품 상세
| 표시 항목 | products 필드 |
|----------|----------------|
| 이미지 갤러리 | `images` |
| 상품명 | `name` |
| 브랜드 | `brandId` → brands |
| 카테고리 | `categoryId` → categories |
| 가격 | `price`, `wholesalePrice` (노출 정책) |
| 스펙 | `specs` |
| 상세 설명 | `description` |
| 재고 상태 | `stockStatus`, `stock` (선택 노출) |

### 6.3 A-04 상품 등록/수정 폼 (엑셀 포맷 기반)
| 입력 항목 | products 필드 | 탭/섹션 |
|----------|----------------|----------|
| 상품명 (한/영/중/일) | `name`, `nameEn`, `nameZhS`, `nameZhF`, `nameJp` | 기본 |
| SKU/내부코드 | `sku` | 기본 |
| 카테고리 (3단계) | `categoryId` | 기본 |
| 브랜드 | `brandId` | 기본 |
| 한 줄 요약 | `shortDescription` | 기본 |
| 상세 설명 | `description` | 기본 |
| 이미지 | `images` | 기본 |
| MSRP / 프로모션가 | `price`, `promotionPrice` | 가격 |
| 도매가 / 구매가 | `wholesalePrice`, `purchasePriceVatExcl` | 가격 |
| 재고 | `stock` | 가격 |
| 용량, 유통기한 등 | `specs` | 스펙 |
| MOQ, 리드타임 | `moq`, `leadTime` | B2B |
| 바코드 | `barcode`, `inboxBarcode`, `cartonBarcode` | B2B |
| 카톤 크기/무게 | `cartonSize*`, `weight*` | B2B |
| 제조사, 원산지, HS코드 | `manufacturer`, `countryOfOrigin`, `hsCode` | B2B |
| 태그 | `tags` | 기본 |
| 노출 여부 / 메인 노출 | `isActive`, `isFeatured` | 기본 |

---

## 7. 엑셀 일괄 이관 (브랜드별 포맷)

### 7.1 지원 파일
- **포맷**: `PRODUCT LIST_{BRAND}_{YYMMDD}.xlsx`
- **시트**: 첫 번째 시트(Sheet1) 사용
- **컬럼**: 2절 매핑표 기준 38개 컬럼 (순서·이름 일치)

### 7.2 이관 절차
1. **brands**: BRAND 컬럼 고유값으로 브랜드 문서 생성/업데이트
2. **categories**: CATEGORY I, II, III 고유 조합으로 카테고리 문서 생성
3. **products**: 각 행을 products 문서로 변환, `brandId`, `categoryId` 매칭

### 7.3 Python 이관 스크립트 예시 (개념)
```
# Cursor에 "엑셀을 Firestore products에 넣는 스크립트 만들어줘" 요청 시 참고
# 입력: PRODUCT LIST_JUNGSAEMMOOL_20251015.xlsx
# 출력: Firestore products 컬렉션 + brands, categories
# openpyxl 또는 pandas 사용
```

### 7.4 유의사항
| 항목 | 처리 |
|------|------|
| IMAGE 비어있음 | `images: []` 로 저장, 이후 관리자 대시보드에서 추가 |
| CATEGORY III 비어있음 | 2단계까지만 사용, `cat_{I}_{II}` |
| 숫자 NaN | `null` 또는 0 |
| PRODUCT NAME KR II | `sku` 로 사용 (고유하지 않으면 NO.+BRAND 조합으로 생성) |

---

## 8. Cloud SQL 사용 시 (참고)

Firestore 대신 Cloud SQL(MySQL/PostgreSQL)을 사용할 경우, 아래와 같은 테이블 구조로 변환할 수 있습니다.

### products 테이블 (엑셀 포맷 반영)
```sql
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_zh_s VARCHAR(255),
  name_zh_f VARCHAR(255),
  name_jp VARCHAR(255),
  sku VARCHAR(255),
  category_id VARCHAR(100) NOT NULL,
  brand_id VARCHAR(50) NOT NULL,
  short_description TEXT,
  description TEXT,
  images JSON,
  price DECIMAL(12,2),
  promotion_price DECIMAL(12,2),
  wholesale_price DECIMAL(12,2),
  purchase_price_vat_excl DECIMAL(12,2),
  purchase_price_rate DECIMAL(5,2),
  stock INT DEFAULT 0,
  stock_status VARCHAR(20) DEFAULT 'in_stock',
  specs JSON,
  tags JSON,
  qty_inbox INT,
  qty_carton INT,
  shelf_life_months INT,
  barcode VARCHAR(50),
  inbox_barcode VARCHAR(50),
  carton_barcode VARCHAR(50),
  carton_size_width DECIMAL(10,2),
  carton_size_depth DECIMAL(10,2),
  carton_size_height DECIMAL(10,2),
  carton_size_cbm DECIMAL(10,4),
  cartons_per_pallet INT,
  weight_each DECIMAL(10,2),
  weight_single_box DECIMAL(10,2),
  weight_carton DECIMAL(10,2),
  lead_time INT,
  moq INT,
  manufacturer VARCHAR(100),
  hs_code VARCHAR(20),
  country_of_origin VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  row_no INT,
  source_file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_by VARCHAR(50),
  INDEX idx_category (category_id),
  INDEX idx_brand (brand_id),
  INDEX idx_active_order (is_active, display_order, created_at DESC)
);
```

### categories 테이블
```sql
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  parent_id VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  product_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### brands 테이블
```sql
CREATE TABLE brands (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  product_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

---

## 9. 정샘물 엑셀 포맷 요약 (Quick Reference)

| # | 엑셀 컬럼 | products 필드 |
|---|-----------|---------------|
| 1 | NO. | rowNo |
| 2 | BRAND | brandId |
| 3 | IMAGE | images |
| 4–6 | CATEGORY I/II/III | categoryId |
| 7 | PRODUCT NAME KR | name |
| 8 | PRODUCT NAME KR II | sku |
| 9–12 | PRODUCT NAME EN/CN S/CN F/JP | nameEn, nameZhS, nameZhF, nameJp |
| 13 | VOLUME | specs.용량 |
| 14–15 | Q'ty/INBOX, Q'ty/CTN | qtyInbox, qtyCarton |
| 16 | SHELF LIFE (MONTH) | shelfLifeMonths |
| 17–21 | MSRP, PROMOTION PRICE, PURCHSE PRICE* | price, promotionPrice, wholesalePrice 등 |
| 22–24 | *BARCODE | barcode, inboxBarcode, cartonBarcode |
| 25–33 | CARTON SIZE*, WEIGHT* | cartonSize*, weight* |
| 34–38 | LEAD TIME, MOQ, MANUFACTURER, HS CODE, COUNTRY OF ORIGIN | leadTime, moq, manufacturer, hsCode, countryOfOrigin |

---

**다음 단계**: 엑셀 → Supabase 이관 (`scripts/import_products_to_supabase.py`, `scripts/supabase_schema.sql`) 참고.
