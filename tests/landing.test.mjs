import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const css = read("styles.css");
const site = read("site.js");
const analytics = read("analytics.js");

for (const content of [
  "Seqvio Studio", "想象，", "即将上演。", "Windows x64",
  'data-en="Vision"', 'data-en="Poised for its premiere."',
  "https://github.com/makesynt/seqvio-studio/releases/latest",
  "https://youtu.be/PKEJ8uIZQto",
  "docs/USAGE.zh-CN.md", "docs/USAGE.en.md",
  "docs/SHOWCASE-CREDITS.md", "seqvio-legacy.html",
]) {
  assert.ok(html.includes(content), "landing page should include " + content);
}
assert.equal((html.match(/class="sample-card"/g) || []).length, 6, "six real style samples should be available");
assert.equal((html.match(/class="sample-poster" src="assets\/style-covers\//g) || []).length, 6, "each sample should use a dedicated cover");
assert.ok(html.includes('class="style-dialog"') && html.includes('class="dialog-video" controls'), "full samples should open in a controllable player");
assert.equal((html.match(/class="sample-preview" muted loop playsinline preload="none"/g) || []).length, 6, "card previews should be muted and loaded on demand");
for (const match of html.matchAll(/data-video="([^"]+)"/g)) {
  assert.ok(existsSync(path.join(root, match[1])), "sample video should exist: " + match[1]);
}
assert.ok(html.includes('href="#main"'), "a skip link should lead to the content");
for (const id of ["main", "styles", "download"]) {
  assert.ok(html.includes('id="' + id + '"'), "navigation destination " + id + " should exist");
}
for (const asset of [
  "assets/brand/seqvio-studio-mark.svg",
  "assets/seqvio-hero-art-v2.png",
  "assets/studio-workbench.webp",
  "assets/style-samples/CREDITS.md",
  "assets/fonts/inter-latin-700-normal.woff2",
  "assets/launch/thumbnail.png",
  "assets/launch/gallery-01-agent-visual-language.png",
  "assets/launch/gallery-02-prompt-to-explanation.png",
  "assets/launch/gallery-03-visual-languages.png",
  "assets/launch/gallery-04-real-workflow.png",
]) {
  assert.ok(existsSync(path.join(root, asset)), asset + " should exist");
}
assert.ok(css.includes("assets/seqvio-hero-art-v2.png"), "the generated artwork should be used by the hero");
assert.ok(html.includes('rel="canonical" href="https://makesynt.github.io/seqvio-landing/"'));
assert.ok(html.includes('property="og:title"') && html.includes('name="twitter:card"'));
assert.ok(css.includes("@font-face") && css.includes("@media") && css.includes("prefers-reduced-motion"));
assert.ok(!css.includes("fonts.googleapis.com"), "fonts should be self-hosted");
assert.ok(site.includes("seqvio_studio_language") && html.includes('class="language-toggle"'));
assert.ok(html.includes('name="seqvio-analytics-endpoint"'));
assert.ok(html.includes('data-goatcounter="https://makeseq.goatcounter.com/count"'));
assert.ok(html.includes('src="analytics.js"') && (html.match(/data-track=/g) || []).length >= 7);
assert.ok(analytics.includes("navigator.sendBeacon") && analytics.includes("window.goatcounter.count"));
assert.ok(analytics.includes("seqvio_click_counts_v1"));
assert.ok(!/TODO|TBD|lorem/i.test(html + css), "page should not contain placeholder text");
for (const match of html.matchAll(/(?:src|href|poster)="(assets\/[^"]+)"/g)) {
  assert.ok(existsSync(path.join(root, match[1])), "local reference should exist: " + match[1]);
}
console.log("Seqvio Studio landing checks passed.");
