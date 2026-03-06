import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EmojiGrid } from "../EmojiGrid";

vi.mock("@/hooks", () => ({
  useEmojiDownload: () => ({
    handleDownload: vi.fn(),
  }),
}));

const createMockEmoji = (id: string, name: string, slug: string) => ({
  id,
  slug,
  name,
  image_url: `https://example.com/${slug}.png`,
  image_path: `${slug}.png`,
  category_id: null,
  uploader_id: null,
  is_animated: false,
  is_approved: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

describe("EmojiGrid", () => {
  const mockEmojis = [
    createMockEmoji("1", "이모지 1", "emoji-1"),
    createMockEmoji("2", "이모지 2", "emoji-2"),
  ];

  it("renders all emojis", () => {
    render(<EmojiGrid emojis={mockEmojis} />);

    expect(screen.getByText(":emoji-1:")).toBeInTheDocument();
    expect(screen.getByText(":emoji-2:")).toBeInTheDocument();
  });

  it("shows empty message when no emojis", () => {
    render(<EmojiGrid emojis={[]} />);

    expect(screen.getByText("No emojis found")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<EmojiGrid emojis={mockEmojis} className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies grid columns based on columns prop", () => {
    const { container } = render(<EmojiGrid emojis={mockEmojis} columns={6} />);

    expect(container.firstChild).toHaveClass("grid-cols-6");
  });

  it("uses auto grid columns by default", () => {
    const { container } = render(<EmojiGrid emojis={mockEmojis} />);

    expect(container.firstChild).toHaveClass("lg:grid-cols-4");
    expect(container.firstChild).toHaveClass("xl:grid-cols-5");
  });
});
