import { expect, test } from "@playwright/test";

test("searches and filters hospitals", async ({ page }) => {
  await page.goto("/hospitals");
  await page.getByLabel("Search directory").fill("Cedarcrest");
  await expect(page.getByRole("heading", { name: "Cedarcrest Hospitals" })).toBeVisible();
  await expect(page.getByText("1 facilities found")).toBeVisible();
});

test("opens a hospital detail and directions", async ({ page }) => {
  await page.goto("/hospitals");
  await page.getByRole("link", { name: /view details/i }).first().click();
  await expect(page.getByRole("heading", { name: "Lagos University Teaching Hospital" })).toBeVisible();
  await expect(page.getByRole("link", { name: /get directions/i })).toHaveAttribute(
    "href",
    /google\.com\/maps/,
  );
});

test("preserves filters in a shareable URL", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/hospitals");
  await page.getByLabel("Filter by state").selectOption("Lagos");
  await expect(page).toHaveURL(/state=Lagos/);
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page.getByRole("button", { name: "Link copied" })).toBeVisible();
});

test("configures a CSV export", async ({ page }) => {
  await page.goto("/hospitals?query=Lagos");
  await page.getByRole("button", { name: "Export CSV" }).click();
  await expect(page.getByRole("heading", { name: "Choose CSV columns" })).toBeVisible();
  await page.getByLabel("Email").uncheck();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^hospitals-lagos-\d{4}-\d{2}-\d{2}\.csv$/);
});

test("protects the admin dashboard behind Supabase login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText("Protected dashboard")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(page.getByText(/authenticated through Supabase/i)).toBeVisible();
});

test("switches between light and dark themes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
