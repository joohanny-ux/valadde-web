-- 주문·PO 테이블
-- Supabase SQL Editor에서 실행

-- ============================================
-- orders (주문/PO)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('creator', 'buyer')),
  order_type VARCHAR(20) NOT NULL DEFAULT 'order' CHECK (order_type IN ('po', 'order')),
  status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'confirmed', 'invoiced', 'shipped', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(12,2),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ============================================
-- sale_requests (크리에이터 판매 의사 신청)
-- ============================================
CREATE TABLE IF NOT EXISTS sale_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sale_requests_user ON sale_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_sale_requests_product ON sale_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_sale_requests_created ON sale_requests(created_at DESC);

-- RLS: 서비스 키(관리자)는 전체 접근, anon+JWT는 본인만
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own orders" ON orders;
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- 서비스 키는 RLS 우회하므로 별도 정책 불필요

-- sale_requests RLS
ALTER TABLE sale_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own sale_requests" ON sale_requests;
CREATE POLICY "Users can insert own sale_requests" ON sale_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own sale_requests" ON sale_requests;
CREATE POLICY "Users can read own sale_requests" ON sale_requests
  FOR SELECT USING (auth.uid() = user_id);
