"use client";

import { useEffect, useMemo, useRef } from "react";

import Link from "next/link";

import { ArrowLeft, Loader2 } from "lucide-react";

import {
  useCategoryEmojis,
  useCategorySummaries,
  usePopularEmojis,
  useRecentEmojis,
} from "@/hooks/use-dashboard";

import { EmojiGrid } from "./EmojiGrid";

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

const LoadingSpinner = () => (
  <div className="flex justify-center py-20">
    <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
  </div>
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

const PopularView = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePopularEmojis();
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  const emojis = useMemo(() => data?.pages.flatMap((p) => p.emojis) ?? [], [data]);

  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      <EmojiGrid emojis={emojis} />
      <LoadMoreIndicator isFetching={isFetchingNextPage} observerRef={observerRef} />
    </>
  );
};

const RecentView = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useRecentEmojis();
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  const emojis = useMemo(() => data?.pages.flatMap((p) => p.emojis) ?? [], [data]);

  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      <EmojiGrid emojis={emojis} />
      <LoadMoreIndicator isFetching={isFetchingNextPage} observerRef={observerRef} />
    </>
  );
};

const CategoryContentView = ({ categoryId }: { categoryId: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCategoryEmojis(categoryId);
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  const emojis = useMemo(() => data?.pages.flatMap((p) => p.emojis) ?? [], [data]);

  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      <EmojiGrid emojis={emojis} />
      <LoadMoreIndicator isFetching={isFetchingNextPage} observerRef={observerRef} />
    </>
  );
};

const CategoryView = ({ slug }: { slug: string }) => {
  const { data: categories = [] } = useCategorySummaries();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return <LoadingSpinner />;
  }

  return <CategoryContentView categoryId={category.id} />;
};

const SECTION_TITLES: Record<string, string> = {
  popular: "인기 이모지",
  recent: "최신 이모지",
};

export const CategoryEmojiView = ({ slug }: { slug: string }) => {
  const { data: categories = [] } = useCategorySummaries();

  const title = SECTION_TITLES[slug] ?? categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      {slug === "popular" && <PopularView />}
      {slug === "recent" && <RecentView />}
      {slug !== "popular" && slug !== "recent" && <CategoryView slug={slug} />}
    </div>
  );
};
