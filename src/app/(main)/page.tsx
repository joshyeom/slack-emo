import { getAllEmojis } from "@/lib/api/emojis";

import { EmojiList } from "@/components/emoji";

export default async function HomePage() {
  const emojis = await getAllEmojis(200);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {emojis.length > 0 ? (
        <EmojiList emojis={emojis} />
      ) : (
        <div className="py-20 text-center">
          <div className="mb-4 text-6xl">:)</div>
          <p className="text-muted-foreground">No emojis yet</p>
        </div>
      )}
    </div>
  );
}
