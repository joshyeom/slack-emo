"use client";

import { useState } from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

import type { Emoji, PopularEmoji } from "@/types/database";

import { useEmojiDownload } from "@/hooks";

type EmojiCardProps = {
  emoji: Emoji | PopularEmoji;
  tooltipDirection?: "top" | "bottom";
};

export const EmojiCard = ({ emoji, tooltipDirection = "top" }: EmojiCardProps) => {
  const { handleDownload } = useEmojiDownload(emoji);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={handleDownload}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative flex cursor-pointer items-center gap-3",
        "border-border rounded-md border px-3 py-2.5 transition-all",
        "hover:bg-muted",
        "focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none"
      )}
    >
      <div className="relative h-8 w-8 shrink-0">
        <Image
          src={emoji.image_url}
          alt={emoji.name}
          fill
          className="object-contain"
          unoptimized={emoji.is_animated}
        />
      </div>
      <span className="truncate text-sm">:{emoji.name}</span>

      {/* Hover tooltip - only render image when hovered */}
      {hovered && (
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2",
            "animate-in fade-in zoom-in-95 duration-200",
            tooltipDirection === "top" ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          <div className="bg-popover ring-border flex flex-col items-center gap-1.5 rounded-lg px-4 py-3 shadow-lg ring-1">
            <div className="relative h-16 w-16">
              <Image
                src={emoji.image_url}
                alt={emoji.name}
                fill
                className="object-contain"
                unoptimized={emoji.is_animated}
              />
            </div>
            <span className="text-muted-foreground text-xs whitespace-nowrap">{emoji.name}</span>
          </div>
        </div>
      )}
    </button>
  );
};
