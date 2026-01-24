-- ============================================
-- KoreanMojis - Supabase Storage 설정
-- ============================================
-- Supabase Dashboard > Storage 에서 버킷 생성 후
-- SQL Editor에서 아래 정책을 실행하세요.

-- 1. emojis 버킷 생성 (Dashboard에서 생성)
-- - Name: emojis
-- - Public: true
-- - File size limit: 524288 (500KB)
-- - Allowed MIME types: image/png, image/gif, image/webp

-- 2. Storage RLS 정책
-- ============================================

-- 누구나 읽기 가능
CREATE POLICY "Public read access for emojis"
ON storage.objects FOR SELECT
USING (bucket_id = 'emojis');

-- 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload emojis"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'emojis' 
  AND auth.role() = 'authenticated'
);

-- 본인 업로드 또는 관리자만 수정 가능
CREATE POLICY "Owners or admins can update emojis"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'emojis'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
);

-- 본인 업로드 또는 관리자만 삭제 가능
CREATE POLICY "Owners or admins can delete emojis"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'emojis'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
);
