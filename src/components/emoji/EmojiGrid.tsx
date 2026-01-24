import { cn } from "@/lib/utils";

import { EmojiCard } from "./EmojiCard";

import type { Emoji, PopularEmoji } from "@/types/database";

type EmojiGridProps = {
  emojis: (Emoji | PopularEmoji)[];
  showClickCount?: boolean;
  className?: string;
  columns?: "auto" | 4 | 5 | 6 | 8;
};

export const EmojiGrid = ({
  emojis,
  showClickCount = false,
  className,
  columns = "auto",
}: EmojiGridProps) => {
  const gridCols = {
    auto: "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    8: "grid-cols-8",
  };

  if (emojis.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        이모지가 없습니다.
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2 sm:gap-3", gridCols[columns], className)}>
      {emojis.map((emoji) => (
        <EmojiCard key={emoji.id} emoji={emoji} showClickCount={showClickCount} />
      ))}
    </div>
  );
};
