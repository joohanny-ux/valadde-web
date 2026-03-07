# 엑셀 → Firestore 상품 이관 가이드

## 1. 준비

### 1.1 Python 패키지 설치
```powershell
cd c:\dev\valadde-saas
pip install -r scripts/requirements.txt
```

### 1.2 Firebase/Firestore 설정 (실제 DB 적재 시)
1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 생성 또는 선택
2. **Firestore Database** 생성 (테스트/프로덕션 모드 선택)
3. **프로젝트 설정** → **서비스 계정** → **새 비공개 키 생성** → JSON 다운로드
4. JSON 파일을 프로젝트 폴더에 저장 (예: `config/firebase-service-account.json`)

---

## 2. 실행 방법

### 2.1 미리보기 (DB 없이 데이터 검증)
```powershell
cd c:\dev\valadde-saas
python scripts/import_products_from_excel.py --dry-run
```
→ brands, categories, products 개수와 첫 상품 미리보기 출력

### 2.2 JSON으로 내보내기 (검토용)
```powershell
python scripts/import_products_from_excel.py --dry-run --output-json scripts/output_preview.json
```

### 2.3 Firestore에 실제 적재
```powershell
# 방법 A: 환경 변수로 키 경로 지정
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\serviceAccountKey.json"
python scripts/import_products_from_excel.py

# 방법 B: --credentials 옵션
python scripts/import_products_from_excel.py --credentials "config/firebase-service-account.json"
```

### 2.4 다른 엑셀 파일 사용
```powershell
python scripts/import_products_from_excel.py --file "PRODUCT LIST_OTHERBRAND_20250101.xlsx"
```

---

## 3. 이관 결과

| 컬렉션 | 내용 |
|--------|------|
| `brands` | 브랜드 마스터 (BRAND 컬럼에서 추출) |
| `categories` | 카테고리 (CATEGORY I/II/III 조합) |
| `products` | 상품 마스터 (327건 등) |

---

## 4. 문제 해결

| 증상 | 조치 |
|------|------|
| `ModuleNotFoundError: No module named 'pandas'` | `pip install -r scripts/requirements.txt` |
| `ModuleNotFoundError: No module named 'firebase_admin'` | `pip install firebase-admin` |
| `오류: Firebase 서비스 계정 키 파일이 필요합니다` | 1.2 단계 진행, 환경변수 또는 --credentials 설정 |
| `파일을 찾을 수 없습니다` | 엑셀 파일을 `c:\dev\valadde-saas\` 에 두거나 --file 에 전체 경로 지정 |
