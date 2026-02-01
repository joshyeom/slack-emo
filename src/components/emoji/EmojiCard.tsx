"use client";

import { useCallback, useMemo } from "react";

import Image from "next/image";

import debounce from "lodash.debounce";

import { cn } from "@/lib/utils";

import type { Emoji, PopularEmoji } from "@/types/database";

type EmojiCardProps = {
  emoji: Emoji | PopularEmoji;
  onDownload?: (emoji: Emoji | PopularEmoji) => void;
};

export const EmojiCard = ({ emoji, onDownload }: EmojiCardProps) => {
  // Debounced click tracking
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

  const handleClick = useCallback(() => {
    // Track click (debounced)
    trackClick(emoji.slug);

    if (onDownload) {
      onDownload(emoji);
    } else {
      downloadEmoji(emoji);
    }
  }, [emoji, onDownload, trackClick]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col items-center justify-center",
        "rounded-lg p-3 transition-all",
        "hover:bg-muted",
        "focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none"
      )}
    >
      {/* Emoji Image */}
      <div className="relative h-12 w-12 sm:h-16 sm:w-16">
        <Image
          src={emoji.image_url}
          alt={emoji.name}
          fill
          className="object-contain"
          unoptimized={emoji.is_animated}
        />
      </div>

      {/* Emoji Name */}
      <span className="text-muted-foreground mt-2 w-full truncate text-center text-xs">
        :{emoji.slug}:
      </span>
    </button>
  );
};

// Helper function to download emoji
const downloadEmoji = async (emoji: Emoji | PopularEmoji) => {
  const response = await fetch(emoji.image_url);
  const blob = await response.blob();

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${emoji.slug}.${emoji.is_animated ? "gif" : "png"}`;
  link.click();

  URL.revokeObjectURL(link.href);
};
