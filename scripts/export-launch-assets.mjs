import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const puppeteer = require("../../seqvio/node_modules/puppeteer");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "assets", "launch");
const sourcePath = path.join(outputDir, "source.html");

await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: "networkidle0" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.complete ? null : new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    })));
  });

  const assets = [
    ["#thumbnail", "thumbnail.png"],
    ["#gallery-01", "gallery-01-agent-visual-language.png"],
    ["#gallery-02", "gallery-02-prompt-to-explanation.png"],
    ["#gallery-03", "gallery-03-visual-languages.png"],
    ["#gallery-04", "gallery-04-real-workflow.png"],
  ];

  for (const [selector, filename] of assets) {
    const element = await page.$(selector);
    if (!element) throw new Error(`Missing artboard: ${selector}`);
    await element.screenshot({ path: path.join(outputDir, filename) });
  }
} finally {
  await browser.close();
}

console.log(`Exported launch assets to ${outputDir}`);
