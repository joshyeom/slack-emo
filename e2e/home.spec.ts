import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display the homepage with hero section", async ({ page }) => {
    await page.goto("/");

    // Hero section should be visible
    await expect(page.getByRole("heading", { name: /KoreanMojis/i })).toBeVisible();

    // Navigation should be present
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("should navigate to categories page", async ({ page }) => {
    await page.goto("/");

    // Click on categories link
    await page
      .getByRole("link", { name: /카테고리/i })
      .first()
      .click();

    // Should be on categories page
    await expect(page).toHaveURL("/categories");
  });

  test("should navigate to popular emojis page", async ({ page }) => {
    await page.goto("/");

    // Click on popular link
    await page.getByRole("link", { name: /인기/i }).first().click();

    // Should be on popular page
    await expect(page).toHaveURL("/emojis/popular");
  });

  test("should search for emojis", async ({ page }) => {
    await page.goto("/");

    // Find search input and type
    const searchInput = page.getByPlaceholder(/검색/i);
    await searchInput.fill("테스트");
    await searchInput.press("Enter");

    // Should navigate to search page with query
    await expect(page).toHaveURL(/\/search\?q=테스트/);
  });
});

test.describe("Categories Page", () => {
  test("should display category list", async ({ page }) => {
    await page.goto("/categories");

    // Page title should be visible
    await expect(page.getByRole("heading", { name: /카테고리/i })).toBeVisible();
  });
});

test.describe("Popular Emojis Page", () => {
  test("should display period tabs", async ({ page }) => {
    await page.goto("/emojis/popular");

    // Period tabs should be visible
    await expect(page.getByRole("tab", { name: /이번 주/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /이번 달/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /전체/i })).toBeVisible();
  });

  test("should switch between period tabs", async ({ page }) => {
    await page.goto("/emojis/popular");

    // Click on month tab
    await page.getByRole("tab", { name: /이번 달/i }).click();

    // URL should update
    await expect(page).toHaveURL(/period=month/);
  });
});
