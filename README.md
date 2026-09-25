# Template Studio

Ad and promotional poster generator for three academic-services pages. Each page has **its own design system**, not just its own colours:

| Brand | Design system | Facebook |
|---|---|---|
| **Nepal Scholar** | *Heritage Editorial*: navy & cream with gold hairlines, Playfair Display, arched photos, gold seals | [page](https://www.facebook.com/profile.php?id=61577909248975) |
| **Thesis Companion** | *Swiss Monochrome*: black & white blocks, Montserrat Black, B&W photos, one blue accent | [page](https://www.facebook.com/profile.php?id=61567854154156) |
| **Artova Research** | *Gradient Tech*: violet gradients, glass cards, cyan glow, Space Grotesk, faceted shapes | [page](https://www.facebook.com/artovasolutions/) |

Pick one of **100 ready-made ads** on the left, change the words and photo, and the poster on the right updates as you type. Switch brands in the header and the same ad is redrawn in that brand's own layout and style, keeping your text and photos.

Built from [`proposal.md`](proposal.md). The section-by-section mapping is in [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md).

## Ad library: 100 ads in 12 categories

| Category | Examples |
|---|---|
| Thesis | thesis support, chapter-by-chapter, viva prep, MPhil/PhD mentoring, submission countdown |
| Proposal | proposal writing, topic selection, grant proposals, common mistakes |
| Data Analysis | SPSS, R/Python/STATA, SEM, qualitative & NVivo, 48-hour analysis |
| Publication | journal support, Scopus/WoS, predatory-journal tips, rejected-paper rescue |
| Editing & Plagiarism | proofreading, Turnitin report, similarity reduction, APA formatting |
| Assignments | assignment help, internship & project reports, case studies |
| Study Abroad | SOP, application kit, fully funded scholarships, admission roadmap |
| Training | webinars, SPSS course, bootcamp, curriculum, seats-left countdown |
| Offers | Dashain & Tihar offers, packages, student discount, referral, flash sale, plans |
| Reviews & Results | testimonials, impact stats, why choose us, guarantee, before/after |
| Tips & Quotes | writing tips, myths vs facts, research quotes, free tools |
| Brand & Contact | contact us, about, hiring, opening hours, how we work, follower milestone |

Each ad uses one of 14 layouts: hero, services, offer, stats, steps, review, event, countdown, notice, tip, checklist, compare, quote and contact. Each brand implements all 14 in its own style, so the library covers **300 distinct designs**.

## Features

- **50 / 50 workspace**: editor left, live poster right. **Minimize** the preview to a floating dock or go **full screen** with zoom. On phones the editor and preview become tabs.
- **Ad browser**: search, 12 category filters, and lazy-loaded thumbnails drawn in the active brand's design.
- **Quick edit**: every headline, service, step, stat, bullet list, badge, price, CTA, photo, date and footer. Click words to highlight them.
- **Advanced edit**: font, size, weight, colour, alignment, spacing, position, size, rotation, opacity, icon picker (49 icons), lock, visibility and layer order.
- **On-canvas editing** (Fabric.js): select, drag, resize with live text re-wrap, rotate, snap to centre, arrow-key nudge, double-click to edit.
- **Photos**: drag and drop or upload JPG, PNG or WebP (up to 10 MB), or pick from 27 sample photos. Cover or contain, zoom and pan. Uploads are stored in IndexedDB.
- **Sizes**: 1:1, 4:5, 16:9 and 9:16. Layouts are normalized, so every ad adapts.
- **Date**: Nepali (exact Bikram Sambat), English or custom.
- **Export**: PNG or JPG at 1×, 2× or 3×, copy to clipboard, and **all posters as one ZIP**. Exports use a dedicated off-screen canvas, so selection handles never appear in files.
- **Several posters per session**, auto-save, undo/redo, and reset with confirmation.
- **Brand kit** per page: phone, website, email, handle, colours and logo. Blank contact fields are dropped from footers.

## Run

```bash
npm install
npm run dev              # http://localhost:5173
npm run dev -- --host    # also reachable from phones on the same Wi-Fi
```

| Script | |
|---|---|
| `npm run build` | typecheck + production build → `dist/` |
| `npm run typecheck` / `npm run lint` / `npm test` | strict TS · ESLint · Vitest (338 tests, incl. every ad × brand layout) |

Deploy `dist/` to any static host. `public/_redirects` is included for Netlify.

## Project structure

```text
src/
├── app/              App shell (brand-accented UI, shortcuts)
├── components/       layout · templates (ad browser) · editor · canvas · common
├── design/
│   ├── ads/          100 ad definitions: content only (headline, items, price, CTA…)
│   ├── systems/      one design system per brand: 14 layouts each
│   ├── builders.ts   layout DSL (text, image, logo, shape, badge, icon, glow…)
│   └── registry.ts   ads, categories, search, buildLayout(ad, brand)
├── data/brands.ts    the three brand kits
├── render/           pure Canvas 2D drawing: text, bullets, images, shapes, badges, icons, logo
├── services/         Fabric stage · export · images · IndexedDB · storage · fonts · templates
├── store/            Zustand: editorStore (posters, history) · uiStore
├── types/            brand · element · template (ads, layouts) · poster
└── utils/            aspect ratios & frames · dates · ids
```

### Adding an ad

Add an entry in `src/design/ads/*.ts` with a category, one of the 14 layout kinds, and its content. It appears in all three brand designs automatically, and the tests check its geometry in every brand.

### Changing a brand's look

Each brand's style lives in `src/design/systems/<brand>.ts`. Colours, contact details and the logo can also be changed in the app under **Posters → Brand kit**. Logo files are in `public/brands/<brand>/` (`logo.png`, `mark.png`, plus `-light` versions for dark backgrounds).

> **Artova Research:** the logo and location currently come from the *Artova Solutions* Facebook page, the only Artova page found online. Replace the files in `public/brands/artova-research/`, or upload a new logo in the Brand kit, if Artova Research uses a different one.
