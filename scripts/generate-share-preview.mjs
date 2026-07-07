import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const rootDir = process.cwd();
const outputPath = path.join(rootDir, "public", "assets", "share-preview-card.png");
const handFontUrl = pathToFileURL(path.join(rootDir, "src", "assets", "nanum-namujeongweon-subset.woff2")).href;
const scriptFontUrl = pathToFileURL(path.join(rootDir, "public", "assets", "great-vibes.ttf")).href;

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

      @font-face {
        font-family: "Nanum NaMuJeongWeon";
        src: url("${handFontUrl}") format("woff2");
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
          radial-gradient(circle at 15% 14%, rgba(244, 184, 202, 0.46) 0 13%, transparent 33%),
          radial-gradient(circle at 86% 84%, rgba(151, 176, 145, 0.3) 0 13%, transparent 34%),
          linear-gradient(135deg, #fff7f1 0%, #fdebef 48%, #f7efe3 100%);
        color: #3f3635;
        font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
      }

      .stage {
        position: relative;
        width: 1200px;
        height: 600px;
      }

      .paper {
        position: absolute;
        inset: 46px 116px;
        overflow: hidden;
        border: 2px solid rgba(213, 170, 117, 0.58);
        border-radius: 3px;
        background:
          radial-gradient(ellipse at 50% 42%, rgba(255, 255, 255, 0.82) 0 27%, rgba(255, 248, 241, 0.64) 55%, transparent 74%),
          linear-gradient(180deg, rgba(255, 253, 249, 0.99), rgba(255, 244, 239, 0.97));
        box-shadow: 0 36px 96px rgba(126, 91, 76, 0.2);
      }

      .paper::before,
      .paper::after {
        position: absolute;
        width: 260px;
        height: 174px;
        border: 2px solid rgba(216, 180, 137, 0.32);
        content: "";
      }

      .paper::before {
        top: -92px;
        left: -96px;
        transform: rotate(-8deg);
      }

      .paper::after {
        right: -98px;
        bottom: -82px;
        transform: rotate(8deg);
      }

      .art {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
      }

      .ink {
        fill: none;
        stroke: #2f2929;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2.8;
      }

      .fine-ink {
        fill: none;
        stroke: rgba(47, 41, 41, 0.72);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.8;
      }

      .pink-line {
        fill: none;
        stroke: #d1769b;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 4.4;
      }

      .pink-fill {
        fill: rgba(229, 151, 176, 0.42);
        stroke: #2f2929;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
      }

      .leaf {
        fill: rgba(124, 151, 110, 0.76);
        stroke: #302929;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
      }

      .flower {
        fill: rgba(225, 146, 176, 0.82);
        stroke: #302929;
        stroke-width: 1.45;
      }

      .water {
        fill: rgba(121, 182, 206, 0.7);
        stroke: #302929;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2.2;
      }

      .content {
        position: absolute;
        inset: 0;
        z-index: 2;
        text-align: center;
      }

      .title-halo {
        position: absolute;
        top: 82px;
        right: 220px;
        left: 220px;
        height: 154px;
        border-radius: 50%;
        background: radial-gradient(ellipse at 50% 50%, rgba(255, 250, 244, 0.94) 0 42%, rgba(255, 248, 241, 0.64) 62%, transparent 76%);
      }

      .eyebrow {
        position: absolute;
        top: 88px;
        right: 0;
        left: 0;
        margin: 0;
        color: #9f8177;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 18px;
        letter-spacing: 0.17em;
        text-transform: uppercase;
      }

      .title {
        position: absolute;
        top: 111px;
        right: 0;
        left: 0;
        margin: 0;
        color: #d16f97;
        font-family: "Great Vibes Local", "Segoe Script", cursive;
        font-size: 106px;
        font-weight: 400;
        line-height: 0.92;
        text-shadow:
          0 2px 0 rgba(255, 255, 255, 0.76),
          0 12px 24px rgba(200, 111, 142, 0.15);
      }

      .names {
        position: absolute;
        top: 247px;
        right: 0;
        left: 0;
        margin: 0;
        color: #342d2d;
        font-family: "Nanum NaMuJeongWeon", "Noto Serif KR", serif;
        font-size: 76px;
        line-height: 1;
      }

      .divider {
        position: absolute;
        top: 330px;
        right: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        color: #c78b9f;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 20px;
        font-style: italic;
      }

      .divider::before,
      .divider::after {
        display: block;
        width: 120px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(196, 144, 125, 0.58), transparent);
        content: "";
      }

      .date {
        position: absolute;
        top: 366px;
        right: 0;
        left: 0;
        margin: 0;
        color: #584a4a;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 36px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .venue {
        position: absolute;
        top: 421px;
        right: 0;
        left: 0;
        margin: 0;
        color: #675858;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .petal {
        position: absolute;
        z-index: 2;
        color: rgba(216, 114, 149, 0.52);
        font-size: 23px;
        transform: rotate(var(--rotate));
      }
    </style>
  </head>
  <body>
    <div class="stage">
      <div class="paper">
        <svg class="art" viewBox="0 0 968 508" aria-hidden="true">
          <g transform="translate(484 54)">
            <path class="pink-line" d="M-96 0 C-60 -40 -22 -20 0 13 C22 -20 60 -40 96 0" />
            <path class="pink-line" d="M-96 3 C-58 42 -22 39 0 16 C22 39 58 42 96 3" />
            <path class="pink-fill" d="M-78 -3 C-49 -29 -19 -14 -4 15 C-33 32 -62 27 -78 -3Z" />
            <path class="pink-fill" d="M78 -3 C49 -29 19 -14 4 15 C33 32 62 27 78 -3Z" />
            <path class="ink" d="M-9 8 C-8 0 8 0 9 8 C9 19 -9 19 -9 8Z" />
            <path class="fine-ink" d="M-68 -4 C-48 -11 -28 -5 -12 12" />
            <path class="fine-ink" d="M68 -4 C48 -11 28 -5 12 12" />
          </g>

          <g transform="translate(116 204) scale(0.86)">
            <path class="ink" d="M54 94 H124" />
            <path class="ink" d="M62 113 H116" />
            <path class="ink" d="M75 115 V356" />
            <path class="ink" d="M104 115 V356" />
            <path class="ink" d="M84 121 C78 195 80 288 84 352" />
            <path class="ink" d="M96 121 C103 195 101 288 96 352" />
            <path class="ink" d="M58 356 H120" />
            <path class="ink" d="M49 379 H129" />
            <path class="ink" d="M60 399 H118" />
            <path class="leaf" d="M100 158 C72 204 121 238 84 285 C67 309 91 334 77 354" />
            <path class="leaf" d="M82 207 C68 204 62 189 74 181 C89 186 94 199 82 207Z" />
            <path class="leaf" d="M103 252 C121 251 129 266 116 278 C101 274 96 262 103 252Z" />
            <path class="leaf" d="M77 318 C60 314 56 299 68 291 C84 298 89 310 77 318Z" />
            <path class="ink" d="M38 50 C64 34 115 34 141 50 L130 86 H49Z" />
            <path class="ink" d="M51 71 H128" />
            <path class="leaf" d="M69 41 C64 15 86 6 99 29 C86 31 78 37 69 41Z" />
            <path class="leaf" d="M108 41 C111 15 135 16 136 39 C125 36 116 37 108 41Z" />
            <circle class="flower" cx="60" cy="29" r="6" />
            <circle class="flower" cx="90" cy="18" r="6" />
            <circle class="flower" cx="126" cy="30" r="6" />
            <circle class="flower" cx="107" cy="8" r="5" />
          </g>

          <g transform="translate(698 204) scale(0.86)">
            <path class="ink" d="M54 94 H124" />
            <path class="ink" d="M62 113 H116" />
            <path class="ink" d="M75 115 V356" />
            <path class="ink" d="M104 115 V356" />
            <path class="ink" d="M84 121 C78 195 80 288 84 352" />
            <path class="ink" d="M96 121 C103 195 101 288 96 352" />
            <path class="ink" d="M58 356 H120" />
            <path class="ink" d="M49 379 H129" />
            <path class="ink" d="M60 399 H118" />
            <path class="leaf" d="M80 158 C108 204 59 238 96 285 C113 309 89 334 103 354" />
            <path class="leaf" d="M98 207 C112 204 118 189 106 181 C91 186 86 199 98 207Z" />
            <path class="leaf" d="M77 252 C59 251 51 266 64 278 C79 274 84 262 77 252Z" />
            <path class="leaf" d="M103 318 C120 314 124 299 112 291 C96 298 91 310 103 318Z" />
            <path class="ink" d="M38 50 C64 34 115 34 141 50 L130 86 H49Z" />
            <path class="ink" d="M51 71 H128" />
            <path class="leaf" d="M69 41 C64 15 86 6 99 29 C86 31 78 37 69 41Z" />
            <path class="leaf" d="M108 41 C111 15 135 16 136 39 C125 36 116 37 108 41Z" />
            <circle class="flower" cx="60" cy="29" r="6" />
            <circle class="flower" cx="90" cy="18" r="6" />
            <circle class="flower" cx="126" cy="30" r="6" />
            <circle class="flower" cx="107" cy="8" r="5" />
          </g>

        </svg>

        <span class="petal" style="left: 286px; top: 201px; --rotate: -16deg;">♡</span>
        <span class="petal" style="right: 292px; top: 202px; --rotate: 12deg;">♥</span>
        <span class="petal" style="left: 300px; top: 332px; --rotate: 18deg;">♡</span>
        <span class="petal" style="right: 300px; top: 332px; --rotate: -13deg;">♡</span>

        <div class="content">
          <div class="title-halo" aria-hidden="true"></div>
          <p class="eyebrow">Mobile Wedding Invitation</p>
          <h1 class="title">Save the Date</h1>
          <p class="names">지성 &amp; 솔</p>
          <div class="divider">with love</div>
          <p class="date">2026. 10. 17 SAT 10:40 AM</p>
          <p class="venue">더링크호텔서울 2F 링크홀</p>
        </div>
      </div>
    </div>
  </body>
</html>`;

await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 600 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: outputPath, type: "png" });
await browser.close();

console.log(`Generated ${outputPath}`);
