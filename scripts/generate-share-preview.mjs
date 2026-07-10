import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const rootDir = process.cwd();
const outputPath = path.join(rootDir, "public", "assets", "share-preview-card.png");
const heroPhotoBuffer = await readFile(path.join(rootDir, "public", "assets", "toourguest", "01.jpg"));
const heroPhotoUrl = `data:image/jpeg;base64,${heroPhotoBuffer.toString("base64")}`;

const html = String.raw`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
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
        background: #f4f4f4;
      }

      .bg,
      .photo {
        position: absolute;
        inset: 0;
        width: 1200px;
        height: 600px;
      }

      .bg {
        object-fit: cover;
        object-position: center center;
        filter: blur(26px);
        opacity: 0.42;
        transform: scale(1.08);
      }

      .photo {
        object-fit: contain;
        object-position: center center;
      }
    </style>
  </head>
  <body>
    <img class="bg" src="${heroPhotoUrl}" alt="" />
    <img class="photo" src="${heroPhotoUrl}" alt="" />
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
