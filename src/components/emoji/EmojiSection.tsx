import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";

import { EmojiGrid } from "./EmojiGrid";

import type { Emoji, PopularEmoji } from "@/types/database";

type EmojiSectionProps = {
  title: string;
  icon?: string;
  emojis: (Emoji | PopularEmoji)[];
  showClickCount?: boolean;
  moreLink?: string;
  moreLinkText?: string;
};

export const EmojiSection = ({
  title,
  icon,
  emojis,
  showClickCount = false,
  moreLink,
  moreLinkText = "더보기",
}: EmojiSectionProps) => {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {moreLink && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={moreLink} className="flex items-center gap-1">
              {moreLinkText}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      <EmojiGrid emojis={emojis} showClickCount={showClickCount} />
    </section>
  );
};
