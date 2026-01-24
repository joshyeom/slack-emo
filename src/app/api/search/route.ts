import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ data: [], meta: { query: "", limit, offset } });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_emojis", {
    p_query: query.trim(),
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    meta: {
      query: query.trim(),
      limit,
      offset,
    },
  });
}
