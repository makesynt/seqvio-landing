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

Primary GitHub, npm, install, and demo interactions are tagged with `data-track` and handled by `analytics.js`. Counts are always retained locally under `seqvio_click_counts_v1` so tracking never blocks navigation.

For aggregate launch analytics, set the `seqvio-analytics-endpoint` meta value in `index.html` to an HTTPS endpoint that accepts JSON `POST` requests. Events contain the event name, page path, destination, timestamp, referrer host, and UTM parameters; no persistent visitor identifier is created.
