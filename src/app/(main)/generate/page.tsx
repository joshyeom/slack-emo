import type { Metadata } from "next";

import { TextEmojiGenerator } from "@/components/generate";

export const metadata: Metadata = {
  title: "텍스트 이모지 생성기",
  description:
    "텍스트를 입력하여 Slack 커스텀 이모지를 만들어보세요. PNG, 타이핑 애니메이션 GIF 지원.",
};

export default function GeneratePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">텍스트 이모지 생성기</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          텍스트를 입력하고 스타일을 커스텀하여 Slack 이모지를 만들어보세요
        </p>
      </div>
      <TextEmojiGenerator />
    </div>
  );
}
