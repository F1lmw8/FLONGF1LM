# FILM Portfolio (Next.js Starter)

- App Router + TailwindCSS
- Gallery from `data/gallery.json`
- Anti-copy overlay + optional watermark CSS
- Remote images via Unsplash (config in `next.config.js`)

## Quick Start
```bash
pnpm i
pnpm dev
# then open http://localhost:3000
```

## Replace with your photos
- Edit `data/gallery.json` (src, w, h, alt, caption). You can use local files under `/public/images` too.
- To turn off watermark/overlay per photo, set `"overlay": false` or `"watermark": false` in JSON.
