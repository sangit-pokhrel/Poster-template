# Artova Designs

Poster studio for three academic-services Facebook pages. Pick a design, type your words, add a photo, and download a finished ad for Facebook and Instagram.

| Page | Facebook | Logo colours |
|---|---|---|
| **Nepal Scholar** | [page](https://www.facebook.com/profile.php?id=61577909248975) | **yellow · white · black** (fixed family of 15 themes) |
| **Thesis Companion** | [page](https://www.facebook.com/profile.php?id=61567854154156) | charcoal · royal blue (+ navy, yellow and red from its posters) |
| **Artova Research** | [page](https://www.facebook.com/artovasolutions/) | violet · magenta · cyan |

Built from [`proposal.md`](proposal.md). The section-by-section mapping is in [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md). The app has a **Guide** tab (ⓘ in the header) that explains all of this to the team.

## What's inside

| | Count | Notes |
|---|---:|---|
| Reference posters rebuilt | **31** | Every unique image in [`design-references/`](design-references/README.md). 32–44 are duplicates of 23–31. |
| Studio designs | **62** | 2 variations per reference (usually light + dark, mirrored), shared by all pages |
| Brand classics | **100** ads | Drawn by each page's own design system: 14 layouts per page (Heritage Editorial, Swiss Monochrome, Gradient Tech) |
| Distinct designs per page | **76** | 62 studio + 14 classic layouts, **228** across the three pages |
| Colour themes per page | **15** | Generated from the logo colours; one rotates in automatically each day |
| Featured per day | **15** | A new daily pick of studio designs for each page |

### Studio designs and colour themes

Studio designs are the same for every page, as the team asked. What makes each page's poster its own:

- **Logo**: a "symbol + name" lockup in the page's heading font (wide logo files are used as-is).
- **Contact details**: phone, email, website, address and handle. Empty fields and their icons are left out.
- **Colour theme**: 15 per page. Theme 1 is the logo palette; the others pair a dark base from the logo with a contrasting accent, using logo colours first and then harmonies. Accents are automatically deepened on white and lightened on dark backgrounds, so text stays readable in every theme.

**Auto · daily** moves each poster to a new theme every day, and the three pages never share a theme on the same day. Picking a swatch pins that theme.

### Logos

The team's logo files are in `public/logo/<page>/source/`. `python scripts/prepare-logos.py` turns them into what the posters use: a transparent horizontal logo, the symbol, and white versions for dark designs. It also builds `public/favicon.png` (the Artova "A") from `public/logo/favicon.png`.

Drop logo files into `public/logo/<page>/`: `nepal-scholar`, `thesis-companion` or `artova-research`.

- Any file name is the full logo.
- `*mark*` / `*icon*` / `*symbol*` marks the symbol-only version.
- `*light*` / `*white*` marks a version for dark backgrounds.

A small Vite plugin (`vite.brandLogos.ts`) picks the files up without code changes. The app reads the logo's main colours and rebuilds the 15 themes from them. Pages without files there fall back to the bundled logos in `public/brands/`. Nepal Scholar keeps its yellow · white · black family whatever its logo colours are.

## Features

- **50 / 50 workspace**: editor left, live poster right. **Minimize** the preview to a floating dock or go **full screen** with zoom. On phones the editor and preview become tabs.
- **Ad browser**: *Today's 15*, *Studio designs*, *Brand classics*, 12 categories, search, lazy thumbnails in the current theme, and a line explaining each filter.
- **Guide tab**:
  - today's theme for each page and today's 15;
  - how the app works, library statistics, all 15 themes;
  - page details and logo instructions;
  - editing tips and keyboard shortcuts;
  - export sizes per platform, privacy, and an FAQ.
- **Quick edit**: headlines, services, steps, stats, lists, badges, prices, CTAs, photos, date and footer. Click words to highlight them. Tokens such as `{brand}` and `{phone}` make one text work for all pages.
- **Advanced edit**: font, size, weight, colour, alignment, spacing, position, size, rotation, opacity, icon picker, logo style, lock, visibility and layer order.
- **On-canvas editing** (Fabric.js): select, drag, resize with live text re-wrap, rotate, snap, nudge, and double-click to edit.
- **Photos**: drag and drop or upload JPG, PNG or WebP (up to 10 MB), or use 27 sample photos. Cover or contain, zoom and pan. Uploads are stored in IndexedDB.
- **Sizes**: 4:5, 1:1, 9:16 and 16:9. **Export** as PNG or JPG at 1×, 2× or 3×, copy to clipboard, or download **all posters as one ZIP**.
- **Several posters per session**, auto-save, undo/redo, and reset with confirmation. **Brand kit** per page.

## Run

```bash
npm install
npm run dev              # http://localhost:5173
npm run dev -- --host    # also reachable from phones on the same Wi-Fi
```

| Script | |
|---|---|
| `npm run build` | typecheck + production build → `dist/` |
| `npm run typecheck` / `npm run lint` / `npm test` | strict TS · ESLint · Vitest (544 tests: every design × page, theme contrast, rotation, library integrity) |

Deploy `dist/` to any static host. `public/_redirects` is included for Netlify.

## Project structure

```text
src/
├── app/              App shell (brand-accented UI, shortcuts)
├── components/       layout · templates (ad browser, theme picker) · editor · guide · canvas · common
├── design/
│   ├── studio/       62 shared designs rebuilt from design-references/ (kit.ts + refsA/B/C.ts)
│   ├── ads/          100 brand-classic ad texts
│   ├── systems/      one design system per page (14 layouts each)
│   ├── themes.ts     15 logo-based colour themes per page, daily rotation, daily picks
│   ├── builders.ts   layout DSL (text, image, logo, shape, badge, icon…)
│   └── registry.ts   library, filters, search, buildLayout(ad, page)
├── data/brands.ts    the three brand kits (contacts from the pages' own posters)
├── render/           pure Canvas 2D drawing shared by preview, thumbnails and export
├── services/         Fabric stage · export · images · IndexedDB · storage · fonts · logo folder & colours
├── store/            Zustand: editorStore (posters, history) · uiStore · selectors (theme → render env)
└── types/            brand · element · template · poster
vite.brandLogos.ts    exposes public/logo/<page>/ files as `virtual:brand-logos`
```

### Adding a studio design

Add an `entry(ref, { id, name, category, kind, content }, build)` in `src/design/studio/`. Use the kit helpers (`headline`, `itemGrid`, `contactRow`, `footerBar`…) and palette tokens only (`D`, `M`, `A`, `POP`, `INK`, `PAPER`). The design then appears for all three pages in all 15 themes, and the tests check its geometry and colours.
