import Link from "next/link";
import { ChevronRight, Sparkles, TrendingUp, Clock } from "lucide-react";

import { Button } from "@/components/ui";
import { EmojiSection, CategoryCard } from "@/components/emoji";
import { getPopularEmojis, getRecentEmojis, getCategoriesWithCount } from "@/lib/api/emojis";

export default async function HomePage() {
  const [popularEmojis, recentEmojis, categories] = await Promise.all([
    getPopularEmojis("all", 16),
    getRecentEmojis(16),
    getCategoriesWithCount(),
  ]);

  return (
    <div className="container mx-auto max-w-6xl px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="mr-2">&#x1F1F0;&#x1F1F7;</span>
          한국형 커스텀 이모지
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Slack, Discord에서 사용할 수 있는 한국 문화 맞춤 이모지를 발견하고 다운로드하세요.
          클릭 한 번으로 바로 사용 가능!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/emojis/popular">
              <TrendingUp className="mr-2 h-5 w-5" />
              인기 이모지 보기
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/categories">
              <Sparkles className="mr-2 h-5 w-5" />
              카테고리 둘러보기
            </Link>
          </Button>
        </div>
      </section>

      {/* Popular Emojis */}
      {popularEmojis.length > 0 && (
        <EmojiSection
          title="인기 이모지"
          icon="🔥"
          emojis={popularEmojis}
          showClickCount
          moreLink="/emojis/popular"
          moreLinkText="전체보기"
        />
      )}

      {/* Recent Emojis */}
      {recentEmojis.length > 0 && (
        <EmojiSection
          title="최신 이모지"
          icon="✨"
          emojis={recentEmojis}
          moreLink="/emojis/recent"
          moreLinkText="전체보기"
        />
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>📁</span>
              카테고리
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/categories" className="flex items-center gap-1">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                emojiCount={category.emoji_count}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {popularEmojis.length === 0 && recentEmojis.length === 0 && (
        <section className="py-20 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold mb-2">아직 이모지가 없어요</h2>
          <p className="text-muted-foreground mb-6">
            첫 번째 이모지를 업로드해 보세요!
          </p>
          <Button asChild>
            <Link href="/upload">이모지 업로드하기</Link>
          </Button>
        </section>
      )}

      {/* How to Use */}
      <section className="py-12 mb-8">
        <h2 className="text-xl font-bold mb-6 text-center">사용 방법</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="text-4xl mb-3">1️⃣</div>
            <h3 className="font-semibold mb-2">이모지 선택</h3>
            <p className="text-sm text-muted-foreground">
              원하는 이모지를 찾아 클릭하세요
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="text-4xl mb-3">2️⃣</div>
            <h3 className="font-semibold mb-2">자동 다운로드</h3>
            <p className="text-sm text-muted-foreground">
              클릭하면 PNG/GIF 파일이 다운로드됩니다
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="text-4xl mb-3">3️⃣</div>
            <h3 className="font-semibold mb-2">Slack/Discord에 업로드</h3>
            <p className="text-sm text-muted-foreground">
              다운받은 파일을 워크스페이스에 추가하세요
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
