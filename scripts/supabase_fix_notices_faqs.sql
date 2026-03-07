-- notices/faqs 테이블 컬럼 수정 (공지/FAQ 저장 실패 시 실행)
-- Supabase SQL Editor에서 실행

-- notices: title, content 컬럼 추가 (없을 경우)
ALTER TABLE notices ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT '';
ALTER TABLE notices ADD COLUMN IF NOT EXISTS content TEXT;

-- faqs: question, answer, display_order 컬럼 추가 (없을 경우)
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS question TEXT DEFAULT '';
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS answer TEXT DEFAULT '';
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
