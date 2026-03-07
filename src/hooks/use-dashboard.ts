"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { Emoji, PopularEmoji } from "@/types/database";

const PAGE_SIZE = 30;

type EmojiPage = {
  emojis: (Emoji | PopularEmoji)[];
  hasMore: boolean;
};

type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

const fetchDashboardSection = async (
  section: string,
  offset: number,
  categoryId?: string
): Promise<EmojiPage> => {
  const params = new URLSearchParams({
    section,
    limit: String(PAGE_SIZE),
    offset: String(offset),
  });
  if (categoryId) params.set("category_id", categoryId);

  const res = await fetch(`/api/emojis/dashboard?${params}`, { cache: "no-store" });
  if (!res.ok) return { emojis: [], hasMore: false };
  return res.json();
};

export const usePopularEmojis = () =>
  useInfiniteQuery({
    queryKey: ["dashboard", "popular"],
    queryFn: ({ pageParam = 0 }) => fetchDashboardSection("popular", pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * PAGE_SIZE : undefined,
    initialPageParam: 0,
  });

export const useRecentEmojis = () =>
  useInfiniteQuery({
    queryKey: ["dashboard", "recent"],
    queryFn: ({ pageParam = 0 }) => fetchDashboardSection("recent", pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * PAGE_SIZE : undefined,
    initialPageParam: 0,
  });

export const useCategorySummaries = () =>
  useQuery<CategorySummary[]>({
    queryKey: ["dashboard", "categories"],
    queryFn: async () => {
      const res = await fetch("/api/emojis/dashboard?section=categories", { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return data.categories || [];
    },
  });

export const useCategoryEmojis = (categoryId: string) =>
  useInfiniteQuery({
    queryKey: ["dashboard", "category", categoryId],
    queryFn: ({ pageParam = 0 }) => fetchDashboardSection("category", pageParam, categoryId),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * PAGE_SIZE : undefined,
    initialPageParam: 0,
    enabled: !!categoryId,
  });
