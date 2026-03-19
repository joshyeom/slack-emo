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
    category?.description ??
    `${name} 슬랙 이모지 & 이모티콘 무료 다운로드. ${name} 카테고리의 커스텀 이모지를 Slack에 바로 추가하세요.`;

  return {
    title: `${name} 슬랙 이모지 무료 다운로드`,
    description,
    keywords: [
      `${name} 슬랙 이모지`,
      `${name} 이모티콘`,
      `슬랙 ${name} 이모지`,
      "슬랙 이모지 다운로드",
      "슬랙 커스텀 이모지",
    ],
    openGraph: {
      title: `${name} 슬랙 이모지 | Slack Emo`,
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
