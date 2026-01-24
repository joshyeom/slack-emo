# Next.js Fullstack Boilerplate

Next.js 16 + TypeScript + TailwindCSS + shadcn/ui + Supabase + Capacitor 기반의 풀스택 보일러플레이트입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Auth & DB**: Supabase
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Mobile**: Capacitor (iOS/Android)
- **Code Quality**: ESLint + Prettier + Commitlint + Husky

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. Authentication > Providers에서 Google OAuth 설정
3. SQL Editor에서 `supabase/schema.sql` 실행

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인하세요.

## 스크립트

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅
npm run typecheck    # TypeScript 타입 검사
npm run check-all    # 모든 검사 실행
npm run barrels      # Barrel 파일 자동 생성

# Capacitor (모바일)
npm run ios          # iOS 빌드 + Xcode 열기
npm run android      # Android 빌드 + Android Studio 열기
npm run cap:sync     # 웹 에셋 동기화
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   │   └── login/         # 로그인 페이지
│   ├── (main)/            # 인증된 사용자 페이지
│   │   └── page.tsx       # 홈 페이지
│   ├── auth/callback/     # OAuth 콜백
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   └── theme-provider.tsx # 테마 프로바이더
├── lib/                   # 유틸리티
│   ├── supabase/         # Supabase 클라이언트
│   │   ├── client.ts     # 브라우저용
│   │   ├── server.ts     # 서버용
│   │   └── middleware.ts # 미들웨어용
│   └── utils.ts          # cn() 등 유틸
├── types/                 # TypeScript 타입
│   └── database.ts       # Supabase 타입
└── middleware.ts          # Next.js 미들웨어 (인증)
```

## 커스터마이징

### 앱 정보 변경

다음 파일들에서 앱 이름과 설명을 변경하세요:

1. `src/app/layout.tsx` - 메타데이터
2. `src/app/(auth)/login/page.tsx` - 로그인 페이지
3. `src/components/layout/Header.tsx` - 헤더
4. `capacitor.config.ts` - 모바일 앱 설정
5. `package.json` - 패키지 이름

### shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add [component-name]
```

### 테이블 추가

1. `supabase/schema.sql`에 테이블 정의 추가
2. `src/types/database.ts`에 타입 추가
3. Supabase SQL Editor에서 실행

## 모바일 앱 (Capacitor)

### iOS

```bash
# Xcode 및 CocoaPods 필요
npm run ios
```

### Android

```bash
# Android Studio 필요
npm run android
```

### 주의사항

Next.js는 서버 기능(API Routes, Middleware)이 필요하므로, 모바일 앱에서는:

1. Vercel에 배포
2. `capacitor.config.ts`에서 `server.url`을 Vercel URL로 설정
3. WebView로 로드하는 방식 권장

## 코드 품질

### 커밋 메시지 규칙

```bash
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
perf: 성능 개선
test: 테스트
chore: 빌드, 설정 변경
```

### Pre-commit Hook

커밋 시 자동으로 lint + format이 실행됩니다 (Husky + lint-staged).

## 배포

### Vercel (권장)

```bash
vercel
```

### 환경 변수

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 라이선스

MIT
# nextjs-fullstack-boilerplate
