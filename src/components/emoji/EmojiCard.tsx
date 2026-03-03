"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import type { Emoji, PopularEmoji } from "@/types/database";

import { useEmojiDownload } from "@/hooks";

type EmojiCardProps = {
  emoji: Emoji | PopularEmoji;
};

export const EmojiCard = ({ emoji }: EmojiCardProps) => {
  const { handleDownload } = useEmojiDownload(emoji);

  return (
    <button
      onClick={handleDownload}
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
