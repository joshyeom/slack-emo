import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EmojiCard } from "../EmojiCard";

describe("EmojiCard", () => {
  const mockEmoji = {
    id: "1",
    slug: "test-emoji",
    name: "테스트 이모지",
    image_url: "https://example.com/emoji.png",
    original_url: "https://example.com/emoji.png",
    category_id: "1",
    is_animated: false,
    is_approved: true,
    is_hidden: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockPopularEmoji = {
    ...mockEmoji,
    click_count: 1500,
    category_name: "리액션",
    category_slug: "reaction",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders emoji image and slug", () => {
    render(<EmojiCard emoji={mockEmoji} />);

    expect(screen.getByRole("img", { name: "테스트 이모지" })).toBeInTheDocument();
    expect(screen.getByText(":test-emoji:")).toBeInTheDocument();
  });

  it("shows click count when showClickCount is true", () => {
    render(<EmojiCard emoji={mockPopularEmoji} showClickCount />);

    expect(screen.getByText("1.5K")).toBeInTheDocument();
  });

  it("does not show click count when showClickCount is false", () => {
    render(<EmojiCard emoji={mockPopularEmoji} showClickCount={false} />);

    expect(screen.queryByText("1.5K")).not.toBeInTheDocument();
  });

  it("shows download overlay on hover", async () => {
    const user = userEvent.setup();
    render(<EmojiCard emoji={mockEmoji} />);

    const button = screen.getByRole("button");
    await user.hover(button);

    // The overlay becomes visible (opacity-100)
    const overlay = button.querySelector(".bg-black\\/50");
    expect(overlay).toHaveClass("opacity-100");
  });

  it("calls onDownload when provided", async () => {
    const onDownload = vi.fn().mockResolvedValue(undefined);
    render(<EmojiCard emoji={mockEmoji} onDownload={onDownload} />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(onDownload).toHaveBeenCalledWith(mockEmoji);
    });
  });

  it("renders animated emoji with unoptimized flag", () => {
    const animatedEmoji = { ...mockEmoji, is_animated: true };
    render(<EmojiCard emoji={animatedEmoji} />);

    const img = screen.getByRole("img", { name: "테스트 이모지" });
    expect(img).toBeInTheDocument();
  });

  it("formats million click counts correctly", () => {
    const millionEmoji = { ...mockPopularEmoji, click_count: 2500000 };
    render(<EmojiCard emoji={millionEmoji} showClickCount />);

    expect(screen.getByText("2.5M")).toBeInTheDocument();
  });

  it("formats regular click counts correctly", () => {
    const regularEmoji = { ...mockPopularEmoji, click_count: 500 };
    render(<EmojiCard emoji={regularEmoji} showClickCount />);

    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("shows correct button structure", () => {
    render(<EmojiCard emoji={mockEmoji} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("group", "relative");
  });
});
