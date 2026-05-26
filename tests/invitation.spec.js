import { expect, test } from "@playwright/test";

test.describe("mobile wedding invitation", () => {
  test("opens from the envelope scene into the invitation", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    await expect(page.getByRole("dialog", { name: "청첩장 열기" })).toBeVisible();
    await expect(page.getByRole("button", { name: /초대장 열기/ })).toBeVisible();
    await expect(page.locator(".opening-envelope")).toBeVisible();

    await page.getByRole("button", { name: /초대장 열기/ }).click();

    await expect(page.getByRole("dialog", { name: "청첩장 열기" })).toBeHidden();
    await expect(page.locator(".hero-copy h1")).toContainText("지성");
    await expect(page.locator(".hero-copy h1")).toContainText("솔");
    await expect(page.getByText("2026.10.17").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("더링크 웨딩홀");
  });

  test("does not expose phone-number UI", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => sessionStorage.setItem("invitation-opened-v2", "true"));
    await page.reload();

    await expect(page.locator("body")).not.toContainText(/010|tel:|전화번호|전화하기/i);
  });
});
