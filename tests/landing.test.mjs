import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = path.join(root, "index.html");
const cssPath = path.join(root, "styles.css");
const analyticsPath = path.join(root, "analytics.js");
const launchSourcePath = path.join(root, "assets", "launch", "source.html");
const videoPath = path.join(root, "assets", "videos", "seqvio-product-hunt-en-bgm.mp4");

assert.ok(existsSync(pagePath), "index.html should exist");
assert.ok(existsSync(cssPath), "styles.css should exist");
assert.ok(existsSync(analyticsPath), "analytics.js should exist");
assert.ok(existsSync(launchSourcePath), "launch artboard source should exist");
assert.ok(existsSync(videoPath), "the Product Hunt demo MP4 should exist");
assert.ok(statSync(videoPath).size > 2_000_000, "the Product Hunt demo MP4 should not be empty");

const html = readFileSync(pagePath, "utf8");
const css = readFileSync(cssPath, "utf8");
const analytics = readFileSync(analyticsPath, "utf8");
const launchSource = readFileSync(launchSourcePath, "utf8");

[
  "Open source",
  "01 · Agent prompt",
  "02 · Visual explanation",
  "03 · Evidence-backed explanation",
  "From system evidence to an explanation people can follow.",
  "One contract for voice, visuals, and evidence.",
  "See Seqvio explain itself",
  "Teach your agent to explain",
].forEach((text) => assert.ok(html.includes(text), `index.html should include: ${text}`));

[
  "assets/brand/seqvio-icon.svg",
  "assets/images/hero-poster.jpg",
  "assets/images/agent-prompt.jpg",
  "assets/images/rag-explanation.jpg",
  "assets/images/visual-languages.jpg",
  "assets/images/real-workflow.jpg",
  "assets/videos/seqvio-product-hunt-en-bgm.mp4",
].forEach((asset) => {
  assert.ok(html.includes(asset), `index.html should reference ${asset}`);
  assert.ok(existsSync(path.join(root, asset)), `${asset} should exist`);
});

assert.ok(html.includes('property="og:title"'), "Open Graph title should be present");
assert.ok(html.includes('property="og:url" content="https://makesynt.github.io/seqvio-landing/"'), "Open Graph URL should use the deployed GitHub Pages URL");
assert.ok(html.includes('rel="canonical" href="https://makesynt.github.io/seqvio-landing/"'), "Canonical URL should use the deployed GitHub Pages URL");
assert.ok(html.includes('property="og:image" content="https://makesynt.github.io/seqvio-landing/assets/launch/'), "Open Graph image should use an absolute deployed URL");
assert.ok(html.includes('name="twitter:card"'), "Twitter card metadata should be present");
assert.ok(css.includes("@media"), "styles.css should include responsive rules");
assert.ok(css.includes("prefers-reduced-motion"), "styles.css should respect reduced motion");
assert.ok(css.includes("hero-stage"), "styles.css should include the immersive hero stage");
assert.ok(css.includes("hero-drift-output"), "hero product frames should have restrained motion");
assert.ok(html.includes('name="seqvio-analytics-endpoint"'), "analytics endpoint should be configurable");
assert.ok(html.includes('src="analytics.js"'), "analytics script should be loaded");
assert.ok(html.includes('data-goatcounter="https://makeseq.goatcounter.com/count"'), "GoatCounter site should be configured");
assert.ok(html.includes('src="https://gc.zgo.at/count.js"'), "GoatCounter client should be loaded");
assert.ok((html.match(/data-track=/g) || []).length >= 7, "primary CTA clicks should be tracked");
assert.ok(analytics.includes("navigator.sendBeacon"), "analytics should support reliable event delivery");
assert.ok(analytics.includes("seqvio_click_counts_v1"), "analytics should keep a local fallback count");
assert.ok(analytics.includes("window.goatcounter.count"), "custom events should be sent to GoatCounter");
assert.ok(!/TODO|TBD|lorem/i.test(html + css), "page should not contain placeholder text");
assert.ok(launchSource.includes("Turn real technical work into explainable video."), "launch artboards should use current positioning");
assert.ok(launchSource.includes("Voice, visuals, timing, and evidence stay together."), "launch artboards should describe the current explanation contract");
assert.ok(!launchSource.includes("Three visual languages"), "launch artboards should not restore retired positioning");

const localAssetReferences = [...html.matchAll(/(?:src|href|poster|content)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((ref) => /^(?:assets\/|styles\.css)/.test(ref));

for (const ref of localAssetReferences) {
  assert.ok(existsSync(path.join(root, ref)), `local reference should exist: ${ref}`);
}

for (const asset of [
  "assets/launch/thumbnail.png",
  "assets/launch/gallery-01-agent-visual-language.png",
  "assets/launch/gallery-02-prompt-to-explanation.png",
  "assets/launch/gallery-03-visual-languages.png",
  "assets/launch/gallery-04-real-workflow.png",
]) {
  assert.ok(existsSync(path.join(root, asset)), `Product Hunt asset should exist: ${asset}`);
}
