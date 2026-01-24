import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const supabase = await createClient();

  // 이모지 조회
  const { data: emoji, error: emojiError } = await supabase
    .from("emojis")
    .select("id")
    .eq("slug", slug)
    .single();

  if (emojiError || !emoji) {
    return NextResponse.json({ error: "Emoji not found" }, { status: 404 });
  }

  // 헤더에서 정보 추출
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : null;
  const userAgent = headersList.get("user-agent");

  // 현재 사용자 조회
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 중복 클릭 체크 (같은 IP/유저가 1분 내 동일 이모지 클릭)
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

  let duplicateQuery = supabase
    .from("clicks")
    .select("id")
    .eq("emoji_id", emoji.id)
    .gte("created_at", oneMinuteAgo);

  if (user) {
    duplicateQuery = duplicateQuery.eq("user_id", user.id);
  } else if (ip) {
    duplicateQuery = duplicateQuery.eq("ip_address", ip);
  }

  const { data: existingClick } = await duplicateQuery.limit(1);

  if (existingClick && existingClick.length > 0) {
    // 중복 클릭 - 기록하지 않지만 성공 응답
    return NextResponse.json({ success: true, duplicate: true });
  }

  // 클릭 기록
  const { error: clickError } = await supabase.from("clicks").insert({
    emoji_id: emoji.id,
    user_id: user?.id || null,
    ip_address: ip,
    user_agent: userAgent,
  });

  if (clickError) {
    console.error("Failed to record click:", clickError);
    return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
