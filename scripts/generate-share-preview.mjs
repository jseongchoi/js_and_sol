import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const rootDir = process.cwd();
const outputPath = path.join(rootDir, "public", "assets", "share-preview-card.png");
const scriptFontUrl = pathToFileURL(path.join(rootDir, "public", "assets", "great-vibes.ttf")).href;
const heroPhotoBuffer = await readFile(path.join(rootDir, "public", "assets", "toourguest", "01.jpg"));
const heroPhotoUrl = `data:image/jpeg;base64,${heroPhotoBuffer.toString("base64")}`;

const html = String.raw`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: "Great Vibes Local";
        src: url("${scriptFontUrl}") format("truetype");
        font-weight: 400;
        font-style: normal;
        font-display: block;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 1200px;
        height: 600px;
        margin: 0;
        overflow: hidden;
      }

      body {
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at 18% 18%, rgba(181, 138, 181, 0.22) 0 16%, transparent 34%),
          linear-gradient(135deg, #ffffff 0%, #fbf7fb 52%, #f1e7f2 100%);
        color: #191b25;
        font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
      }

      .card {
        position: relative;
        display: grid;
        width: 1120px;
        height: 540px;
        grid-template-columns: 430px 1fr;
        gap: 62px;
        align-items: center;
        padding: 40px 72px;
        border: 1px solid rgba(181, 138, 181, 0.18);
        background: rgba(255, 255, 255, 0.86);
        box-shadow: 0 32px 96px rgba(68, 58, 72, 0.14);
      }

      .photo-wrap {
        position: relative;
        width: 390px;
        height: 476px;
        overflow: hidden;
        border-radius: 999px 999px 0 0 / 42% 42% 0 0;
        background: #f2f2f2;
      }

      .photo-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
      }

      .copy {
        display: grid;
        justify-items: start;
      }

      .eyebrow {
        margin: 0 0 18px;
        color: #8f8794;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 22px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        color: #191b25;
        font-family: "Great Vibes Local", "Segoe Script", cursive;
        font-size: 82px;
        font-weight: 400;
        line-height: 0.95;
      }

      h1 span {
        display: block;
      }

      .date {
        margin: 34px 0 0;
        color: #272832;
        font-size: 34px;
        font-weight: 500;
        letter-spacing: 0.01em;
      }

      .venue {
        margin: 14px 0 0;
        color: #68616a;
        font-size: 28px;
        font-weight: 600;
      }

      .names {
        margin: 46px 0 0;
        color: #b58ab5;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 28px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .petal {
        position: absolute;
        color: rgba(255, 135, 173, 0.46);
        font-size: 30px;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <span class="petal" style="left: 555px; top: 78px;">♡</span>
      <span class="petal" style="right: 82px; bottom: 82px;">♥</span>
      <div class="photo-wrap">
        <img src="${heroPhotoUrl}" alt="" />
      </div>
      <section class="copy">
        <p class="eyebrow">Mobile Wedding Invitation</p>
        <h1>
          <span>We are getting</span>
          <span>married !</span>
        </h1>
        <p class="date">2026. 10. 17. Saturday 10:40</p>
        <p class="venue">더링크호텔서울 2F 링크홀</p>
        <p class="names">Ji Seong · Sol</p>
      </section>
    </main>
  </body>
</html>`;

await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 600 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0));
await page.screenshot({ path: outputPath, type: "png" });
await browser.close();

console.log(`Generated ${outputPath}`);
