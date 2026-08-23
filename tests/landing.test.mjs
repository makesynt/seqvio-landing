import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = path.join(root, "index.html");
const cssPath = path.join(root, "styles.css");
const analyticsPath = path.join(root, "analytics.js");
const launchSourcePath = path.join(root, "assets", "launch", "source.html");
const interFontPath = path.join(
  root,
  "assets",
  "fonts",
  "inter-latin-700-normal.woff2",
);

assert.ok(existsSync(pagePath), "index.html should exist");
assert.ok(existsSync(cssPath), "styles.css should exist");
assert.ok(existsSync(analyticsPath), "analytics.js should exist");
assert.ok(existsSync(launchSourcePath), "launch artboard source should exist");
assert.ok(existsSync(interFontPath), "the landing page should self-host Inter");

const html = readFileSync(pagePath, "utf8");
const css = readFileSync(cssPath, "utf8");
const analytics = readFileSync(analyticsPath, "utf8");
const launchSource = readFileSync(launchSourcePath, "utf8");

[
  "Open source",
  "An explainer video toolkit for agents",
  "From real agent work to an explanation",
  "Capture real evidence",
  "Review the story",
  "Align voice and visuals",
  "Validate and render",
  "The voice sets the clock",
  "One system, many explanations",
  "PR video review",
  "Tool comparison",
  "Tutorial verification",
  "Concept explanation",
  "Product review",
  "Skill evaluation",
  "Agent work, explained with Seqvio",
].forEach((text) =>
  assert.ok(html.includes(text), `index.html should include: ${text}`),
);

[
  "assets/brand/seqvio-icon.svg",
  "assets/images/hero-poster.jpg",
].forEach((asset) => {
  assert.ok(html.includes(asset), `index.html should reference ${asset}`);
  assert.ok(existsSync(path.join(root, asset)), `${asset} should exist`);
});

assert.ok(
  html.includes("https://www.youtube-nocookie.com/embed/VX6tKv2mwwk"),
  "index.html should embed the current YouTube demo",
);

assert.ok(
  html.includes('property="og:title"'),
  "Open Graph title should be present",
);
assert.ok(
  /property="og:url"\s+content="https:\/\/makesynt\.github\.io\/seqvio-landing\/"/.test(
    html,
  ),
  "Open Graph URL should use the deployed GitHub Pages URL",
);
assert.ok(
  html.includes(
    'rel="canonical" href="https://makesynt.github.io/seqvio-landing/"',
  ),
  "Canonical URL should use the deployed GitHub Pages URL",
);
assert.ok(
  /content="https:\/\/makesynt\.github\.io\/seqvio-landing\/assets\/images\/hero-poster\.jpg"/.test(
    html,
  ),
  "Open Graph image should use the current absolute hero poster URL",
);
assert.ok(
  html.includes('name="twitter:card"'),
  "Twitter card metadata should be present",
);
assert.ok(css.includes("@media"), "styles.css should include responsive rules");
assert.ok(
  css.includes("@font-face"),
  "styles.css should self-host its primary font",
);
assert.ok(
  !css.includes("fonts.googleapis.com"),
  "styles.css should not depend on Google Fonts",
);
assert.ok(
  css.includes("prefers-reduced-motion"),
  "styles.css should respect reduced motion",
);
assert.ok(
  css.includes("hero-video"),
  "styles.css should include the immersive product video stage",
);
assert.ok(
  css.includes("timing-playhead"),
  "phrase-anchored timing should have a moving playhead",
);
assert.ok(
  css.includes("application-grid"),
  "the six explanation applications should have a responsive grid",
);
assert.ok(
  html.includes("autoplay"),
  "the hero video should provide immediate product motion",
);
assert.ok(
  html.includes('name="seqvio-analytics-endpoint"'),
  "analytics endpoint should be configurable",
);
assert.ok(
  html.includes('src="analytics.js"'),
  "analytics script should be loaded",
);
assert.ok(
  html.includes('data-goatcounter="https://makeseq.goatcounter.com/count"'),
  "GoatCounter site should be configured",
);
assert.ok(
  html.includes('src="https://gc.zgo.at/count.js"'),
  "GoatCounter client should be loaded",
);
assert.ok(
  (html.match(/data-track=/g) || []).length >= 7,
  "primary CTA clicks should be tracked",
);
assert.ok(
  analytics.includes("navigator.sendBeacon"),
  "analytics should support reliable event delivery",
);
assert.ok(
  analytics.includes("seqvio_click_counts_v1"),
  "analytics should keep a local fallback count",
);
assert.ok(
  analytics.includes("window.goatcounter.count"),
  "custom events should be sent to GoatCounter",
);
assert.ok(
  !/TODO|TBD|lorem/i.test(html + css),
  "page should not contain placeholder text",
);
assert.ok(
  !launchSource.includes("Three visual languages"),
  "launch artboards should not restore retired positioning",
);
assert.ok(
  !html.includes("Make technical work explainable"),
  "landing should not restore the retired technical-work positioning",
);

const localAssetReferences = [
  ...html.matchAll(/(?:src|href|poster|content)="([^"]+)"/g),
]
  .map((match) => match[1])
  .filter((ref) => /^(?:assets\/|styles\.css)/.test(ref));

for (const ref of localAssetReferences) {
  assert.ok(
    existsSync(path.join(root, ref)),
    `local reference should exist: ${ref}`,
  );
}

for (const asset of [
  "assets/launch/thumbnail.png",
  "assets/launch/gallery-01-agent-visual-language.png",
  "assets/launch/gallery-02-prompt-to-explanation.png",
  "assets/launch/gallery-03-visual-languages.png",
  "assets/launch/gallery-04-real-workflow.png",
]) {
  assert.ok(
    existsSync(path.join(root, asset)),
    `Product Hunt asset should exist: ${asset}`,
  );
}
