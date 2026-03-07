-- ABU BUSINESS HUB — Supabase(PostgreSQL) 테이블 스키마
-- Supabase SQL Editor에서 실행

-- ============================================
-- 1. brands (브랜드)
-- ============================================
CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_kr VARCHAR(100),
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);

-- ============================================
-- 2. categories (카테고리, 3단계)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  parent_id VARCHAR(100),
  level INT DEFAULT 1,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ============================================
-- 3. products (상품)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_zh_s VARCHAR(255),
  name_zh_f VARCHAR(255),
  name_jp VARCHAR(255),
  sku VARCHAR(500),
  category_id VARCHAR(100) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  brand_id VARCHAR(50) NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  short_description TEXT,
  description TEXT,
  images JSONB DEFAULT '[]',
  price DECIMAL(12,2),
  promotion_price DECIMAL(12,2),
  wholesale_price DECIMAL(12,2),
  purchase_price_vat_excl DECIMAL(12,2),
  purchase_price_rate DECIMAL(5,2),
  stock INT DEFAULT 0,
  stock_status VARCHAR(20) DEFAULT 'in_stock',
  specs JSONB DEFAULT '{}',
  tags JSONB DEFAULT '[]',
  qty_inbox INT,
  qty_carton INT,
  shelf_life_months INT,
  barcode VARCHAR(50),
  inbox_barcode VARCHAR(50),
  carton_barcode VARCHAR(50),
  carton_size_all VARCHAR(100),
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(50),
  updated_by VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_active_order ON products(is_active, display_order DESC);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);

-- ============================================
-- 4. updated_at 자동 갱신 (선택)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_brands_updated_at ON brands;
CREATE TRIGGER trigger_brands_updated_at
  BEFORE UPDATE ON brands FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================
-- 5. contact_inquiries (문의)
-- ============================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created ON contact_inquiries(created_at DESC);
