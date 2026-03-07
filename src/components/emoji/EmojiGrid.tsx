import { cn } from "@/lib/utils";

import type { Emoji, PopularEmoji } from "@/types/database";

import { EmojiCard } from "./EmojiCard";

type EmojiGridProps = {
  emojis: (Emoji | PopularEmoji)[];
  className?: string;
  columns?: "auto" | 4 | 5 | 6 | 8;
};

export const EmojiGrid = ({ emojis, className, columns = "auto" }: EmojiGridProps) => {
  const gridCols = {
    auto: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    8: "grid-cols-8",
  };

  if (emojis.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-12">
        No emojis found
      </div>
    );
  }

  const colCount = columns === "auto" ? 5 : columns;

  return (
    <div className={cn("grid gap-2", gridCols[columns], className)}>
      {emojis.map((emoji, index) => (
        <EmojiCard
          key={emoji.id}
          emoji={emoji}
          tooltipDirection={index < colCount ? "bottom" : "top"}
        />
      ))}
    </div>
  );
};
