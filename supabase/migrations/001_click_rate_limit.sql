-- ============================================
-- clicks 테이블 중복 방지 (DB 수준)
-- ============================================
-- RLS가 admin만 SELECT 허용하므로 서버에서 중복 쿼리 불가
-- DB 함수로 1분 내 동일 IP/user 중복 클릭 방지

CREATE OR REPLACE FUNCTION insert_click_if_not_duplicate(
  p_emoji_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- 1분 내 동일 사용자/IP 중복 체크
  IF p_user_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM clicks
      WHERE emoji_id = p_emoji_id
        AND user_id = p_user_id
        AND created_at >= NOW() - INTERVAL '1 minute'
    ) INTO v_exists;
  ELSIF p_ip_address IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM clicks
      WHERE emoji_id = p_emoji_id
        AND ip_address = p_ip_address
        AND created_at >= NOW() - INTERVAL '1 minute'
    ) INTO v_exists;
  ELSE
    v_exists := FALSE;
  END IF;

  IF v_exists THEN
    RETURN FALSE;
  END IF;

  INSERT INTO clicks (emoji_id, user_id, ip_address, user_agent)
  VALUES (p_emoji_id, p_user_id, p_ip_address, p_user_agent);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
