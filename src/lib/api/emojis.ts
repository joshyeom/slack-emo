import { createClient } from "@/lib/supabase/server";

import type { Category, Emoji, PopularEmoji, PopularPeriod } from "@/types/database";

/**
 * 인기 이모지 조회
 */
export const getPopularEmojis = async (
  period: PopularPeriod = "all",
  limit = 20,
  offset = 0
): Promise<PopularEmoji[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_popular_emojis", {
    p_period: period,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("Failed to get popular emojis:", error);
    return [];
  }

  return data || [];
};

/**
 * 최신 이모지 조회
 */
export const getRecentEmojis = async (limit = 20, offset = 0): Promise<Emoji[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("emojis")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to get recent emojis:", error);
    return [];
  }

  return data || [];
};

/**
 * 카테고리별 이모지 조회
 */
export const getEmojisByCategory = async (
  categorySlug: string,
  limit = 20,
  offset = 0
): Promise<Emoji[]> => {
  const supabase = await createClient();

  // 먼저 카테고리 ID 조회
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return [];

  const { data, error } = await supabase
    .from("emojis")
    .select("*")
    .eq("category_id", category.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to get emojis by category:", error);
    return [];
  }

  return data || [];
};

/**
 * 카테고리 목록 조회
 */
export const getCategories = async (): Promise<Category[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Failed to get categories:", error);
    return [];
  }

  return data || [];
};

/**
 * 단일 카테고리 조회
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single();

  if (error) {
    console.error("Failed to get category:", error);
    return null;
  }

  return data;
};

/**
 * 이모지 검색
 */
export const searchEmojis = async (
  query: string,
  limit = 20,
  offset = 0
): Promise<SearchedEmoji[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_emojis", {
    p_query: query,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("Failed to search emojis:", error);
    return [];
  }

  return data || [];
};

// 검색 결과 타입
type SearchedEmoji = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  image_path: string;
  category_id: string | null;
  is_animated: boolean;
  created_at: string;
};

/**
 * 카테고리별 이모지 수 조회
 */
export const getCategoriesWithCount = async (): Promise<(Category & { emoji_count: number })[]> => {
  const supabase = await createClient();

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (catError || !categories) return [];

  // 각 카테고리별 이모지 수 조회
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from("emojis")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
        .eq("is_approved", true);

      return {
        ...category,
        emoji_count: count || 0,
      };
    })
  );

  return categoriesWithCount;
};
