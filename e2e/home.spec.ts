import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display the header with logo and search", async ({ page }) => {
    await page.goto("/");

    // Logo should be visible in header
    await expect(page.getByRole("banner").getByRole("link", { name: /slack-emo/i })).toBeVisible();

    // Search input should be visible (desktop)
    await expect(page.getByPlaceholder("Search emojis...")).toBeVisible();
  });

  test("should display emoji grid or empty state", async ({ page }) => {
    await page.goto("/");

    // Either emoji grid or empty state should be visible
    const emojiGrid = page.locator("button").filter({ has: page.locator("img") });
    const emptyState = page.getByText(/No emojis/i);

    const hasEmojis = await emojiGrid
      .first()
      .isVisible()
      .catch(() => false);
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    expect(hasEmojis || hasEmptyState).toBe(true);
  });

  test("should display login button when not authenticated", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: /로그인/i })).toBeVisible();
  });

  test("should display theme toggle button", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: /Toggle theme/i })).toBeVisible();
  });

  test("should filter emojis when searching", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("Search emojis...");
    await searchInput.fill("test-query-that-matches-nothing-xyz");

    // Should show no results message
    await expect(page.getByText(/No emojis found/i)).toBeVisible({ timeout: 10000 });
  });

  test("should display footer", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/slack-emo/).last()).toBeVisible();
    await expect(page.getByText(/2026/)).toBeVisible();
  });

  test("should navigate to home when clicking logo", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("banner")
      .getByRole("link", { name: /slack-emo/i })
      .click();

    await expect(page).toHaveURL("/");
  });
});
