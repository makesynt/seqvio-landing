# Seqvio Landing Page

Static landing page and Product Hunt launch kit for Seqvio.

## Preview

Open `index.html` directly in a browser, or serve this folder:

```bash
npx serve .
```

## Launch kit

- `assets/launch/thumbnail.png` - 240 x 240 launch thumbnail
- `assets/launch/gallery-*.png` - 1270 x 760 gallery images
- `launch-kit/launch-copy.md` - listing, maker comment, and social copy
- `launch-kit/launch-checklist.md` - launch readiness checklist
- `assets/launch/source.html` - editable source artboards

Regenerate the PNG assets after changing the artboards:

```bash
node scripts/export-launch-assets.mjs
```

## Test

```bash
node tests/landing.test.mjs
```

## Click analytics

Page views and aggregate conversion events are sent to the `makeseq` GoatCounter site. Primary GitHub, npm, install, and demo interactions are tagged with `data-track`; video play and completion are recorded as events by `analytics.js`.

Counts are also retained locally under `seqvio_click_counts_v1` so analytics never blocks navigation. An optional `seqvio-analytics-endpoint` meta value can mirror the same events to another HTTPS JSON endpoint. No persistent visitor identifier is created by the local event layer.
