-- product_detail_jobs: 상세페이지 에이전트 작업 상태
-- Supabase SQL Editor에서 실행

CREATE TABLE IF NOT EXISTS product_detail_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'searching', 'suggesting', 'generating', 'done', 'error'
  )),
  search_queries JSONB,
  search_result JSONB,
  specs JSONB,
  design_suggestion JSONB,
  generated_images JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_detail_jobs_product ON product_detail_jobs(product_id);
CREATE INDEX IF NOT EXISTS idx_product_detail_jobs_status ON product_detail_jobs(status);
CREATE INDEX IF NOT EXISTS idx_product_detail_jobs_created ON product_detail_jobs(created_at DESC);
