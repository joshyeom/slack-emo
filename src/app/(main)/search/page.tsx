import { Suspense } from "react";

import { SearchContent } from "./SearchContent";

export const metadata = {
  title: "검색 - KoreanMojis",
  description: "한국형 이모지를 검색하세요",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">이모지 검색</h1>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="bg-muted aspect-square animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
