# TDD 가이드 - KoreanMojis

## 테스트 환경 구성

### 기술 스택

| 도구                  | 용도             | 버전  |
| --------------------- | ---------------- | ----- |
| Vitest                | 단위/통합 테스트 | ^4.0  |
| React Testing Library | 컴포넌트 테스트  | ^16.3 |
| Playwright            | E2E 테스트       | ^1.58 |
| MSW                   | API 모킹         | ^2.12 |

### 디렉토리 구조

```
src/
├── test/
│   ├── setup.ts              # Vitest 글로벌 설정
│   └── mocks/
│       ├── handlers.ts       # MSW 핸들러 (API 모킹)
│       ├── server.ts         # MSW 서버 설정
│       └── supabase.ts       # Supabase 클라이언트 모킹
├── components/
│   └── emoji/
│       └── __tests__/        # 컴포넌트 테스트
│           ├── EmojiCard.test.tsx
│           └── EmojiGrid.test.tsx
└── lib/
    └── api/
        └── __tests__/        # API 함수 테스트
e2e/
└── home.spec.ts              # E2E 테스트
```

---

## 명령어

```bash
# 단위/통합 테스트
npm run test              # watch 모드
npm run test:run          # 한 번 실행
npm run test:coverage     # 커버리지 리포트
npm run test:ui           # Vitest UI

# E2E 테스트
npm run e2e               # Playwright 테스트 실행
npm run e2e:ui            # Playwright UI 모드
npm run e2e:report        # 테스트 리포트 보기
```

---

## TDD 워크플로우

### Red-Green-Refactor 사이클

```
1. RED    - 실패하는 테스트 작성
2. GREEN  - 테스트 통과하는 최소한의 코드 작성
3. REFACTOR - 코드 개선 (테스트는 계속 통과해야 함)
```

### 예시: 새 컴포넌트 개발

```typescript
// 1. RED - 먼저 테스트 작성
// src/components/emoji/__tests__/EmojiModal.test.tsx
import { render, screen } from '@testing-library/react'
import { EmojiModal } from '../EmojiModal'

describe('EmojiModal', () => {
  it('shows emoji details when open', () => {
    const emoji = { id: '1', name: 'test', slug: 'test', ... }
    render(<EmojiModal emoji={emoji} open={true} />)

    expect(screen.getByText('test')).toBeInTheDocument()
  })
})

// 2. GREEN - 테스트 통과하는 코드 작성
// src/components/emoji/EmojiModal.tsx
export const EmojiModal = ({ emoji, open }: Props) => {
  if (!open) return null
  return <div>{emoji.name}</div>
}

// 3. REFACTOR - 스타일링, 접근성 등 개선
```

---

## 컴포넌트 테스트 패턴

### 기본 렌더링 테스트

```typescript
import { render, screen } from '@testing-library/react'
import { EmojiCard } from '../EmojiCard'

it('renders emoji name', () => {
  render(<EmojiCard emoji={mockEmoji} />)
  expect(screen.getByText(':test-emoji:')).toBeInTheDocument()
})
```

### 사용자 인터랙션 테스트

```typescript
import userEvent from '@testing-library/user-event'

it('calls onDownload when clicked', async () => {
  const user = userEvent.setup()
  const onDownload = vi.fn()

  render(<EmojiCard emoji={mockEmoji} onDownload={onDownload} />)

  await user.click(screen.getByRole('button'))

  expect(onDownload).toHaveBeenCalledWith(mockEmoji)
})
```

### 비동기 동작 테스트

```typescript
import { waitFor } from '@testing-library/react'

it('shows loading state during download', async () => {
  render(<EmojiCard emoji={mockEmoji} />)

  fireEvent.click(screen.getByRole('button'))

  // 로딩 중에는 버튼 비활성화
  expect(screen.getByRole('button')).toBeDisabled()

  // 완료 후 버튼 활성화
  await waitFor(() => {
    expect(screen.getByRole('button')).not.toBeDisabled()
  })
})
```

---

## API 모킹

### MSW 핸들러 추가

```typescript
// src/test/mocks/handlers.ts
import { HttpResponse, http } from "msw";

export const handlers = [
  // 새 엔드포인트 추가
  http.get("/api/emojis/:id", ({ params }) => {
    const emoji = mockEmojis.find((e) => e.id === params.id);
    if (!emoji) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(emoji);
  }),
];
```

### 테스트별 핸들러 오버라이드

```typescript
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

it('handles API error', async () => {
  // 이 테스트에서만 에러 응답
  server.use(
    http.get('/api/emojis/popular', () => {
      return new HttpResponse(null, { status: 500 })
    })
  )

  render(<PopularEmojis />)

  await waitFor(() => {
    expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument()
  })
})
```

---

## Supabase 모킹

### 기본 사용법

```typescript
import { createMockSupabaseClient } from "@/test/mocks/supabase";

it("fetches emojis from supabase", async () => {
  const mockClient = createMockSupabaseClient();

  // 특정 데이터 반환하도록 설정
  mockClient._mocks.select.mockResolvedValue({
    data: [{ id: "1", name: "custom" }],
    error: null,
  });

  // 컴포넌트 렌더링 및 테스트
});
```

### RPC 함수 모킹

```typescript
it("calls get_popular_emojis RPC", async () => {
  const mockClient = createMockSupabaseClient();

  mockClient._mocks.rpc.mockResolvedValue({
    data: mockPopularEmojis,
    error: null,
  });

  // rpc 호출 검증
  expect(mockClient._mocks.rpc).toHaveBeenCalledWith("get_popular_emojis", {
    p_period: "week",
    p_limit: 20,
    p_offset: 0,
  });
});
```

---

## E2E 테스트 패턴

### 페이지 네비게이션

```typescript
import { expect, test } from "@playwright/test";

test("navigates from home to category", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /카테고리/i }).click();

  await expect(page).toHaveURL("/categories");
  await expect(page.getByRole("heading")).toContainText("카테고리");
});
```

### 검색 기능 테스트

```typescript
test("searches for emojis", async ({ page }) => {
  await page.goto("/");

  const searchInput = page.getByPlaceholder(/검색/i);
  await searchInput.fill("파티");
  await searchInput.press("Enter");

  await expect(page).toHaveURL(/\/search\?q=파티/);
  await expect(page.getByRole("main")).toContainText("파티");
});
```

### 다운로드 테스트

```typescript
test("downloads emoji on click", async ({ page }) => {
  await page.goto("/emojis/popular");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /파티/i }).first().click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.png$|\.gif$/);
});
```

---

## 테스트 작성 체크리스트

### 컴포넌트

- [ ] 기본 렌더링 (props에 따른 UI 변화)
- [ ] 사용자 인터랙션 (클릭, 입력, 호버)
- [ ] 조건부 렌더링 (loading, error, empty 상태)
- [ ] 접근성 (role, aria-label)
- [ ] 에지 케이스 (빈 데이터, 긴 텍스트)

### API 라우트

- [ ] 성공 응답
- [ ] 에러 핸들링 (400, 404, 500)
- [ ] 입력 유효성 검사
- [ ] 인증/권한 검사

### E2E

- [ ] Happy path (정상 사용 흐름)
- [ ] 에러 처리 (네트워크 에러, 서버 에러)
- [ ] 반응형 (모바일, 태블릿, 데스크톱)
- [ ] 성능 (페이지 로드 시간)

---

## 베스트 프랙티스

### DO ✅

```typescript
// 명확한 테스트 이름
it('shows error message when API fails', ...)

// 사용자 관점의 쿼리
screen.getByRole('button', { name: /다운로드/i })

// 하나의 테스트에 하나의 assertion
it('disables button during loading', () => {
  expect(button).toBeDisabled()
})
```

### DON'T ❌

```typescript
// 구현 세부사항 테스트 X
expect(component.state.isLoading).toBe(true)

// 테스트 ID 의존 X (접근성 문제)
screen.getByTestId('download-button')

// 여러 기능을 하나의 테스트에 X
it('loads, displays, and handles errors', ...)
```

---

## 커버리지 목표

| 영역       | 목표 | 현재 |
| ---------- | ---- | ---- |
| 컴포넌트   | 80%  | -    |
| API 라우트 | 90%  | -    |
| 유틸리티   | 95%  | -    |
| 전체       | 80%  | -    |

```bash
# 커버리지 확인
npm run test:coverage
```

---

## 참고 자료

- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright 공식 문서](https://playwright.dev/)
- [MSW 공식 문서](https://mswjs.io/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
