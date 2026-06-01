import { expect, test } from "@playwright/test";

test.describe("mobile wedding invitation", () => {
  test("shows the invitation immediately", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("dialog", { name: "청첩장 열기" })).toHaveCount(0);
    await expect(page.locator(".opening-envelope")).toHaveCount(0);
    await expect(page.locator(".topbar")).toHaveCount(0);
    await expect(page.locator(".hero-copy h1")).toContainText("지성");
    await expect(page.locator(".hero-copy h1")).toContainText("솔");
    await expect(page.getByText("2026.10.17").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("더링크 웨딩홀");
    await expect(page.locator("body")).toContainText("2F 링크홀");
    await expect(page.locator("body")).toContainText("최정재");
    await expect(page.locator("body")).toContainText("이돈형");
  });

  test("sets social sharing metadata", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("최지성 ♥ 이솔 결혼합니다.");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "최지성 ♥ 이솔 결혼합니다.");
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      "2026년 10월 17일 토요일 오전 10시 40분 · 더링크호텔서울 2F 링크홀"
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://jseongchoi.github.io/js_and_sol/assets/og-image.png"
    );
  });

  test("does not expose phone-number UI", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).not.toContainText(/010|tel:|전화번호|전화하기/i);
  });

  test("opens gallery image in a lightbox", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "사진" }).click();
    await page.getByRole("button", { name: "사진 크게 보기" }).click();

    const dialog = page.getByRole("dialog", { name: "사진 크게 보기" });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img.lightbox-photo")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("uses accessible account tabs", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("tab", { name: "신랑측에게" })).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tab", { name: "신부측에게" }).click();
    await expect(page.getByRole("tab", { name: "신부측에게" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("신부 이솔");
  });

  test("keeps removed sections out of the page", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).not.toContainText("캘린더에 추가");
    await expect(page.locator("body")).not.toContainText("예식 안내");
    await expect(page.locator("body")).not.toContainText("식사 안내");
    await expect(page.locator("body")).not.toContainText("도착 및 인사");
    await expect(page.locator("body")).not.toContainText("Together");
  });
});
