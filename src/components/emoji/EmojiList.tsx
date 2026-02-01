"use client";

import { useMemo } from "react";

import { useSearchContext } from "@/components/search-provider";

import type { Emoji, PopularEmoji } from "@/types/database";

import { EmojiGrid } from "./EmojiGrid";

type EmojiListProps = {
  emojis: (Emoji | PopularEmoji)[];
};

export const EmojiList = ({ emojis }: EmojiListProps) => {
  const { deferredQuery } = useSearchContext();

  const filteredEmojis = useMemo(() => {
    if (!deferredQuery.trim()) return emojis;

    const query = deferredQuery.toLowerCase().trim();
    return emojis.filter((emoji) => emoji.name.toLowerCase().includes(query));
  }, [emojis, deferredQuery]);

  if (filteredEmojis.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <p className="text-muted-foreground">No emojis found for "{deferredQuery}"</p>
      </div>
    );
  }

  return <EmojiGrid emojis={filteredEmojis} />;
};
