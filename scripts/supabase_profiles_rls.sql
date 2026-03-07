-- profiles RLS 정책 (기존 프로필 테이블에 추가)
-- /api/me에서 사용자 본인 프로필 조회 가능하도록

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
