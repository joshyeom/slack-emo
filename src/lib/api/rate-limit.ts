import { NextRequest, NextResponse } from "next/server";

// 인메모리 rate limit (단일 인스턴스용 — Vercel serverless에서는 요청마다 리셋됨)
// 프로덕션에서는 Vercel WAF 또는 Redis 기반 rate limiter 사용 권장
const requests = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1분
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5분마다 정리

// 오래된 항목 정리
let lastCleanup = Date.now();
const cleanup = () => {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, value] of requests) {
    if (now > value.resetAt) {
      requests.delete(key);
    }
  }
};

type RateLimitConfig = {
  maxRequests: number;
  windowMs?: number;
};

export const checkRateLimit = (
  request: NextRequest,
  config: RateLimitConfig
): NextResponse | null => {
  cleanup();

  const { maxRequests, windowMs = WINDOW_MS } = config;
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  const existing = requests.get(key);

  if (!existing || now > existing.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  existing.count++;

  if (existing.count > maxRequests) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요" },
      { status: 429 }
    );
  }

  return null;
};
