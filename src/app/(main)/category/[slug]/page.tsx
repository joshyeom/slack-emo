import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

import { CategoryEmojiView } from "@/components/emoji/CategoryEmojiView";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  const name = category?.name ?? slug;
  const description =
    category?.description ?? `${name} 카테고리의 Slack 커스텀 이모지를 다운로드하세요.`;

  return {
    title: `${name} 이모지`,
    description,
    openGraph: {
      title: `${name} 이모지 | Slack Emo`,
      description,
      url: `https://slack-emo.vercel.app/category/${slug}`,
    },
    alternates: {
      canonical: `https://slack-emo.vercel.app/category/${slug}`,
    },
  };
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <CategoryEmojiView slug={slug} />
    </div>
  );
}
