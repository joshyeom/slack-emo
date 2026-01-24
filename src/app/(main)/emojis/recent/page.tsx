import { EmojiGrid } from "@/components/emoji";
import { getRecentEmojis } from "@/lib/api/emojis";

export const metadata = {
  title: "최신 이모지 - KoreanMojis",
  description: "최근에 추가된 한국형 이모지를 확인하세요",
};

export default async function RecentEmojisPage() {
  const emojis = await getRecentEmojis(100);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">최신 이모지 ✨</h1>
      <p className="text-muted-foreground mb-8">
        최근에 추가된 이모지를 확인하세요
      </p>

      {emojis.length > 0 ? (
        <EmojiGrid emojis={emojis} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          아직 이모지가 없습니다.
        </div>
      )}
    </div>
  );
}
