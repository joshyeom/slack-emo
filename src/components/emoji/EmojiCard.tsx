"use client";

import { Download, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";

import { cn } from "@/lib/utils";

import type { Emoji, PopularEmoji } from "@/types/database";

type EmojiCardProps = {
  emoji: Emoji | PopularEmoji;
  showClickCount?: boolean;
  onDownload?: (emoji: Emoji | PopularEmoji) => Promise<void>;
};

export const EmojiCard = ({ emoji, showClickCount = false, onDownload }: EmojiCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Debounced click tracking
  const trackClick = useMemo(
    () =>
      debounce(async (emojiId: string) => {
        try {
          await fetch(`/api/emojis/${emojiId}/click`, { method: "POST" });
        } catch (error) {
          console.error("Failed to track click:", error);
        }
      }, 2000, { leading: true, trailing: false }),
    []
  );

  const handleClick = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    // Track click (debounced)
    trackClick(emoji.id);

    try {
      if (onDownload) {
        await onDownload(emoji);
      } else {
        // Default download behavior
        await downloadEmoji(emoji);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [emoji, isDownloading, onDownload, trackClick]);

  const clickCount = "click_count" in emoji ? emoji.click_count : 0;

  return (
    <button
      onClick={handleClick}
      disabled={isDownloading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col items-center justify-center",
        "rounded-lg border bg-card p-3 transition-all",
        "hover:border-primary hover:shadow-md hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "aspect-square"
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
      <span className="mt-2 text-xs text-muted-foreground truncate w-full text-center">
        :{emoji.slug}:
      </span>

      {/* Click Count */}
      {showClickCount && clickCount > 0 && (
        <span className="absolute top-1 right-1 text-[10px] text-muted-foreground bg-muted px-1 rounded">
          {formatCount(clickCount)}
        </span>
      )}

      {/* Download Overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 transition-opacity",
          isHovered || isDownloading ? "opacity-100" : "opacity-0"
        )}
      >
        {isDownloading ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        ) : (
          <Download className="h-6 w-6 text-white" />
        )}
      </div>
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

// Helper function to format count
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
