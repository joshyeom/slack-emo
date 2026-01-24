import { CategoryCard } from "@/components/emoji";
import { getCategoriesWithCount } from "@/lib/api/emojis";

export const metadata = {
  title: "카테고리 - KoreanMojis",
  description: "한국형 이모지를 카테고리별로 둘러보세요",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">카테고리</h1>
      <p className="text-muted-foreground mb-8">
        원하는 카테고리를 선택하여 이모지를 찾아보세요
      </p>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              emojiCount={category.emoji_count}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          카테고리가 없습니다.
        </div>
      )}
    </div>
  );
}
