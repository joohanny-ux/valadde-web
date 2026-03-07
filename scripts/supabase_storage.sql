-- Supabase Storage 버킷 생성 (Supabase 대시보드 또는 SQL)
-- Storage → New bucket → product-images
-- Public bucket 체크 (이미지 URL 공개 접근)

-- 또는 아래 SQL로 버킷 생성 (Supabase SQL Editor)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 버킷 정책: 인증된 사용자 업로드 허용 (서비스 키는 별도)
-- 또는 공개 읽기만 허용하고, 업로드는 API route(서비스 키)로 처리
