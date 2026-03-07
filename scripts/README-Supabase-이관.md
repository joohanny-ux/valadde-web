# 엑셀 → Supabase 상품 이관 가이드

## 1. 준비

### 1.1 Supabase 프로젝트 설정
1. [Supabase](https://supabase.com) 로그인 후 프로젝트 생성
2. **SQL Editor**에서 `scripts/supabase_schema.sql` 전체 복사 후 실행
3. **설정** → **API**에서 **Project URL**, **service_role key** 확인

### 1.1.1 Service Role Key 찾기
- Supabase 대시보드 → 왼쪽 하단 **톱니바퀴(Project Settings)** → **API**
- **Project API keys** 섹션에서:
  - `anon` (public) → 사용하지 않음
  - **`service_role` (secret)** → `eyJ`로 시작하는 긴 JWT. 이 키 사용
- `sb_publishable_`로 시작하는 키는 anon 계열로, 이관 스크립트에 사용 불가

### 1.2 Python 패키지
```powershell
pip install -r scripts/requirements.txt
```

---

## 2. 테이블 생성 (supabase_schema.sql)

Supabase 대시보드 → **SQL Editor** → 새 쿼리 → `supabase_schema.sql` 내용 붙여넣기 → 실행

생성되는 테이블: `brands`, `categories`, `products`

---

## 3. 실행 방법

### 3.1 미리보기
```powershell
cd c:\dev\valadde-saas
python scripts/import_products_to_supabase.py --dry-run
```

### 3.2 Supabase에 적재
```powershell
# 방법 A: 옵션으로 전달
python scripts/import_products_to_supabase.py --url "https://xxx.supabase.co" --key "eyJ..."

# 방법 B: .env 파일
# 프로젝트 루트에 .env 생성:
# SUPABASE_URL=https://xxx.supabase.co
# SUPABASE_SERVICE_KEY=eyJ...
python scripts/import_products_to_supabase.py

# 방법 C: 환경 변수
$env:SUPABASE_URL = "https://xxx.supabase.co"
$env:SUPABASE_SERVICE_KEY = "eyJ..."
python scripts/import_products_to_supabase.py
```

### 3.3 다른 엑셀 파일
```powershell
python scripts/import_products_to_supabase.py --file "PRODUCT LIST_OTHERBRAND.xlsx" --url "..." --key "..."
```

---

## 4. 주의사항

| 항목 | 설명 |
|------|------|
| **Service Role Key** | anon key가 아닌 **service_role** key 사용 (RLS 우회) |
| **upsert** | 동일 id 존재 시 덮어씀 (재실행 시 업데이트) |
| **이미 테이블 있으면** | schema.sql의 `IF NOT EXISTS`로 안전하게 실행 |
