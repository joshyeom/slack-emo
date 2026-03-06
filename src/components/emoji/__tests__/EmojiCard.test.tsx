import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EmojiCard } from "../EmojiCard";

vi.mock("@/hooks", () => ({
  useEmojiDownload: () => ({
    handleDownload: vi.fn(),
  }),
}));

describe("EmojiCard", () => {
  const mockEmoji = {
    id: "1",
    slug: "test-emoji",
    name: "테스트 이모지",
    image_url: "https://example.com/emoji.png",
    image_path: "test-emoji.png",
    category_id: null,
    uploader_id: null,
    is_animated: false,
    is_approved: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders emoji image and slug", () => {
    render(<EmojiCard emoji={mockEmoji} />);

    expect(screen.getByRole("img", { name: "테스트 이모지" })).toBeInTheDocument();
    expect(screen.getByText(":test-emoji:")).toBeInTheDocument();
  });

  it("renders as a clickable button", () => {
    render(<EmojiCard emoji={mockEmoji} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("group", "relative");
  });

  it("renders animated emoji with unoptimized flag", () => {
    const animatedEmoji = { ...mockEmoji, is_animated: true };
    render(<EmojiCard emoji={animatedEmoji} />);

    const img = screen.getByRole("img", { name: "테스트 이모지" });
    expect(img).toBeInTheDocument();
  });
});
