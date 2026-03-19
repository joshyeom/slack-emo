"use client";

import { useCallback, useMemo } from "react";

import debounce from "lodash.debounce";
import { toast } from "sonner";

import { optimizeForSlack } from "@/lib/optimize-for-slack";

import type { Emoji, PopularEmoji } from "@/types/database";

const downloadEmoji = async (emoji: Emoji | PopularEmoji) => {
  const response = await fetch(emoji.image_url);
  const blob = await response.blob();

  const { blob: optimized, extension, skipped } = await optimizeForSlack(blob);

  if (skipped) {
    toast.warning("GIF 용량이 128KB를 초과합니다. 원본으로 다운로드됩니다.", {
      description: "Slack 업로드 시 용량 제한에 걸릴 수 있습니다.",
    });
  }

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
