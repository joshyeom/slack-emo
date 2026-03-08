import { CategoryEmojiView } from "@/components/emoji/CategoryEmojiView";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <CategoryEmojiView slug={slug} />
    </div>
  );
}
