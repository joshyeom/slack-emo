"use client";

import { useSearchParams } from "next/navigation";

import { Search } from "lucide-react";
import useSWR from "swr";

import { EmojiGrid } from "@/components/emoji";
import { Input } from "@/components/ui";

import type { Emoji } from "@/types/database";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useSWR<{ data: Emoji[] }>(
    query ? `/api/search?q=${encodeURIComponent(query)}&limit=100` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const emojis = data?.data || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">이모지 검색</h1>

      {/* Mobile Search Form */}
      <form action="/search" className="mb-8 md:hidden">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            name="q"
            placeholder="이모지 검색..."
            defaultValue={query}
            className="pl-10"
          />
        </div>
      </form>

      {query ? (
        <>
          <p className="text-muted-foreground mb-6">
            &quot;{query}&quot; 검색 결과 {emojis.length}개
          </p>

          {isLoading ? (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="bg-muted aspect-square animate-pulse rounded-lg" />
              ))}
            </div>
          ) : emojis.length > 0 ? (
            <EmojiGrid emojis={emojis} />
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-4xl">🔍</div>
              <p className="text-muted-foreground">
                검색 결과가 없습니다. 다른 키워드로 검색해 보세요.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <p className="text-muted-foreground">검색어를 입력해 주세요</p>
        </div>
      )}
    </div>
  );
};
