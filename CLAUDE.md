# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 기반 풀스택 보일러플레이트. Supabase를 사용한 인증 및 데이터 저장, Capacitor를 통한 iOS/Android 네이티브 앱 빌드 지원.

## Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Start production server

# Capacitor (iOS/Android)
npm run ios      # Build + sync + open Xcode
npm run android  # Build + sync + open Android Studio
npm run cap:sync # Sync web assets to native projects
```

## Architecture

**Stack**: Next.js 16 (App Router) + TypeScript + TailwindCSS + shadcn/ui + Supabase

**Key Directories**:

- `src/app/` - Next.js App Router pages and API routes
  - `(auth)/` - 인증 관련 페이지 (login)
  - `(main)/` - 인증된 사용자용 페이지
  - `auth/callback/` - OAuth callback handler
- `src/components/` - React 컴포넌트
  - `ui/` - shadcn/ui 기본 컴포넌트
  - `layout/` - 레이아웃 컴포넌트
- `src/lib/supabase/` - Supabase 클라이언트 (client, server, middleware)
- `src/types/` - TypeScript 타입 정의
- `supabase/schema.sql` - DB 스키마 (Supabase SQL Editor에서 실행)

**Path Alias**: `@/*` maps to `src/*`

## Supabase Setup

1. Supabase 프로젝트 생성 후 `.env.local` 설정:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

2. Authentication > Providers에서 Google OAuth 설정
3. SQL Editor에서 `supabase/schema.sql` 실행

## Data Model

- **profiles**: 사용자 프로필 (auth.users와 연결)

RLS 정책으로 사용자별 데이터 격리.

## Mobile (Capacitor)

iOS/Android 네이티브 앱 빌드를 위한 Capacitor 설정:

- `capacitor.config.ts` - 앱 ID, 이름, webDir 설정
- `ios/` - Xcode 프로젝트 (Pod install 필요)
- `android/` - Android Studio 프로젝트

**주의**: Next.js는 서버 기능(API Routes, middleware)이 있으므로 Vercel 배포 후 WebView로 로드하는 방식 권장.

## Code Conventions

- **함수**: 화살표 함수 우선 (`const fn = () => {}`)
- **타입**: `interface` 대신 `type` 사용
- **Export**: Named export 우선 (페이지 제외)
- **Import 순서**: React → Next → 외부 라이브러리 → 내부 (@/)
- **커밋**: Conventional Commits (feat, fix, docs, style, refactor, perf, test, chore)
