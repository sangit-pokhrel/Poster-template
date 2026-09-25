# Poster Studio

Bulk news-poster generator for Facebook, Instagram and other social platforms. Interns fill in the fields, pick one of **20 templates** and download HD PNGs, or import a CSV and download every poster as one ZIP.

The rendering engine follows the logic of the [KrantiPatra poster maker](https://krantipatra.netlify.app): one HTML5 Canvas 2D pipeline at 1080 px wide, the same layout constants, and the same logo / date / red-blue bar / social footer. It is rebuilt as a typed, tested and framework-free engine so the same code draws the live preview, the thumbnails and the batch export.

📄 **Full proposal & system architecture:** [docs/PROPOSAL.md](docs/PROPOSAL.md)

## Features

- **50 / 50 workspace**: every poster component on the left, the real-time poster on the right. The preview can be **minimised** to a floating mini-dock or made **full screen**.
- **20 templates** (13 faithful ports of the reference + 7 new), filterable by category, with live thumbnails of your post.
- **Word-level highlight**: click words to colour them.
- **Canvas drag**: grab the headline to move it, or anywhere else to pan the photo.
- **Photos**: upload, drag and drop, URL or samples. Cover or contain (with blurred backdrop), zoom and pan. Up to 4 photos for the collage.
- **Sizes**: 1:1 (1080×1080), 4:5 (1080×1350), 16:9 (1080×608), 9:16 (1080×1920).
- **Brand kit**: logo, name, website, call-out text, two brand colours, social icons, map texture.
- **Exact Bikram Sambat date** with one click.
- **Bulk**: many posts per session, CSV import (`*word*` = highlight), ZIP of all posts, ZIP of one post in all 20 templates, with progress and cancel.
- English / नेपाली UI, auto-save, copy to clipboard, and a mobile layout.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run typecheck` | `tsc` strict |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |

Deploy `dist/` to any static host. `public/_redirects` is included for Netlify.

## CSV import

```csv
template,headline,speaker,badge,date,photo,photo2,photo3,photo4
breaking,संसदबाट *शिक्षा विधेयक* बहुमतले पारित,,,,https://example.com/photo.jpg,,,
```

Template ids: `classic purephoto minphoto multiphoto breaking flash quote editorial interview sports cinema viral factcheck weather business international split notice tribute live`.
See [public/sample.csv](public/sample.csv).

> Photos referenced by URL must allow CORS, otherwise the browser blocks export. Uploaded photos always work.

## Project structure

```
src/
├── engine/        pure canvas renderer: types, primitives, 20 templates, renderPoster()
├── state/         reducer, defaults, persistence (validated), CSV → posts, store provider
├── lib/           images (LRU cache, downscaling), fonts, exporter (PNG/ZIP/clipboard), csv, i18n, BS date
├── hooks/         assets, fonts, fullscreen, element size, local preferences
└── components/    header, editor tabs, preview (canvas + drag), UI kit, export provider
```

### Adding a template

1. Create a `TemplateDef` in `src/engine/templates/*.ts` using the primitives in `src/engine/primitives/`.
2. Add it to the `TEMPLATES` array in `src/engine/templates/index.ts`.

The picker, thumbnails, CSV `template` column and exports pick it up automatically.
