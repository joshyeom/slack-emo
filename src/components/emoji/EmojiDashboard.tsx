"use client";

import { useMemo } from "react";

import Link from "next/link";

import { ChevronRight, Loader2 } from "lucide-react";

import { useSearchContext } from "@/components/search-provider";

import {
  useCategoryEmojis,
  useCategorySummaries,
  usePopularEmojis,
  useRecentEmojis,
} from "@/hooks/use-dashboard";

import type { Emoji, PopularEmoji } from "@/types/database";

import { EmojiGrid } from "./EmojiGrid";

const MAX_DASHBOARD_ITEMS = 12;

// Section wrapper with optional "더 보기" link
const Section = ({
  title,
  moreHref,
  children,
}: {
  title: string;
  moreHref?: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-center text-lg font-semibold">{title}</h2>
    {children}
    {moreHref && (
      <div className="flex justify-center">
        <Link
          href={moreHref}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        >
          더 보기 <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    )}
  </section>
);

// Category section with its own infinite query
const CategorySection = ({
  categoryId,
  name,
  slug,
}: {
  categoryId: string;
  name: string;
  slug: string;
}) => {
  const { data, hasNextPage } = useCategoryEmojis(categoryId);

  const allEmojis = data?.pages.flatMap((p) => p.emojis) ?? [];
  const emojis = allEmojis.slice(0, MAX_DASHBOARD_ITEMS);
  const showMore = allEmojis.length > MAX_DASHBOARD_ITEMS || hasNextPage;

  if (emojis.length === 0) return null;

  return (
    <Section title={name} moreHref={showMore ? `/category/${slug}` : undefined}>
      <EmojiGrid emojis={emojis} />
    </Section>
  );
};

// Search results view
const SearchResults = ({ emojis, query }: { emojis: (Emoji | PopularEmoji)[]; query: string }) => {
  const filtered = emojis.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));

  if (filtered.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">&quot;{query}&quot;에 대한 검색 결과가 없습니다</p>
      </div>
    );
  }

  return <EmojiGrid emojis={filtered} />;
};

export const EmojiDashboard = () => {
  const { deferredQuery } = useSearchContext();

  const popular = usePopularEmojis();
  const recent = useRecentEmojis();
  const { data: categories = [] } = useCategorySummaries();

  const popularEmojis = useMemo(
    () => popular.data?.pages.flatMap((p) => p.emojis) ?? [],
    [popular.data]
  );
  const recentEmojis = useMemo(
    () => recent.data?.pages.flatMap((p) => p.emojis) ?? [],
    [recent.data]
  );

  const popularSliced = popularEmojis.slice(0, MAX_DASHBOARD_ITEMS);
  const recentSliced = recentEmojis.slice(0, MAX_DASHBOARD_ITEMS);

  const showMorePopular = popularEmojis.length > MAX_DASHBOARD_ITEMS || popular.hasNextPage;
  const showMoreRecent = recentEmojis.length > MAX_DASHBOARD_ITEMS || recent.hasNextPage;

  const uniqueEmojis = useMemo(() => {
    const seen = new Set<string>();
    return [...popularEmojis, ...recentEmojis].filter((emoji) => {
      if (seen.has(emoji.id)) return false;
      seen.add(emoji.id);
      return true;
    });
  }, [popularEmojis, recentEmojis]);

  // Search mode: filter across all loaded emojis
  if (deferredQuery.trim()) {
    return <SearchResults emojis={uniqueEmojis} query={deferredQuery} />;
  }

  const isLoading = popular.isLoading || recent.isLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Popular */}
      {popularSliced.length > 0 && (
        <Section title="인기 이모지" moreHref={showMorePopular ? "/category/popular" : undefined}>
          <EmojiGrid emojis={popularSliced} />
        </Section>
      )}

      {/* Recent */}
      {recentSliced.length > 0 && (
        <Section title="최신 이모지" moreHref={showMoreRecent ? "/category/recent" : undefined}>
          <EmojiGrid emojis={recentSliced} />
        </Section>
      )}

      {/* Categories */}
      {categories.map((cat) => (
        <CategorySection key={cat.id} categoryId={cat.id} name={cat.name} slug={cat.slug} />
      ))}
    </div>
  );
};
