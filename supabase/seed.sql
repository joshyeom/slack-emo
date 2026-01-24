-- ============================================
-- KoreanMojis - 시드 데이터
-- ============================================
-- schema.sql 실행 후 이 파일을 실행하세요.

-- 1. 카테고리 시드 데이터
-- ============================================
INSERT INTO categories (name, slug, description, icon, "order") VALUES
  ('회사생활', 'work-life', '직장에서 쓰기 좋은 이모지', '💼', 1),
  ('리액션', 'reactions', '다양한 리액션 이모지', '👍', 2),
  ('한국 밈', 'korean-memes', '한국 인터넷 밈 이모지', '😂', 3),
  ('유행어', 'trending', '최신 유행어 이모지', '💬', 4),
  ('캐릭터', 'characters', '귀여운 캐릭터 이모지', '🐱', 5),
  ('IT/브랜드', 'logos', 'IT 회사 및 브랜드 로고', '💻', 6),
  ('GIF/움짤', 'animated', '움직이는 GIF 이모지', '🎬', 7),
  ('게임', 'games', '게임 관련 이모지', '🎮', 8),
  ('K-POP', 'kpop', 'K-POP 관련 이모지', '🎤', 9),
  ('기타', 'misc', '기타 이모지', '📦', 99)
ON CONFLICT (slug) DO NOTHING;

-- 2. 태그 시드 데이터
-- ============================================
INSERT INTO tags (name, slug) VALUES
  ('직장', 'work'),
  ('리액션', 'reaction'),
  ('밈', 'meme'),
  ('유행어', 'slang'),
  ('캐릭터', 'character'),
  ('로고', 'logo'),
  ('움짤', 'gif'),
  ('게임', 'game'),
  ('케이팝', 'kpop'),
  ('귀여움', 'cute'),
  ('웃음', 'laugh'),
  ('슬픔', 'sad'),
  ('화남', 'angry'),
  ('축하', 'celebrate'),
  ('응원', 'cheer'),
  ('공감', 'agree'),
  ('거절', 'reject'),
  ('승인', 'approve'),
  ('코딩', 'coding'),
  ('커피', 'coffee')
ON CONFLICT (slug) DO NOTHING;

-- 3. 샘플 이모지 데이터 (테스트용)
-- ============================================
-- 실제 이미지 URL은 Supabase Storage에 업로드 후 교체해야 합니다.
-- 아래는 placeholder 이미지 URL입니다.

-- 회사생활 카테고리 이모지
INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '야근',
  'yagun',
  'https://via.placeholder.com/128/FF6B6B/FFFFFF?text=야근',
  'emojis/yagun.png',
  id,
  false,
  true
FROM categories WHERE slug = 'work-life'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '칼퇴',
  'kaltoe',
  'https://via.placeholder.com/128/4ECDC4/FFFFFF?text=칼퇴',
  'emojis/kaltoe.png',
  id,
  false,
  true
FROM categories WHERE slug = 'work-life'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '회의중',
  'meeting',
  'https://via.placeholder.com/128/45B7D1/FFFFFF?text=회의',
  'emojis/meeting.png',
  id,
  false,
  true
FROM categories WHERE slug = 'work-life'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '월급날',
  'payday',
  'https://via.placeholder.com/128/96CEB4/FFFFFF?text=💰',
  'emojis/payday.png',
  id,
  false,
  true
FROM categories WHERE slug = 'work-life'
ON CONFLICT (slug) DO NOTHING;

-- 리액션 카테고리 이모지
INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  'ㅋㅋㅋ',
  'kkk',
  'https://via.placeholder.com/128/FFE66D/000000?text=ㅋㅋㅋ',
  'emojis/kkk.png',
  id,
  false,
  true
FROM categories WHERE slug = 'reactions'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '인정',
  'injung',
  'https://via.placeholder.com/128/A8E6CF/000000?text=인정',
  'emojis/injung.png',
  id,
  false,
  true
FROM categories WHERE slug = 'reactions'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  'ㄹㅇ',
  'real',
  'https://via.placeholder.com/128/DDA0DD/FFFFFF?text=ㄹㅇ',
  'emojis/real.png',
  id,
  false,
  true
FROM categories WHERE slug = 'reactions'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  'ㄱㅇㄷ',
  'gud',
  'https://via.placeholder.com/128/FFB347/000000?text=ㄱㅇㄷ',
  'emojis/gud.png',
  id,
  false,
  true
FROM categories WHERE slug = 'reactions'
ON CONFLICT (slug) DO NOTHING;

-- 한국 밈 카테고리 이모지
INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '킹받네',
  'kingbat',
  'https://via.placeholder.com/128/FF4444/FFFFFF?text=킹받',
  'emojis/kingbat.png',
  id,
  false,
  true
FROM categories WHERE slug = 'korean-memes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '레게노',
  'legeno',
  'https://via.placeholder.com/128/9B59B6/FFFFFF?text=레게노',
  'emojis/legeno.png',
  id,
  false,
  true
FROM categories WHERE slug = 'korean-memes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '갓생',
  'godsaeng',
  'https://via.placeholder.com/128/F1C40F/000000?text=갓생',
  'emojis/godsaeng.png',
  id,
  false,
  true
FROM categories WHERE slug = 'korean-memes'
ON CONFLICT (slug) DO NOTHING;

-- IT/브랜드 카테고리 이모지
INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '버그',
  'bug',
  'https://via.placeholder.com/128/E74C3C/FFFFFF?text=🐛',
  'emojis/bug.png',
  id,
  false,
  true
FROM categories WHERE slug = 'logos'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  'LGTM',
  'lgtm',
  'https://via.placeholder.com/128/2ECC71/FFFFFF?text=LGTM',
  'emojis/lgtm.png',
  id,
  false,
  true
FROM categories WHERE slug = 'logos'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emojis (name, slug, image_url, image_path, category_id, is_animated, is_approved)
SELECT 
  '배포',
  'deploy',
  'https://via.placeholder.com/128/3498DB/FFFFFF?text=🚀',
  'emojis/deploy.png',
  id,
  false,
  true
FROM categories WHERE slug = 'logos'
ON CONFLICT (slug) DO NOTHING;

-- 4. 이모지-태그 연결
-- ============================================
-- 야근 이모지에 태그 연결
INSERT INTO emoji_tags (emoji_id, tag_id)
SELECT e.id, t.id FROM emojis e, tags t 
WHERE e.slug = 'yagun' AND t.slug IN ('work', 'sad')
ON CONFLICT DO NOTHING;

-- 칼퇴 이모지에 태그 연결
INSERT INTO emoji_tags (emoji_id, tag_id)
SELECT e.id, t.id FROM emojis e, tags t 
WHERE e.slug = 'kaltoe' AND t.slug IN ('work', 'celebrate')
ON CONFLICT DO NOTHING;

-- ㅋㅋㅋ 이모지에 태그 연결
INSERT INTO emoji_tags (emoji_id, tag_id)
SELECT e.id, t.id FROM emojis e, tags t 
WHERE e.slug = 'kkk' AND t.slug IN ('reaction', 'laugh')
ON CONFLICT DO NOTHING;

-- 인정 이모지에 태그 연결
INSERT INTO emoji_tags (emoji_id, tag_id)
SELECT e.id, t.id FROM emojis e, tags t 
WHERE e.slug = 'injung' AND t.slug IN ('reaction', 'agree')
ON CONFLICT DO NOTHING;

-- LGTM 이모지에 태그 연결
INSERT INTO emoji_tags (emoji_id, tag_id)
SELECT e.id, t.id FROM emojis e, tags t 
WHERE e.slug = 'lgtm' AND t.slug IN ('coding', 'approve')
ON CONFLICT DO NOTHING;

-- 5. 샘플 클릭 데이터 (인기 순위 테스트용)
-- ============================================
-- ㅋㅋㅋ 이모지 클릭 (인기 1위)
INSERT INTO clicks (emoji_id, created_at)
SELECT id, NOW() - (random() * interval '7 days')
FROM emojis WHERE slug = 'kkk'
CROSS JOIN generate_series(1, 50);

-- 인정 이모지 클릭 (인기 2위)
INSERT INTO clicks (emoji_id, created_at)
SELECT id, NOW() - (random() * interval '7 days')
FROM emojis WHERE slug = 'injung'
CROSS JOIN generate_series(1, 35);

-- 야근 이모지 클릭 (인기 3위)
INSERT INTO clicks (emoji_id, created_at)
SELECT id, NOW() - (random() * interval '7 days')
FROM emojis WHERE slug = 'yagun'
CROSS JOIN generate_series(1, 28);

-- LGTM 이모지 클릭
INSERT INTO clicks (emoji_id, created_at)
SELECT id, NOW() - (random() * interval '7 days')
FROM emojis WHERE slug = 'lgtm'
CROSS JOIN generate_series(1, 20);

-- 킹받네 이모지 클릭
INSERT INTO clicks (emoji_id, created_at)
SELECT id, NOW() - (random() * interval '7 days')
FROM emojis WHERE slug = 'kingbat'
CROSS JOIN generate_series(1, 15);

-- ============================================
-- 시드 데이터 완료!
-- ============================================
-- 총 카테고리: 10개
-- 총 태그: 20개
-- 총 이모지: 14개
-- 총 클릭: ~148개 (인기 순위 테스트용)
