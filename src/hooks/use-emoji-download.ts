"use client";

import { useCallback, useMemo } from "react";

import debounce from "lodash.debounce";

import { optimizeForSlack } from "@/lib/optimize-for-slack";

import type { Emoji, PopularEmoji } from "@/types/database";

const downloadEmoji = async (emoji: Emoji | PopularEmoji) => {
  const response = await fetch(emoji.image_url);
  const blob = await response.blob();

  const { blob: optimized, extension } = await optimizeForSlack(blob);

  const link = document.createElement("a");
  link.href = URL.createObjectURL(optimized);
  link.download = `${emoji.name}.${extension}`;
  link.click();

  URL.revokeObjectURL(link.href);
};

export const useEmojiDownload = (emoji: Emoji | PopularEmoji) => {
  const trackClick = useMemo(
    () =>
      debounce(
        async (emojiSlug: string) => {
          try {
            await fetch(`/api/emojis/${emojiSlug}/click`, { method: "POST" });
          } catch (error) {
            console.error("Failed to track click:", error);
          }
        },
        2000,
        { leading: true, trailing: false }
      ),
    []
  );

  const handleDownload = useCallback(() => {
    trackClick(emoji.slug);
    downloadEmoji(emoji);
  }, [emoji, trackClick]);

  return { handleDownload };
};
