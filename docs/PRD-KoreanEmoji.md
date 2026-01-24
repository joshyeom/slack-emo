# PRD: 한국형 커스텀 이모지 디렉토리 (KoreanMojis)

## 1. 개요

### 1.1 프로젝트 요약
Slackmojis.com을 벤치마킹하여 한국 사용자를 위한 커스텀 Slack/Discord 이모지 공유 플랫폼을 구축합니다. 한국 문화, 밈, 유행어에 특화된 이모지를 발견하고 다운로드할 수 있는 서비스입니다.

### 1.2 목표
- 한국 문화에 맞는 커스텀 이모지 제공
- 사용자 참여형 이모지 업로드 및 공유 생태계 구축
- Slack, Discord 등 메신저에서 쉽게 사용할 수 있는 이모지 제공

### 1.3 타겟 사용자
- 한국 IT 회사 Slack 워크스페이스 관리자
- Discord 서버 운영자
- 한국 밈/문화에 친숙한 개인 사용자

---

## 2. 벤치마킹 분석: Slackmojis.com

### 2.1 핵심 기능

| 기능 | 설명 |
|------|------|
| 이모지 갤러리 | 그리드 형태로 이모지 미리보기 표시 |
| 카테고리 분류 | Party Parrot, Hangouts Blob, Meme, Logo, Pokemon 등 |
| 섹션 구분 | Most Popular, Recently Added, Random |
| 원클릭 다운로드 | 이모지 클릭 시 즉시 다운로드 |
| 이모지 이름 표시 | `:emoji_name:` 형식으로 표시 |
| 태그 시스템 | 각 이모지에 관련 태그 부여 |
| 반응형 디자인 | 모바일/데스크톱 대응 |

### 2.2 데이터 모델 (추정)

```
Emoji:
  - id: UUID
  - name: string (slug 형식, 예: "party_blob")
  - display_name: string (예: "Party Blob")
  - image_url: string
  - category_id: FK
  - tags: string[]
  - download_count: number
  - created_at: timestamp

Category:
  - id: UUID
  - name: string
  - slug: string
  - emoji_count: number

Tag:
  - id: UUID
  - name: string
```

### 2.3 UI/UX 특징

1. **심플한 헤더**: 로고 + 설명 문구만
2. **섹션 기반 레이아웃**: 각 섹션별로 이모지 그리드 + "See More" 버튼
3. **이모지 카드**: 이미지 + 이름 + hover 효과
4. **무한 스크롤 또는 페이지네이션**: 카테고리 상세 페이지
5. **다크 테마**: 이모지가 잘 보이는 어두운 배경

---

## 3. 한국화 (Localization) 전략

### 3.1 한국형 카테고리

| 영문 카테고리 | 한국형 카테고리 |
|--------------|----------------|
| Party Parrot | 파티 앵무새 |
| Hangouts Blob | 한글 이모지 |
| Meme | 한국 밈 |
| Logo | IT/브랜드 로고 |
| Pokemon | 캐릭터 |
| Random | 랜덤 |
| - | 짤방/GIF |
| - | 회사생활 |
| - | 리액션 |
| - | 유행어 |
| - | 게임 |
| - | K-POP/연예 |

### 3.2 한국 특화 콘텐츠 예시

- **회사생활**: `:야근:`, `:칼퇴:`, `:회의중:`, `:커피브레이크:`, `:월급날:`
- **리액션**: `:ㅋㅋㅋ:`, `:ㄹㅇ:`, `:인정:`, `:아닌데:`, `:ㄱㅇㄷ:`
- **유행어**: `:어쩔티비:`, `:킹받네:`, `:레게노:`, `:갓생:`, `:소확행:`
- **K-POP/연예**: `:짱구:`, `:카카오프렌즈:`, `:라인프렌즈:`
- **한국 밈**: `:이게맞아:`, `:충격:`, `:심각:`, `:빡침:`

---

## 4. 기술 스택 (현재 Boilerplate 활용)

### 4.1 프론트엔드
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4 + shadcn/ui
- **State**: Zustand + React Query

### 4.2 백엔드
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage (이모지 이미지)
- **API**: Next.js API Routes / Server Actions

### 4.3 인프라
- **Hosting**: Vercel
- **CDN**: Vercel Edge / Supabase CDN
- **Mobile**: Capacitor (PWA)

---

## 5. 데이터베이스 스키마

### 5.1 ERD

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    categories   │      │     emojis      │      │   emoji_tags    │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ id (PK)         │──┐   │ id (PK)         │──┐   │ emoji_id (FK)   │
│ name            │  │   │ name            │  │   │ tag_id (FK)     │
│ slug            │  │   │ slug            │  │   └─────────────────┘
│ description     │  │   │ image_url       │               │
│ icon            │  └──>│ category_id(FK) │               │
│ order           │      │ uploader_id(FK) │               │
│ created_at      │      │ is_animated     │               ▼
└─────────────────┘      │ is_approved     │      ┌─────────────────┐
                         │ created_at      │      │      tags       │
┌─────────────────┐      │ updated_at      │      ├─────────────────┤
│    profiles     │      └─────────────────┘      │ id (PK)         │
├─────────────────┤              │                │ name            │
│ id (PK, FK)     │──────────────┘                │ slug            │
│ email           │                               │ created_at      │
│ name            │      ┌─────────────────┐      └─────────────────┘
│ avatar_url      │      │     clicks      │
│ role            │      ├─────────────────┤
│ created_at      │      │ id (PK)         │
└─────────────────┘      │ emoji_id (FK)   │
                         │ user_id (FK)    │
┌─────────────────┐      │ ip_address      │
│   favorites     │      │ created_at      │
├─────────────────┤      └─────────────────┘
│ user_id (FK)    │
│ emoji_id (FK)   │      ┌─────────────────┐
│ created_at      │      │    reports      │
└─────────────────┘      ├─────────────────┤
                         │ id (PK)         │
                         │ emoji_id (FK)   │
                         │ reporter_id(FK) │
                         │ reason          │
                         │ status          │
                         │ created_at      │
                         └─────────────────┘
```

> **Note**: `download_count`는 별도 컬럼 없이 `clicks` 테이블에서 실시간 집계합니다.

### 5.2 테이블 상세

```sql
-- 카테고리
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "회사생활"
  slug TEXT NOT NULL UNIQUE,             -- "work-life"
  description TEXT,                      -- "직장에서 쓰기 좋은 이모지"
  icon TEXT,                             -- 이모지 or 아이콘 이름
  "order" INTEGER DEFAULT 0,             -- 정렬 순서
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 이모지
CREATE TABLE emojis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "야근"
  slug TEXT NOT NULL UNIQUE,             -- "yagun"
  image_url TEXT NOT NULL,               -- Supabase Storage URL
  image_path TEXT NOT NULL,              -- Storage 경로 (transform용)
  category_id UUID REFERENCES categories(id),
  uploader_id UUID REFERENCES auth.users(id),
  is_animated BOOLEAN DEFAULT FALSE,     -- GIF 여부
  is_approved BOOLEAN DEFAULT TRUE,      -- 관리자 승인 여부 (신고 시 false)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: 클릭/다운로드 수는 clicks 테이블에서 실시간 집계
-- SELECT COUNT(*) FROM clicks WHERE emoji_id = ?

-- 태그
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,             -- "직장", "리액션"
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 이모지-태그 연결 (M:N)
CREATE TABLE emoji_tags (
  emoji_id UUID REFERENCES emojis(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (emoji_id, tag_id)
);

-- 즐겨찾기
CREATE TABLE favorites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji_id UUID REFERENCES emojis(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, emoji_id)
);

-- 클릭/다운로드 기록 (통계용)
CREATE TABLE clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji_id UUID REFERENCES emojis(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),  -- nullable (비로그인 허용)
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 클릭 테이블 인덱스 (기간별 조회 최적화)
CREATE INDEX idx_clicks_emoji_created ON clicks(emoji_id, created_at DESC);
CREATE INDEX idx_clicks_created_at ON clicks(created_at DESC);
```

### 5.3 인기 통계 시스템 (실시간 집계)

#### 5.3.1 설계 원칙
- **실시간 집계 방식**: `clicks` 테이블에서 직접 COUNT 쿼리
- **기간 필터**: 주간(7일), 월간(30일), 전체
- **정렬 기준**: 해당 기간 내 클릭 수 DESC

#### 5.3.2 쿼리 전략

```sql
-- 주간 인기 이모지 (최근 7일)
SELECT 
  e.*,
  COUNT(c.id) as click_count
FROM emojis e
LEFT JOIN clicks c ON e.id = c.emoji_id 
  AND c.created_at >= NOW() - INTERVAL '7 days'
WHERE e.is_approved = true
GROUP BY e.id
ORDER BY click_count DESC
LIMIT 20;

-- 월간 인기 이모지 (최근 30일)
SELECT 
  e.*,
  COUNT(c.id) as click_count
FROM emojis e
LEFT JOIN clicks c ON e.id = c.emoji_id 
  AND c.created_at >= NOW() - INTERVAL '30 days'
WHERE e.is_approved = true
GROUP BY e.id
ORDER BY click_count DESC
LIMIT 20;

-- 전체 인기 이모지 (누적)
SELECT 
  e.*,
  COUNT(c.id) as click_count
FROM emojis e
LEFT JOIN clicks c ON e.id = c.emoji_id
WHERE e.is_approved = true
GROUP BY e.id
ORDER BY click_count DESC
LIMIT 20;
```

#### 5.3.3 API 파라미터

| 파라미터 | 값 | 설명 |
|----------|-----|------|
| `period` | `week` | 최근 7일 기준 |
| `period` | `month` | 최근 30일 기준 |
| `period` | `all` | 전체 누적 (기본값) |

**예시**: `GET /api/emojis/popular?period=week&limit=20`

#### 5.3.4 성능 최적화 전략

| 전략 | 설명 |
|------|------|
| **인덱스** | `clicks(emoji_id, created_at DESC)` 복합 인덱스 |
| **캐싱** | React Query로 클라이언트 캐싱 (5분 stale time) |
| **페이지네이션** | 한 번에 최대 50개 제한 |
| **오래된 데이터 정리** | 90일 이상 된 클릭 데이터 주기적 삭제 (선택) |

#### 5.3.5 Supabase RPC 함수 (선택적 최적화)

```sql
-- 인기 이모지 조회 함수
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
  category_id UUID,
  is_animated BOOLEAN,
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
    e.category_id,
    e.is_animated,
    COUNT(c.id)::BIGINT as click_count
  FROM emojis e
  LEFT JOIN clicks c ON e.id = c.emoji_id 
    AND (v_interval IS NULL OR c.created_at >= NOW() - v_interval)
  WHERE e.is_approved = true
  GROUP BY e.id
  ORDER BY click_count DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;
```

#### 5.3.6 프론트엔드 구현

```typescript
// 인기 기간 필터 타입
type PopularPeriod = 'week' | 'month' | 'all';

// 인기 이모지 조회 훅
const usePopularEmojis = (period: PopularPeriod = 'all') => {
  return useQuery({
    queryKey: ['emojis', 'popular', period],
    queryFn: () => fetchPopularEmojis(period),
    staleTime: 5 * 60 * 1000, // 5분 캐싱
  });
};

// UI: 기간 필터 탭
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="week">주간</TabsTrigger>
    <TabsTrigger value="month">월간</TabsTrigger>
    <TabsTrigger value="all">전체</TabsTrigger>
  </TabsList>
</Tabs>
```

### 5.4 클릭 트래킹 및 Debounce 전략

#### 5.4.1 문제점
- 사용자가 이모지를 연속 클릭 시 다운로드가 여러 번 발생
- 클릭 API에 과도한 요청 발생
- 잘못된 통계 집계

#### 5.4.2 해결 전략: 프론트엔드 Debounce + 서버 중복 방지

**1. 프론트엔드 Debounce (클릭 기록)**

```typescript
import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import debounce from 'lodash.debounce';

const useTrackClick = () => {
  const mutation = useMutation({
    mutationFn: (emojiId: string) => 
      fetch(`/api/emojis/${emojiId}/click`, { method: 'POST' }),
  });

  // 같은 이모지에 대해 2초 내 중복 클릭 무시
  const debouncedTrack = useMemo(
    () => debounce(
      (emojiId: string) => mutation.mutate(emojiId),
      2000,
      { leading: true, trailing: false }
    ),
    [mutation]
  );

  return debouncedTrack;
};
```

**2. 다운로드 처리 분리**

```typescript
const EmojiCard = ({ emoji }: { emoji: Emoji }) => {
  const trackClick = useTrackClick();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async () => {
    if (isDownloading) return; // 중복 다운로드 방지
    
    setIsDownloading(true);
    
    // 1. 클릭 트래킹 (debounced)
    trackClick(emoji.id);
    
    // 2. 다운로드 실행
    await downloadEmoji(emoji);
    
    setIsDownloading(false);
  };

  return (
    <button onClick={handleClick} disabled={isDownloading}>
      <img src={emoji.image_url} alt={emoji.name} />
      {isDownloading && <LoadingSpinner />}
    </button>
  );
};
```

**3. 서버 측 중복 방지 (선택적)**

```sql
-- 같은 IP에서 같은 이모지에 대해 1분 내 중복 클릭 방지
CREATE OR REPLACE FUNCTION record_click(
  p_emoji_id UUID,
  p_user_id UUID,
  p_ip_address INET
)
RETURNS BOOLEAN AS $$
DECLARE
  v_recent_click BOOLEAN;
BEGIN
  -- 최근 1분 내 동일 클릭 확인
  SELECT EXISTS(
    SELECT 1 FROM clicks
    WHERE emoji_id = p_emoji_id
      AND (user_id = p_user_id OR ip_address = p_ip_address)
      AND created_at >= NOW() - INTERVAL '1 minute'
  ) INTO v_recent_click;
  
  IF v_recent_click THEN
    RETURN FALSE; -- 중복 클릭, 기록하지 않음
  END IF;
  
  -- 클릭 기록
  INSERT INTO clicks (emoji_id, user_id, ip_address)
  VALUES (p_emoji_id, p_user_id, p_ip_address);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

#### 5.4.3 Debounce 설정 값

| 항목 | 값 | 설명 |
|------|-----|------|
| 클릭 트래킹 Debounce | 2초 | 같은 이모지 연속 클릭 무시 |
| 다운로드 버튼 비활성화 | 다운로드 완료까지 | UI 레벨 중복 방지 |
| 서버 중복 체크 | 1분 | 같은 IP/유저의 동일 이모지 |

### 5.5 이미지 업로드 및 리사이징 전략

#### 5.5.1 이모지 이미지 규격

| 항목 | 규격 | 설명 |
|------|------|------|
| **권장 크기** | 128x128px | Slack/Discord 최적 크기 |
| **최대 크기** | 256x256px | 업로드 허용 최대 |
| **최소 크기** | 32x32px | 너무 작으면 거절 |
| **파일 크기** | 최대 500KB | 원본 기준 |
| **지원 포맷** | PNG, GIF, WebP | JPEG는 WebP로 변환 |

#### 5.5.2 리사이징 전략 비교

| 방식 | 장점 | 단점 | 선택 |
|------|------|------|------|
| **클라이언트 리사이징** | 서버 부하 없음 | 브라우저 호환성, 품질 이슈 | X |
| **서버 리사이징 (Sharp)** | 고품질, 완전한 제어 | Vercel 함수 시간 제한, 비용 | X |
| **Supabase Transform** | 간편, CDN 캐싱, Pro 플랜 포함 | Pro 플랜 필요, 실시간 변환 | **O (권장)** |

#### 5.5.3 선택: Supabase Storage Image Transformation

**장점:**
- Pro 플랜에서 100개 origin 이미지 무료
- CDN 캐싱으로 빠른 전송
- WebP 자동 변환 (용량 30-50% 절감)
- 별도 서버 로직 불필요

**구현 방식:**
1. **업로드**: 원본 이미지 그대로 Supabase Storage에 저장
2. **조회 시**: transform 파라미터로 리사이징된 이미지 요청
3. **다운로드**: 원본 또는 리사이징 버전 선택 가능

#### 5.5.4 구현 코드

**1. 업로드 (원본 저장 + 검증)**

```typescript
// src/lib/upload-emoji.ts
import { createClient } from '@/lib/supabase/client';

const ALLOWED_TYPES = ['image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 500 * 1024; // 500KB
const MIN_DIMENSION = 32;
const MAX_DIMENSION = 256;

type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export const uploadEmoji = async (
  file: File,
  slug: string
): Promise<UploadResult> => {
  // 1. 파일 타입 검증
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'PNG, GIF, WebP만 업로드 가능합니다.' };
  }
  
  // 2. 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: '파일 크기는 500KB 이하여야 합니다.' };
  }
  
  // 3. 이미지 크기 검증
  const dimensions = await getImageDimensions(file);
  if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
    return { success: false, error: '이미지는 최소 32x32px 이상이어야 합니다.' };
  }
  if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
    return { success: false, error: '이미지는 최대 256x256px 이하여야 합니다.' };
  }
  
  // 4. 업로드
  const supabase = createClient();
  const extension = file.type.split('/')[1];
  const path = `emojis/${slug}.${extension}`;
  
  const { error } = await supabase.storage
    .from('emojis')
    .upload(path, file, {
      cacheControl: '31536000', // 1년 캐싱
      upsert: false,
    });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  // 5. Public URL 반환
  const { data } = supabase.storage.from('emojis').getPublicUrl(path);
  
  return { success: true, url: data.publicUrl };
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
```

**2. 이미지 조회 (리사이징 적용)**

```typescript
// src/lib/get-emoji-url.ts
import { createClient } from '@/lib/supabase/client';

type ImageSize = 'thumbnail' | 'standard' | 'original';

const SIZE_CONFIG = {
  thumbnail: { width: 64, height: 64 },   // 목록용
  standard: { width: 128, height: 128 },  // 상세/다운로드용
  original: null,                          // 원본
};

export const getEmojiUrl = (
  path: string,
  size: ImageSize = 'standard'
): string => {
  const supabase = createClient();
  const config = SIZE_CONFIG[size];
  
  if (!config) {
    // 원본 반환
    const { data } = supabase.storage.from('emojis').getPublicUrl(path);
    return data.publicUrl;
  }
  
  // 리사이징된 이미지 URL
  const { data } = supabase.storage.from('emojis').getPublicUrl(path, {
    transform: {
      width: config.width,
      height: config.height,
      resize: 'contain', // 비율 유지
    },
  });
  
  return data.publicUrl;
};
```

**3. 다운로드 (원본 포맷 유지)**

> **중요**: 다운로드 시에는 원본 포맷(PNG/GIF)을 유지해야 합니다.
> Slack은 WebP를 지원하지 않으므로, 사용자가 다운로드한 파일을 바로 Slack에 업로드할 수 있어야 합니다.

```typescript
// src/lib/download-emoji.ts
import { createClient } from '@/lib/supabase/client';

export const downloadEmoji = async (emoji: Emoji) => {
  const supabase = createClient();
  
  // 원본 포맷으로 다운로드 (WebP 변환 없음)
  const { data } = supabase.storage
    .from('emojis')
    .getPublicUrl(emoji.image_path, {
      transform: {
        width: 128,
        height: 128,
        format: 'origin',  // 원본 포맷 유지 (PNG → PNG, GIF → GIF)
      },
    });
  
  const response = await fetch(data.publicUrl);
  const blob = await response.blob();
  
  // 다운로드 트리거
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${emoji.slug}.${emoji.is_animated ? 'gif' : 'png'}`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};
```

#### 이미지 포맷 정책

| 상황 | 포맷 | 이유 |
|------|------|------|
| 갤러리 조회 | WebP (자동) | 빠른 로딩, 용량 절감 |
| 다운로드 | PNG/GIF (원본) | Slack 호환성 보장 |

#### 5.5.5 Supabase Storage 버킷 설정

```sql
-- Storage 버킷 생성 (Supabase Dashboard 또는 SQL)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'emojis',
  'emojis',
  true,  -- Public 접근 허용
  524288, -- 500KB
  ARRAY['image/png', 'image/gif', 'image/webp']
);

-- RLS 정책: 누구나 읽기 가능
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'emojis');

-- RLS 정책: 인증된 사용자만 업로드
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'emojis' 
  AND auth.role() = 'authenticated'
);

-- RLS 정책: 본인 또는 관리자만 삭제
CREATE POLICY "Owner or admin delete"
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
```

#### 5.5.6 이미지 처리 플로우

```
[사용자 업로드]
      │
      ▼
┌─────────────────────┐
│ 클라이언트 검증     │
│ - 타입 (PNG/GIF/WebP)│
│ - 크기 (≤500KB)     │
│ - 해상도 (32~256px) │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Supabase Storage    │
│ 원본 이미지 저장    │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ DB에 메타데이터 저장│
│ - image_path        │
│ - is_animated       │
└─────────────────────┘


[이미지 조회/다운로드]
      │
      ▼
┌─────────────────────┐
│ Supabase Transform  │
│ - 썸네일: 64x64     │
│ - 표준: 128x128     │
│ - WebP 자동 변환    │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ CDN 캐싱            │
│ (자동)              │
└─────────────────────┘
```

---

## 6. 기능 명세

### 6.1 Phase 1: MVP (Core Features)

#### 6.1.1 홈페이지
- [x] 헤더 (로고, 검색, 로그인 버튼)
- [x] 히어로 섹션 (서비스 소개)
- [x] 인기 이모지 섹션 (다운로드 순)
- [x] 최신 이모지 섹션 (등록일 순)
- [x] 카테고리별 이모지 미리보기
- [x] 푸터

#### 6.1.2 이모지 갤러리
- [x] 이모지 그리드 (반응형)
- [x] 이모지 카드 (이미지, 이름, 다운로드 버튼)
- [x] 호버 효과 (확대, 이름 표시)
- [x] 무한 스크롤 또는 페이지네이션

#### 6.1.3 이모지 상세/다운로드
- [x] 원클릭 다운로드 (PNG/GIF)
- [x] 이모지 상세 모달 (선택적)
  - 이미지 크게 보기
  - 태그 표시
  - 관련 이모지 추천
  - 다운로드 카운트

#### 6.1.4 카테고리 페이지
- [x] 카테고리 목록
- [x] 카테고리별 이모지 갤러리
- [x] 필터 및 정렬 옵션

#### 6.1.5 검색
- [x] 검색창 (헤더)
- [x] 실시간 검색 결과
- [x] 이름, 태그 기반 검색

### 6.2 Phase 2: 사용자 기능

#### 6.2.1 인증
- [ ] Google OAuth 로그인 (기존 Boilerplate 활용)
- [ ] 프로필 페이지

#### 6.2.2 이모지 업로드
- [ ] 이미지 업로드 (PNG, GIF, max 128x128, 500KB)
- [ ] 이름, 카테고리, 태그 입력
- [ ] 이미지 리사이징/최적화
- [ ] 관리자 승인 대기열

#### 6.2.3 즐겨찾기
- [ ] 이모지 즐겨찾기 추가/제거
- [ ] 내 즐겨찾기 목록

#### 6.2.4 내 업로드
- [ ] 내가 올린 이모지 목록
- [ ] 이모지 수정/삭제

### 6.3 Phase 3: 고급 기능

#### 6.3.1 관리자 기능
- [ ] 이모지 승인/거절
- [ ] 카테고리 관리
- [ ] 사용자 관리
- [ ] 통계 대시보드

#### 6.3.2 고급 검색
- [ ] 필터 (카테고리, 태그, 애니메이션 여부)
- [ ] 정렬 (인기순, 최신순, 이름순)
- [ ] 자동완성

---

## 7. 페이지 구조

```
/                           # 홈페이지
├── /emojis                 # 전체 이모지 갤러리
│   ├── /popular            # 인기 이모지
│   ├── /recent             # 최신 이모지
│   └── /[slug]/download    # 이모지 다운로드 (API)
├── /categories             # 카테고리 목록
│   └── /[slug]             # 카테고리별 이모지
├── /tags                   # 태그 목록
│   └── /[slug]             # 태그별 이모지
├── /search                 # 검색 결과
├── /upload                 # 이모지 업로드 (로그인 필요)
├── /my                     # 마이페이지
│   ├── /favorites          # 내 즐겨찾기
│   └── /uploads            # 내 업로드
├── /admin                  # 관리자 페이지
│   ├── /emojis             # 이모지 관리
│   ├── /categories         # 카테고리 관리
│   └── /users              # 사용자 관리
└── /login                  # 로그인 (기존)
```

---

## 8. API 설계

### 8.1 이모지 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/emojis` | 이모지 목록 (페이지네이션) |
| GET | `/api/emojis/popular?period=week\|month\|all` | 인기 이모지 (기간별) |
| GET | `/api/emojis/recent` | 최신 이모지 |
| GET | `/api/emojis/[slug]` | 이모지 상세 |
| POST | `/api/emojis/[slug]/click` | 클릭 기록 (통계용) |
| GET | `/api/emojis/[slug]/download` | 다운로드 (이미지 반환) |
| POST | `/api/emojis` | 이모지 업로드 (인증 필요) |
| PATCH | `/api/emojis/[id]` | 이모지 수정 (본인/관리자) |
| DELETE | `/api/emojis/[id]` | 이모지 삭제 (본인/관리자) |

#### 인기 이모지 API 상세

```
GET /api/emojis/popular

Query Parameters:
- period: 'week' | 'month' | 'all' (default: 'all')
- limit: number (default: 20, max: 50)
- offset: number (default: 0)

Response:
{
  "data": [
    {
      "id": "uuid",
      "name": "야근",
      "slug": "yagun",
      "image_url": "https://...",
      "click_count": 1234
    }
  ],
  "meta": {
    "period": "week",
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### 8.2 카테고리 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/categories` | 카테고리 목록 |
| GET | `/api/categories/[slug]` | 카테고리 상세 |
| GET | `/api/categories/[slug]/emojis` | 카테고리별 이모지 |

### 8.3 검색 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/search?q=검색어` | 이모지 검색 |
| GET | `/api/search/suggestions?q=검색어` | 자동완성 |

### 8.4 사용자 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/me` | 내 정보 |
| GET | `/api/me/favorites` | 내 즐겨찾기 |
| POST | `/api/me/favorites/[emojiId]` | 즐겨찾기 추가 |
| DELETE | `/api/me/favorites/[emojiId]` | 즐겨찾기 제거 |
| GET | `/api/me/uploads` | 내 업로드 |

---

## 9. UI 컴포넌트

### 9.1 공통 컴포넌트

| 컴포넌트 | 설명 | 기반 |
|----------|------|------|
| `Header` | 헤더 (로고, 검색, 네비게이션) | 수정 필요 |
| `Footer` | 푸터 | 신규 |
| `SearchInput` | 검색창 | shadcn Input |
| `EmojiGrid` | 이모지 그리드 | 신규 |
| `EmojiCard` | 이모지 카드 | shadcn Card |
| `CategoryCard` | 카테고리 카드 | shadcn Card |
| `Pagination` | 페이지네이션 | 신규 |
| `LoadingSpinner` | 로딩 | 신규 |

### 9.2 페이지별 컴포넌트

| 컴포넌트 | 페이지 | 설명 |
|----------|--------|------|
| `HeroSection` | 홈 | 서비스 소개 |
| `PopularEmojis` | 홈 | 인기 이모지 섹션 |
| `RecentEmojis` | 홈 | 최신 이모지 섹션 |
| `CategorySection` | 홈 | 카테고리별 미리보기 |
| `EmojiDetailModal` | 갤러리 | 이모지 상세 모달 |
| `UploadForm` | 업로드 | 업로드 폼 |
| `FavoriteButton` | 공통 | 즐겨찾기 버튼 |

---

## 10. 비기능 요구사항

### 10.1 성능
- 이미지 최적화 (WebP 변환, lazy loading)
- CDN 활용 (Supabase Storage CDN)
- 무한 스크롤 시 가상화
- 검색 debounce (300ms)

### 10.2 접근성
- 이미지 alt 텍스트
- 키보드 네비게이션
- 스크린 리더 호환

### 10.3 SEO
- 메타 태그 최적화
- Open Graph / Twitter Card
- sitemap.xml
- robots.txt

### 10.4 보안
- RLS (Row Level Security)
- 업로드 파일 검증 (타입, 크기)
- Rate limiting
- XSS 방지

---

## 11. 마일스톤

### Phase 1: MVP (2주)
- **Week 1**: 데이터베이스, 홈페이지, 갤러리
- **Week 2**: 검색, 카테고리, 다운로드

### Phase 2: 사용자 기능 (2주)
- **Week 3**: 업로드, 즐겨찾기
- **Week 4**: 마이페이지, 테스트

### Phase 3: 고급 기능 (2주)
- **Week 5**: 관리자 기능
- **Week 6**: 고급 검색, 최적화

---

## 12. 성공 지표 (KPI)

| 지표 | 목표 (3개월) |
|------|-------------|
| 등록 이모지 수 | 500+ |
| 월간 다운로드 수 | 10,000+ |
| 월간 활성 사용자 | 1,000+ |
| 평균 페이지 로드 시간 | < 2초 |
| 검색 성공률 | > 80% |

---

## 13. 콘텐츠 모더레이션 전략

### 13.1 운영 방침
- **운영 체제**: 1인 운영 (자동화 최대화)
- **기본 정책**: 자유 업로드 + 신고 기반 사후 관리
- **단계적 확장**: 트래픽 증가 시 AI 필터링 도입

### 13.2 Phase별 모더레이션 전략

| Phase | 방식 | 비용 | 트리거 |
|-------|------|------|--------|
| **MVP** | 신고 기능 + 자동 숨김 | 0원 | 런칭 |
| **성장기** | + AI 필터링 (Sightengine) | ~무료~$20/월 | 월 500건+ 업로드 |
| **확장기** | + 전문 Moderation API | $50+/월 | 신고 급증 시 |

### 13.3 신고 시스템 설계

#### 데이터베이스 스키마

```sql
-- 신고 테이블
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji_id UUID REFERENCES emojis(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL CHECK (reason IN ('inappropriate', 'copyright', 'spam', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_reports_emoji ON reports(emoji_id);
CREATE INDEX idx_reports_status ON reports(status);
```

#### 자동 숨김 트리거 (신고 3회)

```sql
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_hide
AFTER INSERT ON reports
FOR EACH ROW EXECUTE FUNCTION auto_hide_reported_emoji();
```

#### 신고 사유 분류

| 사유 | 코드 | 설명 | 자동 숨김 기준 |
|------|------|------|---------------|
| 부적절한 콘텐츠 | `inappropriate` | 성인물, 폭력, 혐오 | 3회 |
| 저작권 침해 | `copyright` | 무단 도용 | 1회 (즉시 검토) |
| 스팸 | `spam` | 광고, 중복 업로드 | 5회 |
| 기타 | `other` | 기타 신고 | 5회 |

### 13.4 관리자 알림 시스템

```typescript
// 신고 발생 시 Slack/Email 알림
const notifyAdmin = async (report: Report) => {
  // 저작권 신고는 즉시 알림
  if (report.reason === 'copyright') {
    await sendSlackNotification({
      channel: '#moderation',
      text: `🚨 저작권 신고 접수: ${report.emoji_id}`,
      priority: 'high',
    });
  }
  
  // 자동 숨김 발생 시 알림
  if (report.triggered_auto_hide) {
    await sendSlackNotification({
      channel: '#moderation',
      text: `⚠️ 자동 숨김 처리됨: ${report.emoji_id} (신고 3회)`,
    });
  }
};
```

### 13.5 AI 필터링 (Phase 2 - 선택적)

#### 서비스 비교

| 서비스 | 무료 티어 | 유료 비용 | 정확도 | 추천 |
|--------|----------|----------|--------|------|
| **Sightengine** | 500건/월 | $9/2,000건 | 높음 | **O (1순위)** |
| Google Vision | - | $1.50/1,000건 | 높음 | △ |
| AWS Rekognition | - | $1.00/1,000건 | 높음 | △ |

#### 구현 코드 (Sightengine)

```typescript
// src/lib/moderation.ts
const SIGHTENGINE_USER = process.env.SIGHTENGINE_USER;
const SIGHTENGINE_SECRET = process.env.SIGHTENGINE_SECRET;

type ModerationResult = {
  approved: boolean;
  reason?: string;
  confidence: number;
};

export const checkImageContent = async (
  imageUrl: string
): Promise<ModerationResult> => {
  const response = await fetch(
    `https://api.sightengine.com/1.0/check.json?` +
    `url=${encodeURIComponent(imageUrl)}` +
    `&models=nudity,offensive,gore` +
    `&api_user=${SIGHTENGINE_USER}` +
    `&api_secret=${SIGHTENGINE_SECRET}`
  );
  
  const result = await response.json();
  
  // 판정 기준
  const dominated = result.nudity?.safe < 0.85;
  const isOffensive = result.offensive?.prob > 0.3;
  const isGore = result.gore?.prob > 0.3;
  
  if (isNudity || isOffensive || isGore) {
    return {
      approved: false,
      reason: isNudity ? 'nudity' : isOffensive ? 'offensive' : 'gore',
      confidence: Math.max(
        1 - (result.nudity?.safe || 1),
        result.offensive?.prob || 0,
        result.gore?.prob || 0
      ),
    };
  }
  
  return { approved: true, confidence: result.nudity?.safe || 1 };
};
```

#### 업로드 플로우 (AI 필터링 적용 시)

```
[사용자 업로드]
      │
      ▼
┌─────────────────────┐
│ 클라이언트 검증     │
│ (타입, 크기, 해상도) │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ AI 필터링 (선택적)  │
│ Sightengine API     │
├─────────────────────┤
│ 통과 → 업로드 진행  │
│ 차단 → 업로드 거절  │
│ 의심 → 수동 검토 큐 │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Supabase Storage    │
│ 저장 + DB 등록      │
└─────────────────────┘
```

### 13.6 저작권 대응 절차 (DMCA)

| 단계 | 조치 | 시간 |
|------|------|------|
| 1. 신고 접수 | 이메일/신고 폼으로 접수 | - |
| 2. 임시 조치 | 해당 이모지 숨김 처리 | 24시간 내 |
| 3. 업로더 통지 | 이메일로 이의제기 안내 | 48시간 내 |
| 4. 최종 판단 | 삭제 또는 복원 | 14일 내 |

#### 저작권 신고 양식

```typescript
type CopyrightReport = {
  reporter_name: string;
  reporter_email: string;
  original_work_url: string;      // 원작 증빙
  emoji_ids: string[];            // 신고 대상
  statement: string;              // 저작권자 진술
  signature: boolean;             // 전자 서명 동의
};
```

### 13.7 운영 대시보드 요구사항

| 기능 | 우선순위 | 설명 |
|------|----------|------|
| 신고 목록 | 높음 | 상태별 필터링, 일괄 처리 |
| 자동 숨김 로그 | 높음 | 자동 처리된 항목 확인 |
| 통계 | 중간 | 일별 신고 수, 처리율 |
| 사용자 제재 | 낮음 | 반복 위반자 차단 |

---

## 14. 리스크 및 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 저작권 문제 | 높음 | DMCA 절차 수립, 저작권 신고 즉시 처리, 업로드 가이드라인 |
| 부적절 콘텐츠 | 높음 | 신고 기능 + 자동 숨김(3회), Phase 2에서 AI 필터링 |
| 스토리지 비용 증가 | 중간 | 이미지 최적화, 용량 제한 (500KB) |
| 스팸 업로드 | 중간 | 로그인 필수, 신고 기능, 일일 업로드 제한 (10개) |
| 초기 콘텐츠 부족 | 중간 | 시드 데이터 100개+ 준비 |

---

## 14. 참고 자료

- [Slackmojis.com](https://slackmojis.com) - 벤치마킹 대상
- [Slack Emoji Guidelines](https://slack.com/help/articles/202931348) - 이모지 규격
- [Discord Emoji](https://discord.com/emoji) - 경쟁 서비스 참고
- [Supabase Storage](https://supabase.com/docs/guides/storage) - 이미지 저장

---

## 15. 부록: 초기 시드 데이터

### 15.1 카테고리 시드

```typescript
const categories = [
  { name: "인기", slug: "popular", icon: "🔥", order: 0 },
  { name: "최신", slug: "recent", icon: "✨", order: 1 },
  { name: "회사생활", slug: "work-life", icon: "💼", order: 2 },
  { name: "리액션", slug: "reactions", icon: "👍", order: 3 },
  { name: "한국 밈", slug: "korean-memes", icon: "😂", order: 4 },
  { name: "유행어", slug: "trending", icon: "💬", order: 5 },
  { name: "캐릭터", slug: "characters", icon: "🐱", order: 6 },
  { name: "IT/브랜드", slug: "logos", icon: "💻", order: 7 },
  { name: "GIF/움짤", slug: "animated", icon: "🎬", order: 8 },
  { name: "게임", slug: "games", icon: "🎮", order: 9 },
  { name: "K-POP", slug: "kpop", icon: "🎤", order: 10 },
  { name: "기타", slug: "misc", icon: "📦", order: 99 },
];
```

### 15.2 태그 시드

```typescript
const tags = [
  "직장", "리액션", "밈", "유행어", "캐릭터", "로고", 
  "움짤", "게임", "케이팝", "귀여움", "웃음", "슬픔",
  "화남", "축하", "응원", "공감", "거절", "승인"
];
```

---

*문서 버전: 1.3*
*최종 업데이트: 2026-01-24*
*작성자: Claude Code*

### 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-01-24 | 초안 작성 |
| 1.1 | 2026-01-24 | 소셜 기능 제거, 인기 통계 시스템(실시간 집계) 추가, 기간 필터(주간/월간/전체) 추가 |
| 1.2 | 2026-01-24 | 클릭 Debounce 전략 추가, 이미지 리사이징(Supabase Transform) 상세 설계 추가 |
| 1.3 | 2026-01-24 | 콘텐츠 모더레이션 전략 추가(신고 기능, AI 필터링, DMCA 절차), ERD 정합성 수정, 다운로드 원본 포맷 정책 명시 |
