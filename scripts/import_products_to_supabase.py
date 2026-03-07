#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ABU BUSINESS HUB — 엑셀 상품 데이터 → Supabase 이관 스크립트

사용법:
  # 1. 미리보기 (DB 미연동)
  python import_products_to_supabase.py --dry-run

  # 2. Supabase에 실제 적재
  python import_products_to_supabase.py --url YOUR_SUPABASE_URL --key YOUR_SERVICE_ROLE_KEY

  # 3. .env 파일 사용 (SUPABASE_URL, SUPABASE_SERVICE_KEY)
  python import_products_to_supabase.py
"""

import argparse
import json
import os
from pathlib import Path

from import_products_from_excel import parse_excel

try:
    from supabase import create_client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False


def camel_to_snake(name: str) -> str:
    """camelCase → snake_case"""
    import re
    s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1).lower()


# products camelCase → Supabase snake_case 매핑
PRODUCT_FIELD_MAP = {
    "nameEn": "name_en",
    "nameZhS": "name_zh_s",
    "nameZhF": "name_zh_f",
    "nameJp": "name_jp",
    "categoryId": "category_id",
    "brandId": "brand_id",
    "shortDescription": "short_description",
    "promotionPrice": "promotion_price",
    "wholesalePrice": "wholesale_price",
    "purchasePriceVatExcl": "purchase_price_vat_excl",
    "purchasePriceRate": "purchase_price_rate",
    "stockStatus": "stock_status",
    "isActive": "is_active",
    "isFeatured": "is_featured",
    "displayOrder": "display_order",
    "rowNo": "row_no",
    "qtyInbox": "qty_inbox",
    "qtyCarton": "qty_carton",
    "shelfLifeMonths": "shelf_life_months",
    "inboxBarcode": "inbox_barcode",
    "cartonBarcode": "carton_barcode",
    "cartonSizeAll": "carton_size_all",
    "cartonSizeWidth": "carton_size_width",
    "cartonSizeDepth": "carton_size_depth",
    "cartonSizeHeight": "carton_size_height",
    "cartonSizeCbm": "carton_size_cbm",
    "cartonsPerPallet": "cartons_per_pallet",
    "weightEach": "weight_each",
    "weightSingleBox": "weight_single_box",
    "weightCarton": "weight_carton",
    "leadTime": "lead_time",
    "hsCode": "hs_code",
    "countryOfOrigin": "country_of_origin",
    "sourceFile": "source_file",
}


# 정수형 컬럼 (float→int 변환 필요)
INT_COLUMNS = {"display_order", "row_no", "qty_inbox", "qty_carton", "shelf_life_months",
               "cartons_per_pallet", "lead_time", "moq", "stock"}


def product_to_supabase_row(p: dict) -> dict:
    """product dict → Supabase row (snake_case)"""
    row = {"id": p["id"]}
    for k, v in p.items():
        if k == "id" or v is None:
            continue
        sk = PRODUCT_FIELD_MAP.get(k, camel_to_snake(k))
        if sk in INT_COLUMNS and isinstance(v, (int, float)):
            row[sk] = int(v)
        else:
            row[sk] = v
    return row


def write_to_supabase(brands: list, categories: list, products: list, url: str, key: str) -> bool:
    """Supabase에 적재"""
    if not SUPABASE_AVAILABLE:
        print("오류: supabase 패키지가 설치되지 않았습니다.")
        print("  pip install supabase")
        return False

    if not url or not key:
        print("오류: Supabase URL과 Service Role Key가 필요합니다.")
        print("  --url https://xxx.supabase.co --key eyJ...")
        print("  또는 .env에 SUPABASE_URL, SUPABASE_SERVICE_KEY 설정")
        return False

    client = create_client(url, key)

    # 1. brands
    brand_rows = []
    for b in brands:
        r = {"id": b["id"], "name": b["name"], "slug": b["slug"], "display_order": b.get("displayOrder", b.get("display_order", 0)),
             "is_active": b.get("isActive", True), "product_count": b.get("productCount", b.get("product_count", 0))}
        brand_rows.append(r)
    client.table("brands").upsert(brand_rows, on_conflict="id").execute()
    print(f"  brands {len(brands)}건 적재 완료")

    # 2. categories
    cat_rows = []
    for c in categories:
        r = {"id": c["id"], "name": c["name"], "slug": c["slug"], "level": c.get("level", 1),
             "display_order": c.get("displayOrder", c.get("display_order", 0)),
             "is_active": c.get("isActive", True), "product_count": c.get("productCount", c.get("product_count", 0))}
        cat_rows.append(r)
    client.table("categories").upsert(cat_rows, on_conflict="id").execute()
    print(f"  categories {len(categories)}건 적재 완료")

    # 3. products (배치 100건씩)
    batch_size = 100
    for i in range(0, len(products), batch_size):
        chunk = products[i : i + batch_size]
        rows = [product_to_supabase_row(p) for p in chunk]
        client.table("products").upsert(rows, on_conflict="id").execute()
        print(f"  products {i + 1}~{i + len(chunk)} 적재 완료")

    return True


def main():
    import sys
    if sys.stdout.encoding and "utf" not in (sys.stdout.encoding or "").lower():
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="엑셀 → Supabase 이관")
    parser.add_argument("--file", "-f", default="PRODUCT LIST_JUNGSAEMMOOL_20251015.xlsx", help="엑셀 파일")
    parser.add_argument("--dry-run", action="store_true", help="미리보기만")
    parser.add_argument("--output-json", "-o", help="JSON 내보내기")
    parser.add_argument("--url", help="Supabase URL (https://xxx.supabase.co)")
    parser.add_argument("--key", help="Supabase Service Role Key")
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent.parent
    file_path = Path(args.file)
    if not file_path.is_absolute():
        file_path = base_dir / file_path
    if not file_path.exists():
        print(f"오류: 파일 없음 - {file_path}")
        return 1

    print(f"엑셀 읽는 중: {file_path}")
    brands, categories, products = parse_excel(str(file_path), file_path.name)

    print(f"\n파싱 결과: 브랜드 {len(brands)}개, 카테고리 {len(categories)}개, 상품 {len(products)}개")
    if products:
        p = products[0]
        print(f"첫 상품: {p.get('name')} / {p.get('price')}원")

    if args.output_json:
        data = {"brands": brands, "categories": categories, "products": products}
        with open(args.output_json, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"JSON 저장: {args.output_json}")

    if args.dry_run:
        print("\n[DRY-RUN] Supabase 적재 생략")
        return 0

    # .env 로드
    env_path = base_dir / ".env"
    try:
        from dotenv import load_dotenv
        load_dotenv(env_path)
    except ImportError:
        # dotenv 없으면 수동으로 .env 파싱
        if env_path.exists():
            with open(env_path, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, _, v = line.partition("=")
                        os.environ[k.strip()] = v.strip().strip("'\"")

    url = args.url or os.environ.get("SUPABASE_URL")
    key = args.key or os.environ.get("SUPABASE_SERVICE_KEY")

    if not url or not key:
        print("\n힌트: .env가 프로젝트 루트에 있는지 확인하세요.")
        print("      Service Role Key는 'anon'이 아니라 'service_role' (secret) 키입니다.")
        print("      Supabase → 설정 → API → Project API keys")

    print("\nSupabase에 적재 중...")
    if write_to_supabase(brands, categories, products, url, key):
        print("완료.")
    else:
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
