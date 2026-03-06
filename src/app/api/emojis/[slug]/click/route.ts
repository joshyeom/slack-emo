import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { apiError, withErrorHandler } from "@/lib/api/error";
import { checkRateLimit } from "@/lib/api/rate-limit";
import { createClient } from "@/lib/supabase/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export const POST = withErrorHandler(async (_request: NextRequest, { params }: RouteParams) => {
  // Rate limit: 1분에 60회
  const rateLimited = checkRateLimit(_request, { maxRequests: 60 });
  if (rateLimited) return rateLimited;

  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) {
    throw apiError("DB_ERROR", undefined, "Database not configured");
  }

  // Get emoji
  const { data: emoji, error: emojiError } = await supabase
    .from("emojis")
    .select("id")
    .eq("slug", slug)
    .single();

  if (emojiError || !emoji) {
    throw apiError("NOT_FOUND", "이모지를 찾을 수 없습니다");
  }

  // Extract headers
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : null;
  const userAgent = headersList.get("user-agent");

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RPC로 중복 체크 + 삽입을 DB 수준에서 처리 (SECURITY DEFINER로 RLS 우회)
  const { data: inserted, error: clickError } = await supabase.rpc(
    "insert_click_if_not_duplicate",
    {
      p_emoji_id: emoji.id,
      p_user_id: user?.id || null,
      p_ip_address: ip,
      p_user_agent: userAgent,
    }
  );

  if (clickError) {
    throw apiError("DB_ERROR", undefined, `Click record failed: ${clickError.message}`);
  }

  return NextResponse.json({ success: true, duplicate: !inserted });
});
