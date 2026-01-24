"use client";

import { useState } from "react";
import useSWR from "swr";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { EmojiGrid } from "@/components/emoji";

import type { PopularEmoji, PopularPeriod } from "@/types/database";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PopularEmojisPage() {
  const [period, setPeriod] = useState<PopularPeriod>("all");

  const { data, isLoading } = useSWR<{ data: PopularEmoji[] }>(
    `/api/emojis/popular?period=${period}&limit=100`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const emojis = data?.data || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">인기 이모지 🔥</h1>
      <p className="text-muted-foreground mb-6">
        가장 많이 다운로드된 이모지를 확인하세요
      </p>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as PopularPeriod)} className="mb-6">
        <TabsList>
          <TabsTrigger value="week">주간</TabsTrigger>
          <TabsTrigger value="month">월간</TabsTrigger>
          <TabsTrigger value="all">전체</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : emojis.length > 0 ? (
        <EmojiGrid emojis={emojis} showClickCount />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          해당 기간에 다운로드된 이모지가 없습니다.
        </div>
      )}
    </div>
  );
}
