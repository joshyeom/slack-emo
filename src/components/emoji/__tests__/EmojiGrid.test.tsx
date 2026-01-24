import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmojiGrid } from "../EmojiGrid";

describe("EmojiGrid", () => {
  const mockEmojis = [
    {
      id: "1",
      slug: "emoji-1",
      name: "이모지 1",
      image_url: "https://example.com/1.png",
      original_url: "https://example.com/1.png",
      category_id: "1",
      is_animated: false,
      is_approved: true,
      is_hidden: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      slug: "emoji-2",
      name: "이모지 2",
      image_url: "https://example.com/2.png",
      original_url: "https://example.com/2.png",
      category_id: "1",
      is_animated: true,
      is_approved: true,
      is_hidden: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  it("renders all emojis", () => {
    render(<EmojiGrid emojis={mockEmojis} />);

    expect(screen.getByText(":emoji-1:")).toBeInTheDocument();
    expect(screen.getByText(":emoji-2:")).toBeInTheDocument();
  });

  it("shows empty message when no emojis", () => {
    render(<EmojiGrid emojis={[]} />);

    expect(screen.getByText("이모지가 없습니다.")).toBeInTheDocument();
  });

  it("passes showClickCount to EmojiCard", () => {
    const popularEmojis = mockEmojis.map((e) => ({ ...e, click_count: 100 }));
    render(<EmojiGrid emojis={popularEmojis} showClickCount />);

    // Click count should be visible (100 displayed as is)
    expect(screen.getAllByText("100")).toHaveLength(2);
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

    expect(container.firstChild).toHaveClass("grid-cols-4");
    expect(container.firstChild).toHaveClass("sm:grid-cols-5");
  });
});
