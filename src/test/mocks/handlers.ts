import { HttpResponse, http } from "msw";

// Mock emoji data
export const mockEmojis = [
  {
    id: "1",
    slug: "test-emoji",
    name: "테스트 이모지",
    image_url: "https://example.com/emoji1.png",
    original_url: "https://example.com/emoji1.png",
    category_id: "1",
    is_animated: false,
    is_approved: true,
    is_hidden: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "1", name: "리액션", slug: "reaction" },
  },
  {
    id: "2",
    slug: "animated-emoji",
    name: "움직이는 이모지",
    image_url: "https://example.com/emoji2.gif",
    original_url: "https://example.com/emoji2.gif",
    category_id: "2",
    is_animated: true,
    is_approved: true,
    is_hidden: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "2", name: "회사생활", slug: "work" },
  },
];

export const mockCategories = [
  { id: "1", name: "리액션", slug: "reaction", description: "반응 이모지", emoji_count: 10 },
  { id: "2", name: "회사생활", slug: "work", description: "직장 관련 이모지", emoji_count: 15 },
  { id: "3", name: "한국밈", slug: "korean-meme", description: "한국 인터넷 밈", emoji_count: 20 },
];

export const handlers = [
  // GET /api/emojis/popular
  http.get("/api/emojis/popular", ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "week";
    const limit = parseInt(url.searchParams.get("limit") || "20");

    return HttpResponse.json({
      emojis: mockEmojis.slice(0, limit).map((emoji, index) => ({
        ...emoji,
        click_count: 100 - index * 10,
      })),
      period,
    });
  }),

  // GET /api/search
  http.get("/api/search", ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    const filtered = mockEmojis.filter(
      (emoji) => emoji.name.includes(query) || emoji.slug.includes(query)
    );

    return HttpResponse.json({ emojis: filtered, query });
  }),

  // POST /api/emojis/:slug/click
  http.post("/api/emojis/:slug/click", () => {
    return HttpResponse.json({ success: true });
  }),
];
