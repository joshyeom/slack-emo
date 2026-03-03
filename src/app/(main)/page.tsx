import { getAllEmojis } from "@/lib/api/emojis";

import { EmojiEmptyState, EmojiList } from "@/components/emoji";

export default async function HomePage() {
  const emojis = await getAllEmojis(200);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {emojis.length > 0 ? <EmojiList emojis={emojis} /> : <EmojiEmptyState />}
    </div>
  );
}
