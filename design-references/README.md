# Design references

Put the Canva designs you want recreated here. They are **not** part of the app
build (the app only serves `public/`); they are reference images for building
new editable layouts.

## How to add

1. In Canva: Share → Download → **PNG** (or JPG).
2. Drop the files in this folder. Optional sub-folders if a design is meant for one page only:
   - `nepal-scholar/`
   - `thesis-companion/`
   - `artova-research/`
   Files in the root of this folder are adapted to all three brands.
3. Name files so the purpose is clear, e.g. `offer-discount-01.png`, `webinar-02.png`, `testimonial-03.png`.

Only add designs that are royalty-free / free to reuse. Each reference is rebuilt
as an editable layout in two variations (e.g. mirrored, light/dark, with/without photo).

## Logos

Put each brand's logo files in `public/logo/<brand>/`:

- `public/logo/nepal-scholar/`
- `public/logo/thesis-companion/`
- `public/logo/artova-research/`

Best: a **transparent PNG** of the full logo, plus the symbol on its own if you
have it (e.g. `logo.png`, `mark.png`). A white/light version for dark
backgrounds is a bonus. The colour themes for each brand are built from the
colours in these logos.

## How designs, colours and rotation work

- Every brand uses the **same** layouts (rebuilt from the references here, 2 variations each).
- The only difference between brands is the **logo and colours**.
- Each brand gets **15 colour themes** made from its logo colours; the app picks
  **today's theme** automatically (rotates daily) and you can override it.
- The ad library also shows **15 featured designs per day**, rotating so layouts
  aren't repeated too often.
- The earlier brand-specific styles stay available as extra layouts.
