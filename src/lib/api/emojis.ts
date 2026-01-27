import { createClient } from "@/lib/supabase/server";

import type { Emoji } from "@/types/database";

/**
 * Get all emojis
 */
export const getAllEmojis = async (limit = 100, offset = 0): Promise<Emoji[]> => {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("emojis")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    // Table may not exist yet - expected during initial setup
    if (error.code !== "PGRST116" && error.code !== "42P01") {
      console.error("Failed to get all emojis:", error.message, error.code);
    }
    return [];
  }

  return data || [];
};
