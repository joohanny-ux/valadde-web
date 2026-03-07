#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ABU BUSINESS HUB — 엑셀 상품 데이터 → Firestore 이관 스크립트

사용법:
  # 1. 미리보기 (DB 미연동, 데이터 검증)
  python import_products_from_excel.py --dry-run

  # 2. Firestore에 실제 적재 (Firebase 설정 필요)
  python import_products_from_excel.py

  # 3. 다른 엑셀 파일 지정
  python import_products_from_excel.py --file "PRODUCT LIST_OTHERBRAND_20250101.xlsx"

  # 4. JSON으로 내보내기 (검토용)
  python import_products_from_excel.py --dry-run --output-json output.json
"""

import argparse
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

# Firebase는 실제 적재 시에만 로드
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

# 엑셀 컬럼명 (정샘물 포맷)
COLUMNS = {
    "no": "NO.",
    "brand": "BRAND",
    "image": "IMAGE",
    "cat1": "CATEGORY I",
    "cat2": "CATEGORY II",
    "cat3": "CATEGORY III",
    "name_kr": "PRODUCT NAME KR",
    "name_kr2": "PRODUCT NAME KR II",
    "name_en": "PRODUCT NAME EN",
    "name_cn_s": "PRODUCT NAME CN S",
    "name_cn_f": "PRODUCT NAME CN F",
    "name_jp": "PRODUCT NAME JP",
    "volume": "VOLUME",
    "qty_inbox": "Q'ty/INBOX",
    "qty_carton": "Q'ty/CTN",
    "shelf_life": "SHELF LIFE (MONTH)",
    "msrp": "MSRP",
    "promo_price": "PROMOTION PRICE",
    "price_vat_excl": "PURCHSE PRICE VAT-",
    "price_vat_incl": "PURCHSE PRICE VAT+",
    "price_rate": "PURCHSE PRICE RATE (VAT+)",
    "barcode": "PRODUCT BARCODE",
    "inbox_barcode": "INBOX BARCODE",
    "carton_barcode": "CARTON BARCODE",
    "carton_size_all": "CARTON SIZE ALL",
    "carton_w": "CARTON SIZE WIDTH",
    "carton_d": "CARTON SIZE DEPTH",
    "carton_h": "CARTON SIZE HEIGHT",
    "carton_cbm": "CARTON SIZE CBM",
    "cartons_pallet": "CARTONS/PALLET",
    "weight_each": "WEIGHT EACH",
    "weight_box": "WEIGHT SINGLE BOX",
    "weight_carton": "WEIGHT CARTON",
    "lead_time": "LEAD TIME",
    "moq": "MOQ",
    "manufacturer": "MANUFACTURER",
    "hs_code": "HS CODE",
    "origin": "COUNTRY OF ORIGIN",
}


def slugify(s: str) -> str:
    """CATEGORY → cat_cosmetics_skincare 형식"""
    if not s or (isinstance(s, float) and pd.isna(s)):
        return ""
    s = str(s).strip().upper()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[-\s]+", "_", s)
    return s.lower()


def safe_str(v) -> str | None:
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    s = str(v).strip()
    return s if s else None


def safe_num(v):
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    try:
        return float(v) if "." in str(v) else int(float(v))
    except (ValueError, TypeError):
        return None


def parse_excel(file_path: str, source_filename: str) -> tuple[list, list, list]:
    """엑셀 파일을 읽어 brands, categories, products 리스트 반환"""
    df = pd.read_excel(file_path, sheet_name=0)

    # 컬럼 존재 여부 확인
    missing = [c for _, c in COLUMNS.items() if c not in df.columns]
    if missing:
        print(f"경고: 다음 컬럼이 없습니다: {missing}")
        print(f"실제 컬럼: {list(df.columns)}")

    brands_seen = set()
    brands = []
    categories_seen = set()
    categories = []
    products = []

    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    for idx, row in df.iterrows():
        row_no = idx + 2  # 엑셀 1행=헤더, 2행=첫 데이터
        no_val = safe_num(row.get(COLUMNS["no"]))
        if no_val is not None:
            row_no = int(no_val)

        brand_raw = safe_str(row.get(COLUMNS["brand"]))
        if not brand_raw:
            continue
        brand_slug = slugify(brand_raw)
        brand_id = f"brand_{brand_slug}" if brand_slug else f"brand_{brand_raw.lower().replace(' ', '_')}"

        if brand_id not in brands_seen:
            brands_seen.add(brand_id)
            brands.append({
                "id": brand_id,
                "name": brand_raw,
                "nameKr": None,
                "slug": brand_slug or brand_raw.lower(),
                "displayOrder": len(brands) + 1,
                "isActive": True,
                "productCount": 0,
                "createdAt": now,
                "updatedAt": now,
            })

        cat1 = safe_str(row.get(COLUMNS["cat1"]))
        cat2 = safe_str(row.get(COLUMNS["cat2"]))
        cat3 = safe_str(row.get(COLUMNS["cat3"]))

        parts = []
        if cat1:
            parts.append(slugify(cat1))
        if cat2:
            parts.append(slugify(cat2))
        if cat3:
            parts.append(slugify(cat3))
        category_id = f"cat_{'_'.join(parts)}" if parts else "cat_uncategorized"

        if category_id not in categories_seen:
            categories_seen.add(category_id)
            cat_name = cat2 or cat1 or "Uncategorized"
            categories.append({
                "id": category_id,
                "name": cat_name,
                "slug": "_".join(parts) if parts else "uncategorized",
                "level": len(parts),
                "displayOrder": len(categories) + 1,
                "isActive": True,
                "productCount": 0,
                "createdAt": now,
                "updatedAt": now,
            })

        name_kr = safe_str(row.get(COLUMNS["name_kr"]))
        if not name_kr:
            name_kr = safe_str(row.get(COLUMNS["name_en"])) or f"Product_{row_no}"
        sku = safe_str(row.get(COLUMNS["name_kr2"])) or f"{brand_raw}_{row_no}"

        img_val = safe_str(row.get(COLUMNS["image"]))
        images = [img_val] if img_val else []

        volume = safe_str(row.get(COLUMNS["volume"]))
        manufacturer = safe_str(row.get(COLUMNS["manufacturer"]))
        origin = safe_str(row.get(COLUMNS["origin"]))
        qty_inbox = safe_num(row.get(COLUMNS["qty_inbox"]))
        qty_carton = safe_num(row.get(COLUMNS["qty_carton"]))
        shelf_life = safe_num(row.get(COLUMNS["shelf_life"]))

        specs = {}
        if volume:
            specs["용량"] = volume
        if qty_inbox is not None:
            specs["박스당수량"] = int(qty_inbox)
        if qty_carton is not None:
            specs["카톤당수량"] = int(qty_carton)
        if shelf_life is not None:
            specs["유통기한"] = f"{int(shelf_life)}개월"
        if origin:
            specs["원산지"] = origin
        if manufacturer:
            specs["제조사"] = manufacturer

        product_id = f"prod_{brand_slug}_{row_no}".replace(" ", "_") if brand_slug else f"prod_{row_no}"

        doc = {
            "name": name_kr,
            "nameEn": safe_str(row.get(COLUMNS["name_en"])),
            "nameZhS": safe_str(row.get(COLUMNS["name_cn_s"])),
            "nameZhF": safe_str(row.get(COLUMNS["name_cn_f"])),
            "nameJp": safe_str(row.get(COLUMNS["name_jp"])),
            "sku": sku[:500] if sku else None,
            "categoryId": category_id,
            "brandId": brand_id,
            "shortDescription": None,
            "description": None,
            "images": images,
            "price": safe_num(row.get(COLUMNS["msrp"])),
            "promotionPrice": safe_num(row.get(COLUMNS["promo_price"])),
            "wholesalePrice": safe_num(row.get(COLUMNS["price_vat_incl"])),
            "purchasePriceVatExcl": safe_num(row.get(COLUMNS["price_vat_excl"])),
            "purchasePriceRate": safe_num(row.get(COLUMNS["price_rate"])),
            "stock": 0,
            "stockStatus": "in_stock",
            "specs": specs if specs else None,
            "tags": [],
            "isActive": True,
            "isFeatured": False,
            "displayOrder": row_no,
            "rowNo": row_no,
            "qtyInbox": safe_num(row.get(COLUMNS["qty_inbox"])),
            "qtyCarton": safe_num(row.get(COLUMNS["qty_carton"])),
            "shelfLifeMonths": safe_num(row.get(COLUMNS["shelf_life"])),
            "barcode": safe_str(row.get(COLUMNS["barcode"])),
            "inboxBarcode": safe_str(row.get(COLUMNS["inbox_barcode"])),
            "cartonBarcode": safe_str(row.get(COLUMNS["carton_barcode"])),
            "cartonSizeAll": safe_str(row.get(COLUMNS["carton_size_all"])),
            "cartonSizeWidth": safe_num(row.get(COLUMNS["carton_w"])),
            "cartonSizeDepth": safe_num(row.get(COLUMNS["carton_d"])),
            "cartonSizeHeight": safe_num(row.get(COLUMNS["carton_h"])),
            "cartonSizeCbm": safe_num(row.get(COLUMNS["carton_cbm"])),
            "cartonsPerPallet": safe_num(row.get(COLUMNS["cartons_pallet"])),
            "weightEach": safe_num(row.get(COLUMNS["weight_each"])),
            "weightSingleBox": safe_num(row.get(COLUMNS["weight_box"])),
            "weightCarton": safe_num(row.get(COLUMNS["weight_carton"])),
            "leadTime": safe_num(row.get(COLUMNS["lead_time"])),
            "moq": safe_num(row.get(COLUMNS["moq"])),
            "manufacturer": manufacturer,
            "hsCode": safe_str(row.get(COLUMNS["hs_code"])),
            "countryOfOrigin": origin,
            "createdAt": now,
            "updatedAt": now,
            "sourceFile": source_filename,
        }

        # None 제거 (Firestore는 null 허용하지만 깔끔하게)
        doc = {k: v for k, v in doc.items() if v is not None}

        products.append({"id": product_id, **doc})

    # productCount 업데이트
    brand_counts = {}
    cat_counts = {}
    for p in products:
        brand_counts[p["brandId"]] = brand_counts.get(p["brandId"], 0) + 1
        cat_counts[p["categoryId"]] = cat_counts.get(p["categoryId"], 0) + 1
    for b in brands:
        b["productCount"] = brand_counts.get(b["id"], 0)
    for c in categories:
        c["productCount"] = cat_counts.get(c["id"], 0)

    return brands, categories, products


def to_firestore_format(data: dict) -> dict:
    """Firestore에 넣을 때 None 제거, 중첩 구조 처리"""
    result = {}
    for k, v in data.items():
        if v is None:
            continue
        if isinstance(v, dict):
            result[k] = to_firestore_format(v)
        elif isinstance(v, list):
            result[k] = [x for x in v if x is not None]
        else:
            result[k] = v
    return result


def write_to_firestore(brands: list, categories: list, products: list, cred_path: str | None = None):
    """Firestore에 적재"""
    if not FIREBASE_AVAILABLE:
        print("오류: firebase-admin이 설치되지 않았습니다.")
        print("  pip install firebase-admin")
        return False

    if not cred_path:
        cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_path or not os.path.exists(cred_path):
        print("오류: Firebase 서비스 계정 키 파일이 필요합니다.")
        print("  1. Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성")
        print("  2. JSON 파일을 다운로드 후, 다음 중 하나 실행:")
        print("     set GOOGLE_APPLICATION_CREDENTIALS=경로\\serviceAccountKey.json")
        print("     python import_products_from_excel.py --credentials 경로\\serviceAccountKey.json")
        return False

    cred = credentials.Certificate(cred_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    db = firestore.client()

    # 1. brands, categories 적재
    batch = db.batch()
    for b in brands:
        doc = to_firestore_format({k: v for k, v in b.items() if k != "id"})
        ref = db.collection("brands").document(b["id"])
        batch.set(ref, doc)
    for c in categories:
        doc = to_firestore_format({k: v for k, v in c.items() if k != "id"})
        ref = db.collection("categories").document(c["id"])
        batch.set(ref, doc)
    batch.commit()
    print("  brands, categories 적재 완료")

    # 2. products 적재 (Firestore batch 최대 500건)
    for i in range(0, len(products), 500):
        batch = db.batch()
        chunk = products[i : i + 500]
        for p in chunk:
            doc = to_firestore_format({k: v for k, v in p.items() if k != "id"})
            ref = db.collection("products").document(p["id"])
            batch.set(ref, doc)
        batch.commit()
        print(f"  products {i + 1}~{i + len(chunk)} 적재 완료")

    return True


def main():
    # Windows 콘솔 한글 출력
    import sys
    if sys.stdout.encoding and "utf" not in sys.stdout.encoding.lower():
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="엑셀 상품 데이터 → Firestore 이관")
    parser.add_argument(
        "--file", "-f",
        default="PRODUCT LIST_JUNGSAEMMOOL_20251015.xlsx",
        help="엑셀 파일 경로",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="DB에 쓰지 않고 미리보기만",
    )
    parser.add_argument(
        "--output-json", "-o",
        help="JSON 파일로 내보내기 (--dry-run과 함께 사용)",
    )
    parser.add_argument(
        "--credentials", "-c",
        help="Firebase 서비스 계정 JSON 경로",
    )
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent.parent
    file_path = Path(args.file)
    if not file_path.is_absolute():
        file_path = base_dir / file_path
    if not file_path.exists():
        print(f"오류: 파일을 찾을 수 없습니다: {file_path}")
        return 1

    print(f"엑셀 파일 읽는 중: {file_path}")
    brands, categories, products = parse_excel(str(file_path), file_path.name)

    print(f"\n파싱 결과:")
    print(f"  브랜드: {len(brands)}개 - {[b['name'] for b in brands]}")
    print(f"  카테고리: {len(categories)}개")
    print(f"  상품: {len(products)}개")
    if products:
        print(f"\n첫 상품 미리보기:")
        p = products[0]
        for k, v in list(p.items())[:12]:
            sv = str(v) if v is not None else ""
            if len(sv) > 50:
                sv = sv[:50] + "..."
            print(f"  {k}: {sv}")

    if args.output_json:
        out_path = Path(args.output_json)
        data = {"brands": brands, "categories": categories, "products": products}
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\nJSON 저장: {out_path}")

    if args.dry_run:
        print("\n[DRY-RUN] Firestore 적재 생략")
        return 0

    print("\nFirestore에 적재합니다...")
    if write_to_firestore(brands, categories, products, args.credentials):
        print("완료.")
    else:
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
