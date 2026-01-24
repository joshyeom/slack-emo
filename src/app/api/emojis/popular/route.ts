import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import type { PopularPeriod } from "@/types/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const period = (searchParams.get("period") as PopularPeriod) || "all";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_popular_emojis", {
    p_period: period,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    meta: {
      period,
      limit,
      offset,
    },
  });
}
