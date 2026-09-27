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

## Status: what has been built

All 44 files were reviewed. **31 are unique**: 32–44 are pixel-identical copies of
23–31 (32 = 23, 33 = 24 … 40 = 31, 41 = 23 … 44 = 26). Each unique reference is
rebuilt as an editable, theme-coloured layout in `src/design/studio/` in **two
variations**, giving **62 studio designs** shared by all three pages.

| Reference | Variation 1 | Variation 2 |
|---|---|---|
| 1.jpg | Why choose us — card grid (`studio-why-choose`) | Our promise — dark card grid (`studio-why-promise`) |
| 2.jpg | Drowning in deadlines (`studio-drowning-deadlines`) | Last-minute rescue (`studio-last-minute`) |
| 3.jpg | Your dream, our guidance (`studio-dream-guidance`) | Study abroad dream (`studio-dream-abroad`) |
| 4.jpg | Questions into solutions (`studio-questions-solutions`) | Confused by your data? (`studio-questions-analysis`) |
| 5.jpg | Bachelor to PhD journey (`studio-bachelor-phd`) | Idea to publication path (`studio-idea-publication`) |
| 6.jpg | Not more pages — clarity (`studio-not-more-pages`) | Quality over word count (`studio-quality-over-length`) |
| 7.jpg | Stuck on your thesis? — steps (`studio-stuck-serif`) | Proposal pending? — steps (`studio-proposal-serif`) |
| 8.jpg | A weak thesis holds you back (`studio-weak-thesis`) | A rejected paper? — rescue (`studio-weak-paper`) |
| 9.jpg | Struggling with your thesis? (`studio-struggling-thesis`) | Struggling with assignments? (`studio-struggling-assignment`) |
| 10.jpg | New Year special offer (`studio-new-year-offer`) | Festival offer — phone mock-up (`studio-festival-offer`) |
| 11.jpg | Specialised services index (`studio-specialised-services`) | Data analysis menu (`studio-analysis-menu`) |
| 12.jpg | What we help you with (`studio-what-we-help`) | What you will learn (`studio-what-we-train`) |
| 13.jpg | Before the viva (`studio-viva-ready`) | Conference presentation (`studio-conference-ready`) |
| 14.jpg | Your research, explained (`studio-explained-clearly`) | Literature review, organised (`studio-literature-clearly`) |
| 15.jpg | Thesis stress starts here (`studio-stress-starts`) | Late-night checklist (`studio-exam-night`) |
| 16.jpg | ACADEMIC — bold campaign (`studio-academic-campaign`) | PUBLISH — bold campaign (`studio-publish-campaign`) |
| 17.jpg | Stuck on your thesis? — circle (`studio-stuck-circle`) | Need a proposal? — circle (`studio-proposal-circle`) |
| 18.jpg | Academic services — logo disc (`studio-academic-services`) | Editing services — logo disc (`studio-editing-services`) |
| 19.jpg | From confusion to completion (`studio-confusion-completion`) | From idea to degree (`studio-idea-to-degree`) |
| 20.jpg | THESIS excellence (`studio-thesis-excellence`) | RESEARCH excellence (`studio-research-excellence`) |
| 21.jpg | THESIS problem? (`studio-thesis-problem`) | DATA problem? (`studio-data-problem`) |
| 22.jpg | Alone in thesis? Not anymore (`studio-alone-in-thesis`) | Applying abroad alone? (`studio-alone-abroad`) |
| 23.jpg | Call for research papers (`studio-call-for-papers`) | Call for review articles (`studio-call-for-reviews`) |
| 24.jpg | From ideas to excellent results (`studio-ideas-results`) | From drafts to top grades (`studio-grades-results`) |
| 25.jpg | Assignment help — course code (`studio-course-code`) | Course help — MBA module (`studio-course-code-mba`) |
| 26.jpg | Thesis & research support list (`studio-thesis-research-support`) | Editing & formatting list (`studio-editing-support-list`) |
| 27.jpg | Stuck on your thesis? — cards (`studio-stuck-cards`) | Stuck on publishing? — cards (`studio-stuck-publication`) |
| 28.jpg | Do you want to publish? (`studio-publish-question`) | Do you want to study abroad? (`studio-study-abroad-question`) |
| 29.jpg | Turnitin similarity check (`studio-turnitin-check`) | AI content check (`studio-ai-check`) |
| 30.jpg | Research made easier (`studio-research-easier`) | Analysis made easier (`studio-analysis-easier`) |
| 31.jpg | Steps to success (`studio-stairs-success`) | Level up your research skills (`studio-stairs-training`) |

Photos in the references (cut-out people, 3D books, QR codes) are replaced by
editable photo slots with sample images; logos, contact details and colours come
from the selected page and its colour theme.

## How designs, colours and rotation work

- Every brand uses the **same** layouts (rebuilt from the references here, 2 variations each).
- The only difference between brands is the **logo and colours**.
- Each brand gets **15 colour themes** made from its logo colours; the app picks
  **today's theme** automatically (rotates daily) and you can override it.
- The ad library also shows **15 featured designs per day**, rotating so layouts
  aren't repeated too often.
- The earlier brand-specific styles stay available as extra layouts.
