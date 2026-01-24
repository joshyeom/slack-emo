import Link from "next/link";

import { cn } from "@/lib/utils";

import type { Category } from "@/types/database";

type CategoryCardProps = {
  category: Category;
  emojiCount?: number;
  className?: string;
};

export const CategoryCard = ({ category, emojiCount, className }: CategoryCardProps) => {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card p-4 transition-all",
        "hover:border-primary hover:shadow-md",
        className
      )}
    >
      <span className="text-2xl">{category.icon || "📁"}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{category.name}</h3>
        {category.description && (
          <p className="text-sm text-muted-foreground truncate">{category.description}</p>
        )}
      </div>
      {emojiCount !== undefined && (
        <span className="text-sm text-muted-foreground">{emojiCount}개</span>
      )}
    </Link>
  );
};
