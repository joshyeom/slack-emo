"use client";

import { useMemo } from "react";

import { useSearchContext } from "@/components/search-provider";

import type { Emoji, PopularEmoji } from "@/types/database";

export const useFilteredEmojis = (emojis: (Emoji | PopularEmoji)[]) => {
  const { deferredQuery } = useSearchContext();

  const filteredEmojis = useMemo(() => {
    if (!deferredQuery.trim()) return emojis;

    const query = deferredQuery.toLowerCase().trim();
    return emojis.filter((emoji) => emoji.name.toLowerCase().includes(query));
  }, [emojis, deferredQuery]);

  return { filteredEmojis, deferredQuery };
};
