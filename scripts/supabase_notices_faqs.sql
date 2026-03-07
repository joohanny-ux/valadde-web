-- 공지사항·FAQ 테이블
-- Supabase SQL Editor에서 실행

-- ============================================
-- notices (공지사항)
-- ============================================
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notices_created ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON notices(is_pinned);

-- ============================================
-- faqs (자주 묻는 질문)
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(display_order, created_at);
