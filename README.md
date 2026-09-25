# Poster Studio

Make social-media news posters in bulk. Pick a template, fill in the fields, download PNGs, with no design work needed.

## Features

- **20 templates**: 5 layouts (Classic, Full Bleed, Split, Newspaper, Bold) × 4 colour themes each
- **3 sizes**: Square 1080×1080, Portrait 1080×1350, Story 1080×1920
- **Brand kit**: logo, brand name, website and handle are entered once and used on every poster
- **Many posts at once**: add, duplicate and switch between posts; each post keeps its own template
- **CSV bulk import**: columns `category, headline, summary, date, source, image, template` (see `public/sample.csv`)
- **Downloads**
  - one poster as PNG
  - all posts as a ZIP
  - the current post in all 20 templates as a ZIP (handy for choosing a style)
- Nepali (Devanagari) text supported (Mukta / Noto Serif Devanagari fonts)
- Work is saved automatically in the browser (localStorage)

## Run locally

```bash
npm install
npm run dev
```

Build for production: `npm run build` (output in `dist/`). `public/_redirects` is included for Netlify.

## Adding a template

Add an entry to `TEMPLATES` in [src/templates.js](src/templates.js). Pick an existing `layout` and set the theme colours and fonts.
To make a new layout, add a component in [src/Poster.jsx](src/Poster.jsx) and register it in `LAYOUTS`.

## Notes

- Uploaded photos always export correctly. Photos loaded from a URL only export if the host allows cross-origin (CORS) access.
- Rendering uses [html-to-image](https://github.com/bubkoo/html-to-image) and zipping uses [JSZip](https://stuk.github.io/jszip/).

branch:sujal