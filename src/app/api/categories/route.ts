import { NextResponse } from "next/server";

import { withErrorHandler } from "@/lib/api/error";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/categories - Fetch all categories
export const GET = withErrorHandler(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(data || []);
});
