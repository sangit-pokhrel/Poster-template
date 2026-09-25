# Template Studio

Branded social-media poster generator for two Facebook pages:

| Brand | Look | Facebook |
|---|---|---|
| **Nepal Scholar** | navy · maroon · gold, Playfair Display + Poppins | [page](https://www.facebook.com/profile.php?id=61577909248975) |
| **Thesis Companion** | black & white · blue accent, Cinzel + Montserrat | [page](https://www.facebook.com/profile.php?id=61567854154156) |

Pick a template on the left, fill in the content, and the poster on the right updates as you type. Switch brands in the header and the poster's logo, colours and fonts change with it.

Built from [`proposal.md`](proposal.md). The section-by-section mapping is in [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md).

## Features

- **50 / 50 workspace**: editor on the left, live poster on the right. The preview can be **minimized** to a floating dock or opened **full screen** with zoom. On phones the editor and preview become tabs.
- **20 templates in 10 categories**: Photo, News, Academic, Business, Promotional, Events, Sports, Trending, Social, Story. Thumbnails render in the active brand.
- **Quick edit**: headings (with click-to-highlight words), body text, photos, badges, date, footer and logo.
- **Advanced edit**: font, size, weight, colour, alignment, line and letter spacing, position, size, rotation, opacity, lock, visibility and layer order.
- **On-canvas editing** (Fabric.js): select, drag, resize (text re-wraps live), rotate, snap to centre, arrow-key nudge, and double-click text to jump to its field.
- **Photos**: drag and drop or upload JPG, PNG or WebP up to 10 MB, or pick a sample photo. Cover or contain (with blurred backdrop), zoom, pan, and multi-photo layouts. Uploads are stored in IndexedDB.
- **Sizes**: 1:1, 4:5, 16:9 and 9:16. Layouts use normalized coordinates, so switching ratio keeps the design and circles stay circular.
- **Date**: Nepali (exact Bikram Sambat), English or custom text, plus a "Use today" button.
- **Export**: PNG or JPG at 1×, 2× or 3×, copy to clipboard, and **download all posters as one ZIP**. Exports are drawn on a dedicated off-screen canvas, so selection handles never appear in the files.
- **Several posters per session**, auto-save, undo/redo (Ctrl+Z / Ctrl+Shift+Z), and reset with confirmation.
- **Brand kit** per page: phone, website, email and handle (blank fields are dropped from footers), colours, and a replaceable logo.

## Run

```bash
npm install
npm run dev              # http://localhost:5173
npm run dev -- --host    # also reachable from phones on the same Wi-Fi
```

| Script | |
|---|---|
| `npm run build` | typecheck + production build → `dist/` |
| `npm run typecheck` / `npm run lint` / `npm test` | strict TS · ESLint · Vitest (52 tests) |

Deploy `dist/` to any static host. `public/_redirects` is included for Netlify.

## Project structure

```text
src/
├── app/            App shell (brand-accented UI, shortcuts)
├── components/
│   ├── layout/     AppHeader, BrandSwitcher, Workspace, EditorPanel, PreviewPanel
│   ├── templates/  TemplateBrowser (categories + live thumbnails)
│   ├── editor/     Content (quick) · Design (advanced, layers) · Posters & Brand kit
│   ├── canvas/     PosterCanvas (Fabric stage host, fit/zoom)
│   └── common/     buttons, fields, sliders, toasts, confirm dialog, icons
├── data/
│   ├── brands.ts           the two brand kits
│   ├── templates/*.ts      20 data-driven templates (+ authoring helpers)
│   └── templateRegistry.ts templates + categories
├── render/         pure Canvas 2D drawing: text layout, images, shapes, badges, logo
├── services/       canvasRenderer (Fabric) · export · images · IndexedDB assets · storage · fonts · templates
├── store/          Zustand: editorStore (posters, history) · uiStore (view prefs)
├── types/          brand · element · template · poster
└── utils/          aspect ratios & frames · dates · ids
```

### Adding a template

Add a `defineTemplate({...})` to a file in `src/data/templates/` and list it in `templateRegistry.ts`. The picker, categories, thumbnails and exports pick it up automatically, and the registry tests check its geometry.

### Updating a brand

Edit `src/data/brands.ts`, and replace the logos in `public/brands/<brand>/` (`logo.png`, `mark.png`, plus optional `-light` variants for dark backgrounds). The team can also change colours, contact details and the logo in the app's **Posters → Brand kit**.
