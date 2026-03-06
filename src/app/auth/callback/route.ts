import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// next 파라미터가 안전한 상대경로인지 검증
const getSafeRedirectPath = (next: string | null): string => {
  if (!next) return "/";
  // 상대경로만 허용 (/로 시작, //로 시작하면 프로토콜 상대 URL이므로 차단)
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
};

export const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
};
