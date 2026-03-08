import { NextRequest, NextResponse } from "next/server";

import { apiError, withErrorHandler } from "@/lib/api/error";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// POST /api/error-logs - 클라이언트 에러 리포트
export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient();
  if (!supabase) {
    throw apiError("DB_ERROR", undefined, "Database connection failed");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = await request.json();
  const { type, message, metadata } = body;

  if (!type || !message) {
    throw apiError("BAD_REQUEST", "type과 message는 필수입니다");
  }

  const userAgent = request.headers.get("user-agent") || undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("error_logs").insert({
    user_id: user?.id || null,
    type,
    message,
    metadata: metadata || {},
    user_agent: userAgent,
  });

  if (error) {
    throw apiError("DB_ERROR", undefined, `Error log insert: ${error.message}`);
  }

  return NextResponse.json({ success: true }, { status: 201 });
});
