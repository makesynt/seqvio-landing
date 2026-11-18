# Seqvio Studio landing page

A static, bilingual landing page for Seqvio Studio. It contains the product introduction, six selected style samples, and links to the film, guide and Windows/macOS installers. No build step is required.

## Preview and test

Open index.html in a browser, or serve this folder with a static server.

    npx serve .
    node tests/landing.test.mjs
    node tests/legacy-landing.test.mjs

The language choice is stored locally when browser storage is available. Hover over a gallery card for a muted preview, or select it to open the full sample with playback controls. Previews load on demand and respect reduced-motion and data-saving preferences.

## Assets

- assets/brand/seqvio-studio-mark.svg is the Studio application mark.
- assets/seqvio-hero-art-v2.png is an original hero artwork generated with the built-in ImageGen tool.
- assets/studio-workbench.webp is a capture of the Studio element editor with a demo project.
- assets/style-covers/ contains stills selected from the six original sample videos.
- assets/style-samples/ contains six publicly released Studio samples. Their SHA-256 values were verified against the Studio release manifest; CREDITS.md retains the release's music attribution.
- The previous Seqvio renderer landing page and stylesheet remain as seqvio-legacy.html and legacy-styles.css. Original Product Hunt image assets and launch-kit files are retained.

### Hero artwork prompt

Use case: stylized-concept. Asset type: an original refined landing-page hero artwork for a creative video studio. Create a single sculptural, flowing translucent ribbon, folded like one continuous sheet of frosted glass and silk, suggesting motion and imagination without forming a literal icon. Quiet contemporary art-gallery photography with extraordinary craftsmanship and subtle material detail. An airy warm ivory background, soft natural sidelight, gentle shadow, muted blush apricot, misty lavender and a small hint of cool blue in the translucent material. Wide landscape composition; the artwork sits mainly in the right half, with generous calm empty space on the left for page typography. Elegant, restrained, poetic, no visual clutter. No text, logos, UI, frames, gradients with banding, sparkles, particles or watermark.

## Click analytics

Page views and aggregate conversion events use the existing makeseq GoatCounter configuration. Tagged interactions are also retained locally under seqvio_click_counts_v1; the optional seqvio-analytics-endpoint meta value can mirror events to another HTTPS JSON endpoint.
