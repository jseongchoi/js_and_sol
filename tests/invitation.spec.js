import { expect, test } from "@playwright/test";

test.describe("mobile wedding invitation", () => {
  test("shows the invitation immediately", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("dialog", { name: "청첩장 열기" })).toHaveCount(0);
    await expect(page.locator(".opening-envelope")).toHaveCount(0);
    await expect(page.locator(".topbar")).toHaveCount(0);
    await expect(page.locator(".hero-photo")).toBeVisible();
    await expect(page.locator(".hero-kicker")).toHaveAttribute("aria-label", "We are getting married !");
    await expect(page.getByText("2026. 10. 17. Saturday 10:40")).toBeVisible();
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
      "https://jseongchoi.github.io/js_and_sol/assets/share-preview-card.png"
    );
    await expect(page.locator('link[rel="image_src"]')).toHaveAttribute(
      "href",
      "https://jseongchoi.github.io/js_and_sol/assets/share-preview-card.png"
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      "https://jseongchoi.github.io/js_and_sol/assets/share-preview-card.png"
    );
  });

  test("keeps the handwritten accent font scoped to large titles", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".hero-kicker")).toHaveCSS("font-family", /Great Vibes/);
    await expect(page.locator(".date-mark span")).not.toHaveCSS("font-family", /Nanum NaMuJeongWeon/);
    await expect(page.locator(".section-head h2").first()).not.toHaveCSS("font-family", /Nanum NaMuJeongWeon/);
    await expect(page.locator(".info-card strong").first()).not.toHaveCSS("font-family", /Nanum NaMuJeongWeon/);
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
    await expect(dialog.locator(".lightbox-count")).toHaveText("1 / 22");
    await dialog.locator(".lightbox-next").click();
    await expect(dialog.locator(".lightbox-count")).toHaveText("2 / 22");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.locator(".lightbox-count")).toHaveText("1 / 22");

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("uses accessible account tabs", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("tab", { name: "신랑측에게" })).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tab", { name: "신부측에게" }).click();
    await expect(page.getByRole("tab", { name: "신부측에게" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("신부 이솔");
    await expect(page.getByRole("tabpanel")).toContainText("혼주 이돈형");
    await expect(page.getByRole("tabpanel")).toContainText("혼주 임혜경");
    await expect(page.getByRole("tabpanel").getByText("신부 이솔")).toBeVisible();
    await page.getByRole("tab", { name: "신랑측에게" }).click();
    await expect(page.getByRole("tabpanel").getByText("신랑 최지성")).toBeVisible();
    await expect(page.getByRole("tabpanel").getByText("혼주 신순채")).toBeVisible();
  });

  test("uses the updated family, information, and gift wording", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).toContainText("🌼 최정재");
    await expect(page.locator("body")).not.toContainText("故 최정재");
    await expect(page.locator("body")).toContainText("하객 주차는 1시간 30분 이용 가능합니다.");
    await expect(page.locator("body")).not.toContainText("화환 안내");
    await expect(page.locator("body")).toContainText("부득이하게 참석이 어려우신 분들을 위해 마음 전하실 곳을 남겨두었습니다.");
  });

  test("uses Naver map as the default map surface", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "지도", exact: true }).click();
    await expect(page.getByText("NAVER MAP")).toBeVisible();
    await expect(page.getByRole("link", { name: "네이버 지도에서 더링크호텔서울 보기" })).toHaveAttribute(
      "href",
      /map\.naver\.com/
    );
    await expect(page.locator(".map-card iframe")).toHaveCount(0);
  });

  test("shows an inline RSVP form", async ({ page }) => {
    await page.goto("/");

    const rsvp = page.locator("#rsvp");
    await rsvp.scrollIntoViewIfNeeded();
    await expect(rsvp.locator(".section-head p")).toHaveText("Attendance");
    await expect(rsvp.getByRole("heading", { name: "참석 의사를 남겨주세요" })).toBeVisible();
    await expect(rsvp.locator(".section-head span")).toContainText("격식은 가볍게, 마음은 깊게.");
    await expect(rsvp.getByLabel("이름")).toBeVisible();
    await expect(rsvp.getByRole("button", { name: "참석" })).toHaveClass(/is-active/);
    await rsvp.getByRole("button", { name: "불참" }).click();
    await expect(rsvp.getByRole("button", { name: "불참" })).toHaveClass(/is-active/);
    await expect(page.locator('a[href*="forms.gle"]')).toHaveCount(0);
  });

  test("shows the guestbook form even before Supabase is configured locally", async ({ page }) => {
    await page.goto("/");

    const guestbook = page.locator(".guestbook-section");
    await guestbook.scrollIntoViewIfNeeded();
    await expect(guestbook.getByRole("heading", { name: "축하 메시지" })).toBeVisible();
    await expect(guestbook.getByLabel("이름")).toBeVisible();
    await expect(guestbook.getByLabel("암호")).toBeVisible();
    await expect(guestbook.getByLabel("댓글 작성")).toBeVisible();
    await expect(guestbook.getByRole("button", { name: "댓글 남기기" })).toBeVisible();

    const guestbookHeading = guestbook.getByRole("heading", { name: "축하 메시지" });
    const rsvpHeading = page.getByRole("heading", { name: "참석 의사를 남겨주세요" });
    const locationTitle = page.locator(".transport-section .section-head p", { hasText: "Location" });
    await expect(rsvpHeading).toBeVisible();
    await expect(locationTitle).toBeVisible();
    await expect(
      page.evaluate(
        ([guestbookElement, rsvpElement, locationElement]) =>
          Boolean(
            guestbookElement.compareDocumentPosition(rsvpElement) & Node.DOCUMENT_POSITION_FOLLOWING &&
              rsvpElement.compareDocumentPosition(locationElement) & Node.DOCUMENT_POSITION_FOLLOWING
          ),
        [await guestbookHeading.elementHandle(), await rsvpHeading.elementHandle(), await locationTitle.elementHandle()]
      )
    ).resolves.toBe(true);
  });

  test("keeps information and gift sections near the bottom", async ({ page }) => {
    await page.goto("/");

    const rsvpHeading = page.getByRole("heading", { name: "참석 의사를 남겨주세요" });
    const infoHeading = page.getByRole("heading", { name: "안내사항" });
    const giftHeading = page.getByRole("heading", { name: "마음 전하실 곳" });

    await expect(page.getByRole("link", { name: "INFO" })).toHaveAttribute("href", "#information");
    await expect(infoHeading).toBeVisible();
    await expect(giftHeading).toBeVisible();
    await expect(
      page.evaluate(
        ([rsvp, info, gift]) =>
          Boolean(
            rsvp.compareDocumentPosition(info) & Node.DOCUMENT_POSITION_FOLLOWING &&
              info.compareDocumentPosition(gift) & Node.DOCUMENT_POSITION_FOLLOWING
          ),
        [await rsvpHeading.elementHandle(), await infoHeading.elementHandle(), await giftHeading.elementHandle()]
      )
    ).resolves.toBe(true);
  });

  test("keeps removed sections out of the page", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).not.toContainText("캘린더에 추가");
    await expect(page.locator("body")).not.toContainText("예식 안내");
    await expect(page.locator("body")).not.toContainText("식사 안내");
    await expect(page.locator("body")).not.toContainText("도착 및 인사");
    await expect(page.locator("body")).not.toContainText("화환 안내");
    await expect(page.locator("body")).not.toContainText("Together");
  });
});
