-- ============================================
-- Next.js Fullstack Boilerplate - Supabase Schema
-- ============================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요.

-- 1. profiles 테이블 (사용자 프로필)
-- ============================================
-- Supabase Auth의 users 테이블과 연결되는 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  name TEXT,
  avatar_url TEXT
);

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 프로필 정책: 본인 데이터만 조회/수정 가능
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 새 사용자 가입 시 자동 프로필 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 예시: items 테이블 (CRUD 예시용)
-- ============================================
-- 필요에 따라 아래 주석을 해제하고 사용하세요

/*
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed'))
);

-- RLS 활성화
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 CRUD 가능
CREATE POLICY "Users can CRUD own items"
  ON items FOR ALL
  USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_created_at ON items(created_at DESC);
*/

-- ============================================
-- updated_at 자동 업데이트 함수
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles 테이블에 적용
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- items 테이블에 적용 (주석 해제 시)
/*
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
*/

-- ============================================
-- KoreanMojis - 이모지 디렉토리 스키마
-- ============================================

-- profiles 테이블에 role 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. categories 테이블 (카테고리)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "회사생활"
  slug TEXT NOT NULL UNIQUE,             -- "work-life"
  description TEXT,                      -- "직장에서 쓰기 좋은 이모지"
  icon TEXT,                             -- 이모지 or 아이콘 이름
  "order" INTEGER DEFAULT 0,             -- 정렬 순서
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화 (누구나 읽기 가능)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");

-- 3. tags 테이블 (태그)
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,             -- "직장", "리액션"
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- 4. emojis 테이블 (이모지)
-- ============================================
CREATE TABLE IF NOT EXISTS emojis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "야근"
  slug TEXT NOT NULL UNIQUE,             -- "yagun"
  image_url TEXT NOT NULL,               -- Supabase Storage Public URL
  image_path TEXT NOT NULL,              -- Storage 경로 (transform용)
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_animated BOOLEAN DEFAULT FALSE,     -- GIF 여부
  is_approved BOOLEAN DEFAULT TRUE,      -- 관리자 승인 여부 (신고 시 false)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE emojis ENABLE ROW LEVEL SECURITY;

-- 승인된 이모지만 공개 조회
CREATE POLICY "Anyone can read approved emojis"
  ON emojis FOR SELECT
  USING (is_approved = true);

-- 관리자는 모든 이모지 조회 가능
CREATE POLICY "Admins can read all emojis"
  ON emojis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 인증된 사용자 업로드 가능
CREATE POLICY "Authenticated users can upload emojis"
  ON emojis FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 본인 또는 관리자 수정 가능
CREATE POLICY "Owners or admins can update emojis"
  ON emojis FOR UPDATE
  USING (
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 본인 또는 관리자 삭제 가능
CREATE POLICY "Owners or admins can delete emojis"
  ON emojis FOR DELETE
  USING (
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_emojis_slug ON emojis(slug);
CREATE INDEX IF NOT EXISTS idx_emojis_category ON emojis(category_id);
CREATE INDEX IF NOT EXISTS idx_emojis_created_at ON emojis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emojis_approved ON emojis(is_approved);

-- updated_at 트리거
CREATE TRIGGER update_emojis_updated_at
  BEFORE UPDATE ON emojis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. emoji_tags 테이블 (이모지-태그 연결, M:N)
-- ============================================
CREATE TABLE IF NOT EXISTS emoji_tags (
  emoji_id UUID REFERENCES emojis(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (emoji_id, tag_id)
);

-- RLS 활성화
ALTER TABLE emoji_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read emoji_tags"
  ON emoji_tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage emoji_tags"
  ON emoji_tags FOR ALL
  USING (auth.role() = 'authenticated');

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_emoji_tags_emoji ON emoji_tags(emoji_id);
CREATE INDEX IF NOT EXISTS idx_emoji_tags_tag ON emoji_tags(tag_id);

-- 6. clicks 테이블 (클릭/다운로드 통계)
-- ============================================
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji_id UUID REFERENCES emojis(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- 누구나 클릭 기록 가능
CREATE POLICY "Anyone can insert clicks"
  ON clicks FOR INSERT
  WITH CHECK (true);

-- 관리자만 조회 가능
CREATE POLICY "Only admins can read clicks"
  ON clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 인덱스 (기간별 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_clicks_emoji_created ON clicks(emoji_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at DESC);

-- 7. favorites 테이블 (즐겨찾기)
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji_id UUID REFERENCES emojis(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, emoji_id)
);

-- RLS 활성화
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 본인 즐겨찾기만 관리
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_emoji ON favorites(emoji_id);

-- 8. reports 테이블 (신고)
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji_id UUID REFERENCES emojis(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL CHECK (reason IN ('inappropriate', 'copyright', 'spam', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자 신고 가능
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 관리자만 조회/수정 가능
CREATE POLICY "Only admins can read reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_reports_emoji ON reports(emoji_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- 신고 3회 이상 시 자동 숨김 트리거
CREATE OR REPLACE FUNCTION auto_hide_reported_emoji()
RETURNS TRIGGER AS $$
BEGIN
  -- 동일 이모지에 대해 3회 이상 신고 시 자동 숨김
  IF (
    SELECT COUNT(DISTINCT reporter_id) 
    FROM reports 
    WHERE emoji_id = NEW.emoji_id AND status = 'pending'
  ) >= 3 THEN
    UPDATE emojis SET is_approved = false WHERE id = NEW.emoji_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_hide
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION auto_hide_reported_emoji();

-- ============================================
-- 인기 이모지 조회 함수 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION get_popular_emojis(
  p_period TEXT DEFAULT 'all',
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  image_url TEXT,
  image_path TEXT,
  category_id UUID,
  is_animated BOOLEAN,
  created_at TIMESTAMPTZ,
  click_count BIGINT
) AS $$
DECLARE
  v_interval INTERVAL;
BEGIN
  -- 기간 설정
  v_interval := CASE p_period
    WHEN 'week' THEN INTERVAL '7 days'
    WHEN 'month' THEN INTERVAL '30 days'
    ELSE NULL  -- 전체
  END;
  
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.slug,
    e.image_url,
    e.image_path,
    e.category_id,
    e.is_animated,
    e.created_at,
    COUNT(c.id)::BIGINT as click_count
  FROM emojis e
  LEFT JOIN clicks c ON e.id = c.emoji_id 
    AND (v_interval IS NULL OR c.created_at >= NOW() - v_interval)
  WHERE e.is_approved = true
  GROUP BY e.id
  ORDER BY click_count DESC, e.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- 검색 함수 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION search_emojis(
  p_query TEXT,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  image_url TEXT,
  image_path TEXT,
  category_id UUID,
  is_animated BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.slug,
    e.image_url,
    e.image_path,
    e.category_id,
    e.is_animated,
    e.created_at
  FROM emojis e
  LEFT JOIN emoji_tags et ON e.id = et.emoji_id
  LEFT JOIN tags t ON et.tag_id = t.id
  WHERE e.is_approved = true
    AND (
      e.name ILIKE '%' || p_query || '%' OR
      e.slug ILIKE '%' || p_query || '%' OR
      t.name ILIKE '%' || p_query || '%'
    )
  GROUP BY e.id
  ORDER BY e.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
