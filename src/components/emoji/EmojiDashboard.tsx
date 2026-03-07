"use client";

import { useEffect, useMemo, useRef } from "react";

import { Loader2 } from "lucide-react";

import { useSearchContext } from "@/components/search-provider";

import {
  useCategoryEmojis,
  useCategorySummaries,
  usePopularEmojis,
  useRecentEmojis,
} from "@/hooks/use-dashboard";

import type { Emoji, PopularEmoji } from "@/types/database";

import { EmojiGrid } from "./EmojiGrid";

// Infinite scroll observer hook
const useInfiniteScroll = (
  fetchNextPage: () => void,
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean
) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ hasNextPage, isFetchingNextPage });

  useEffect(() => {
    stateRef.current = { hasNextPage, isFetchingNextPage };
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          stateRef.current.hasNextPage &&
          !stateRef.current.isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage]);

  return observerRef;
};

// Section wrapper
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold">{title}</h2>
    {children}
  </section>
);

const LoadMoreIndicator = ({
  isFetching,
  observerRef,
}: {
  isFetching: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}) => (
  <div ref={observerRef} className="flex justify-center py-4">
    {isFetching && <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />}
  </div>
);

// Category section with its own infinite query
const CategorySection = ({ categoryId, name }: { categoryId: string; name: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCategoryEmojis(categoryId);

  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const emojis = data?.pages.flatMap((p) => p.emojis) || [];

  if (emojis.length === 0) return null;

  return (
    <Section title={name}>
      <EmojiGrid emojis={emojis} />
      <LoadMoreIndicator isFetching={isFetchingNextPage} observerRef={observerRef} />
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

  const popularObserver = useInfiniteScroll(
    popular.fetchNextPage,
    popular.hasNextPage,
    popular.isFetchingNextPage
  );
  const recentObserver = useInfiniteScroll(
    recent.fetchNextPage,
    recent.hasNextPage,
    recent.isFetchingNextPage
  );

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
      {popularEmojis.length > 0 && (
        <Section title="인기 이모지">
          <EmojiGrid emojis={popularEmojis} />
          <LoadMoreIndicator
            isFetching={popular.isFetchingNextPage}
            observerRef={popularObserver}
          />
        </Section>
      )}

      {/* Recent */}
      {recentEmojis.length > 0 && (
        <Section title="최신 이모지">
          <EmojiGrid emojis={recentEmojis} />
          <LoadMoreIndicator isFetching={recent.isFetchingNextPage} observerRef={recentObserver} />
        </Section>
      )}

      {/* Categories */}
      {categories.map((cat) => (
        <CategorySection key={cat.id} categoryId={cat.id} name={cat.name} />
      ))}
    </div>
  );
};
