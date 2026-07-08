import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = path.join(root, "index.html");
const cssPath = path.join(root, "styles.css");
const videoPath = path.join(root, "assets", "videos", "seqvio-overview-en.mp4");
const gifPath = path.join(root, "assets", "videos", "seqvio-overview-en.preview.gif");

assert.ok(existsSync(pagePath), "index.html should exist");
assert.ok(existsSync(cssPath), "styles.css should exist");
assert.ok(existsSync(videoPath), "demo MP4 should be copied into assets/videos");
assert.ok(statSync(videoPath).size > 500_000, "demo MP4 should not be empty");
assert.ok(existsSync(gifPath), "demo GIF should be copied into assets/videos");
assert.ok(statSync(gifPath).size > 50_000, "demo GIF should not be empty");

const html = readFileSync(pagePath, "utf8");
const css = readFileSync(cssPath, "utf8");

[
  "Seqvio",
  "Whiteboard explainer videos from React/TSX",
  "From structured scenes to rendered MP4",
  "A narrower layer above React can render video",
  "Try it",
  "View on GitHub",
].forEach((text) => {
  assert.ok(html.includes(text), `index.html should include: ${text}`);
});

[
  "assets/videos/seqvio-overview-en.mp4",
  "assets/videos/seqvio-overview-en.preview.gif",
].forEach((asset) => {
  assert.ok(html.includes(asset), `index.html should reference ${asset}`);
  assert.ok(existsSync(path.join(root, asset)), `${asset} should exist`);
});

assert.ok(css.includes("@media"), "styles.css should include responsive rules");
assert.ok(!/TODO|TBD|lorem/i.test(html + css), "page should not contain placeholder text");

const localAssetReferences = [...html.matchAll(/(?:src|href|poster)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((ref) => !ref.startsWith("http") && !ref.startsWith("#") && !ref.startsWith("mailto:"));

for (const ref of localAssetReferences) {
  if (ref === "styles.css") continue;
  assert.ok(existsSync(path.join(root, ref)), `local reference should exist: ${ref}`);
}
