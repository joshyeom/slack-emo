"use client";

import type { Emoji, PopularEmoji } from "@/types/database";

import { useFilteredEmojis } from "@/hooks";

import { EmojiGrid } from "./EmojiGrid";

type EmojiListProps = {
  emojis: (Emoji | PopularEmoji)[];
};

export const EmojiList = ({ emojis }: EmojiListProps) => {
  const { filteredEmojis, deferredQuery } = useFilteredEmojis(emojis);

  if (filteredEmojis.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <p className="text-muted-foreground">No emojis found for &quot;{deferredQuery}&quot;</p>
      </div>
    );
  }

  return <EmojiGrid emojis={filteredEmojis} />;
};
