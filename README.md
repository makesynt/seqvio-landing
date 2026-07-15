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
