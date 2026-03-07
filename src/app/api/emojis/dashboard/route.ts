import { NextRequest, NextResponse } from "next/server";

import { apiError, withErrorHandler } from "@/lib/api/error";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 50;

// GET /api/emojis/dashboard?section=popular|recent|category&category_id=xxx&offset=0&limit=30
export const GET = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient();
  if (!supabase) {
    throw apiError("DB_ERROR", undefined, "Database connection failed");
  }

  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") || "popular";
  const limit = Math.min(Number(searchParams.get("limit")) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

  if (section === "popular") {
    const { data, error } = await supabase.rpc("get_popular_emojis", {
      p_period: "all",
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      throw apiError("DB_ERROR", undefined, `Popular fetch: ${error.message}`);
    }

    return NextResponse.json({ emojis: data || [], hasMore: (data?.length || 0) === limit });
  }

  if (section === "recent") {
    const { data, error } = await supabase
      .from("emojis")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw apiError("DB_ERROR", undefined, `Recent fetch: ${error.message}`);
    }

    return NextResponse.json({ emojis: data || [], hasMore: (data?.length || 0) === limit });
  }

  if (section === "categories") {
    // Return all categories with their emoji counts
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*, emojis(count)")
      .order("order", { ascending: true });

    if (error) {
      return NextResponse.json({ categories: [] });
    }

    const result = (categories || [])
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: (cat.emojis as unknown as { count: number }[])?.[0]?.count || 0,
      }))
      .filter((cat) => cat.count > 0);

    return NextResponse.json({ categories: result });
  }

  if (section === "category") {
    const categoryId = searchParams.get("category_id");
    if (!categoryId) {
      throw apiError("BAD_REQUEST", "category_id is required");
    }

    const { data, error } = await supabase
      .from("emojis")
      .select("*")
      .eq("is_approved", true)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw apiError("DB_ERROR", undefined, `Category fetch: ${error.message}`);
    }

    return NextResponse.json({ emojis: data || [], hasMore: (data?.length || 0) === limit });
  }

  throw apiError("BAD_REQUEST", "Invalid section parameter");
});
