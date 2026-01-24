import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui";
import { EmojiGrid } from "@/components/emoji";
import { getCategoryBySlug, getEmojisByCategory } from "@/lib/api/emojis";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "카테고리를 찾을 수 없습니다" };
  }

  return {
    title: `${category.name} - KoreanMojis`,
    description: category.description || `${category.name} 카테고리의 이모지`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const emojis = await getEmojisByCategory(slug, 100);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/categories">
          <ChevronLeft className="h-4 w-4 mr-1" />
          카테고리 목록
        </Link>
      </Button>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">{category.icon || "📁"}</span>
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      {category.description && (
        <p className="text-muted-foreground mb-8">{category.description}</p>
      )}

      {emojis.length > 0 ? (
        <EmojiGrid emojis={emojis} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          이 카테고리에는 아직 이모지가 없습니다.
        </div>
      )}
    </div>
  );
}
