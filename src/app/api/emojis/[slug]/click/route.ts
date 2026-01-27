import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  // Get emoji
  const { data: emoji, error: emojiError } = await supabase
    .from("emojis")
    .select("id")
    .eq("slug", slug)
    .single();

  if (emojiError || !emoji) {
    return NextResponse.json({ error: "Emoji not found" }, { status: 404 });
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

  // Check duplicate clicks (same IP/user within 1 minute)
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
    // Duplicate click - don't record but return success
    return NextResponse.json({ success: true, duplicate: true });
  }

  // Record click
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
