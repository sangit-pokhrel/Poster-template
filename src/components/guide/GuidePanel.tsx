import type { ReactNode } from 'react';
import { BRANDS, BRAND_IDS } from '../../data/brands';
import { CATEGORIES, CLASSIC_ADS, FEATURED_PER_DAY, KIND_LABEL, REFERENCE_COUNT, STUDIO_ADS, adsIn, featuredToday, getAd } from '../../design/registry';
import { THEME_COUNT, dailyThemeIndex } from '../../design/themes';
import type { ColorTheme } from '../../design/themes';
import { droppedLogos } from '../../services/logoFolder';
import { useEditorStore } from '../../store/editorStore';
import { themesFor, useActivePoster } from '../../store/selectors';
import { useUiStore } from '../../store/uiStore';
import type { BrandId } from '../../types/brand';
import { formatEnglish, formatNepali, todayIso } from '../../utils/date';
import { Section, cx } from '../common/controls';
import { toast } from '../common/feedback';

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const P = ({ children }: { children: ReactNode }) => <p className="text-[13px] leading-relaxed text-ink-300">{children}</p>;
const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-white">{children}</strong>;
const Kbd = ({ children }: { children: ReactNode }) => <kbd className="rounded border border-ink-700 bg-ink-800 px-1.5 py-0.5 font-mono text-[11px] text-ink-200">{children}</kbd>;

function Stat({ value, label, hint }: { value: ReactNode; label: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-ink-800 bg-ink-950 p-3" title={hint}>
      <p className="text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="text-[11px] leading-snug text-ink-400">{label}</p>
    </div>
  );
}

function Dot({ theme, size = 'size-5' }: { theme: ColorTheme; size?: string }) {
  const { primary, secondary, accent } = theme.palette;
  return <span aria-hidden="true" className={cx('inline-block shrink-0 rounded-full border border-ink-700', size)} style={{ background: `conic-gradient(${primary} 0 50%, ${secondary} 50% 75%, ${accent} 75% 100%)` }} />;
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-800">
      <table className="w-full text-left text-[12px]">
        <thead className="bg-ink-950 text-ink-400">
          <tr>{head.map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-ink-800 text-ink-200">
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className="px-3 py-2 align-top">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Steps({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map(([title, body], i) => (
        <li key={title} className="flex gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold text-brand-ink">{i + 1}</span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white">{title}</p>
            <div className="text-[12px] leading-relaxed text-ink-400">{body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Today() {
  const poster = useActivePoster();
  const overrides = useEditorStore((s) => s.brandOverrides);
  const chooseTemplate = useEditorStore((s) => s.chooseTemplate);
  const setUi = useUiStore((s) => s.set);
  const iso = todayIso();
  const featured = featuredToday(poster.brandId, iso);

  const open = (id: string) => {
    chooseTemplate(id);
    setUi('tab', 'content');
    toast.info(`Opened “${getAd(id).name}”`);
  };

  return (
    <Section title="Today at a glance" icon="calendar">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-lg font-bold text-white">{formatEnglish(iso)}</p>
        <p className="text-sm text-ink-400">{formatNepali(iso)}</p>
      </div>
      <P>
        Every day each page gets <B>a new colour theme</B> and <B>{FEATURED_PER_DAY} featured designs</B>. The three pages never share a theme on the same day, so
        their posters look different even when they use the same layout.
      </P>
      <div className="grid gap-2 sm:grid-cols-3">
        {BRAND_IDS.map((id) => {
          const themes = themesFor(id, overrides[id]);
          const t = themes[dailyThemeIndex(id, iso)] ?? themes[0];
          return (
            <div key={id} className={cx('flex items-center gap-2 rounded-lg border p-2', id === poster.brandId ? 'border-brand bg-brand/5' : 'border-ink-800 bg-ink-950')}>
              {t && <Dot theme={t} size="size-8" />}
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">{BRANDS[id].name}</p>
                <p className="truncate text-[11px] text-ink-400">Theme {t ? `${t.index + 1} · ${t.name}` : ''}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <p className="mb-2 text-[12px] font-semibold text-white">Today’s {FEATURED_PER_DAY} for {BRANDS[poster.brandId].name}</p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {featured.map((a, i) => (
            <li key={a.id}>
              <button type="button" onClick={() => open(a.id)} className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[12px] text-ink-300 hover:bg-ink-800 hover:text-white">
                <span className="w-5 text-right tabular-nums text-ink-500">{i + 1}.</span>
                <span className="truncate">{a.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section title="How Artova Designs works" icon="sparkles">
      <P>
        Artova Designs turns ready-made ad layouts into finished Facebook and Instagram posters for <B>Nepal Scholar</B>, <B>Thesis Companion</B> and <B>Artova Research</B>.
        You only fill in words and photos; the layout, fonts, colours, logo and contact details are handled for you.
      </P>
      <Steps
        items={[
          ['Pick the page', <>Use the page switcher in the header. The logo, contact details and colour themes change to that page.</>],
          ['Pick a design', <>Open the <B>Ads</B> tab. Start with <B>Today’s 15</B>, or browse all studio designs, brand classics or a category. Search works on names and headlines.</>],
          ['Fill in the content', <>In the <B>Content</B> tab, type your headline, services and offer, and upload a photo. Click words in a heading to highlight them in the accent colour.</>],
          ['Adjust (optional)', <>Drag, resize or rotate anything on the preview. Switch to <B>Advanced</B> for fonts, colours, spacing and layers, or pick another colour theme.</>],
          ['Download', <>Choose PNG or JPG and a size, then press <B>Download</B>. Make several posters in the <B>Posters</B> tab and download them all as one ZIP.</>],
        ]}
      />
    </Section>
  );
}

function Library() {
  const perPage = STUDIO_ADS.length + Object.keys(KIND_LABEL).length;
  return (
    <Section title="The design library" icon="grid" defaultOpen={false}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat value={REFERENCE_COUNT} label="reference posters rebuilt" hint="Unique designs in design-references/ (32–44 repeat 23–31)" />
        <Stat value={STUDIO_ADS.length} label="studio designs (2 variations each)" />
        <Stat value={CLASSIC_ADS.length} label="brand classic ads" />
        <Stat value={perPage * BRAND_IDS.length} label={`distinct designs across 3 pages (${perPage} per page)`} />
      </div>
      <Table
        head={['Collection', 'What it is', 'Differs per page by']}
        rows={[
          [<B key="s">Studio designs</B>, `${STUDIO_ADS.length} layouts rebuilt from the team’s Canva references, two variations of each (usually light + dark, mirrored).`, 'Colour theme, logo and contact details'],
          [<B key="c">Brand classics</B>, `${CLASSIC_ADS.length} ad texts drawn by each page’s own design system (${Object.keys(KIND_LABEL).length} layouts per page).`, 'Whole layout and style'],
          [<B key="t">Today’s 15</B>, 'A daily pick of studio designs, different for each page.', 'Changes every day'],
        ]}
      />
      <div>
        <p className="mb-2 text-[12px] font-semibold text-white">Categories</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <span key={c.id} className="rounded-full border border-ink-700 px-2.5 py-1 text-[11px] text-ink-300">
              {c.icon} {c.label} <span className="text-ink-500">{adsIn(c.id).length}</span>
            </span>
          ))}
        </div>
      </div>
      <P>
        A card marked <B>Studio</B> is a shared design. Other cards show their layout type, such as Hero, Services, Offer, Steps or Review. When you switch ad or page, whatever you
        typed and uploaded is carried over.
      </P>
    </Section>
  );
}

function Themes() {
  const poster = useActivePoster();
  const overrides = useEditorStore((s) => s.brandOverrides[poster.brandId]);
  const themes = themesFor(poster.brandId, overrides);
  const today = dailyThemeIndex(poster.brandId, todayIso());
  return (
    <Section title="Colour themes & daily rotation" icon="palette" defaultOpen={false}>
      <P>
        Each page has <B>{THEME_COUNT} colour themes</B> generated from its logo colours. Theme 1 is the logo’s own palette. The others pair a dark base from the logo with a
        contrasting accent (logo colours first, then colours that harmonise with them). Every theme keeps text readable: dark bases carry white text, and accents are lightened
        on dark backgrounds and deepened on white.
      </P>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {themes.map((t) => (
          <li key={t.index} className={cx('flex items-center gap-2 rounded-md px-2 py-1 text-[12px]', t.index === today ? 'bg-brand/10 text-white' : 'text-ink-300')}>
            <Dot theme={t} />
            <span className="w-5 tabular-nums text-ink-500">{t.index + 1}.</span>
            <span className="truncate">{t.name}</span>
            {t.index === today && <span className="ml-auto rounded bg-brand px-1.5 text-[10px] font-bold text-brand-ink">TODAY</span>}
          </li>
        ))}
      </ul>
      <Table
        head={['Setting', 'Behaviour']}
        rows={[
          ['Auto · daily', `The poster uses today’s theme and moves to the next one at midnight, cycling through all ${THEME_COUNT} every ${THEME_COUNT} days.`],
          ['A pinned swatch', 'The poster keeps that theme on every day, including in exports and in the ZIP.'],
          ['Brand kit colours', 'Changing the Primary/Accent colours in Posters → Brand kit regenerates all themes from your new colours.'],
        ]}
      />
    </Section>
  );
}

function Pages() {
  const overrides = useEditorStore((s) => s.brandOverrides);
  return (
    <Section title="The three pages" icon="posters" defaultOpen={false}>
      {BRAND_IDS.map((id: BrandId) => {
        const b = { ...BRANDS[id], ...Object.fromEntries(Object.entries(overrides[id] ?? {}).filter(([, v]) => typeof v === 'string')) };
        const themes = themesFor(id, overrides[id]);
        return (
          <div key={id} className="rounded-lg border border-ink-800 bg-ink-950 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-white">{b.name}</p>
              <a href={b.facebookUrl} target="_blank" rel="noreferrer" className="text-[11px] text-brand hover:underline">
                Facebook ↗
              </a>
            </div>
            <p className="text-[11px] text-ink-400">{b.tagline}</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px]">
              {(['phone', 'email', 'website', 'address', 'handle'] as const).map((k) => (
                <div key={k} className="contents">
                  <dt className="capitalize text-ink-500">{k}</dt>
                  <dd className={cx('truncate', b[k] ? 'text-ink-200' : 'italic text-ink-600')}>{b[k] || 'not set (hidden on posters)'}</dd>
                </div>
              ))}
              <dt className="text-ink-500">Logo</dt>
              <dd className="truncate text-ink-200">{droppedLogos[id] ? `public/logo/${id}/ (your file)` : `bundled (public/brands/${id}/)`}</dd>
              <dt className="text-ink-500">Fonts</dt>
              <dd className="truncate text-ink-200">{b.fonts.heading} / {b.fonts.body}</dd>
            </dl>
            <div className="mt-2 flex gap-1">{themes.map((t) => <Dot key={t.index} theme={t} size="size-4" />)}</div>
          </div>
        );
      })}
      <P>Contact details come from each page’s own posters. Change them in <B>Content → Footer & contact</B> or <B>Posters → Brand kit</B>. Empty fields, and their icons, are left off every poster.</P>
    </Section>
  );
}

function Logos() {
  return (
    <Section title="Adding or replacing logos" icon="image" defaultOpen={false}>
      <Steps
        items={[
          ['Put the files in the page’s folder', <><Kbd>public/logo/nepal-scholar/</Kbd>, <Kbd>public/logo/thesis-companion/</Kbd> or <Kbd>public/logo/artova-research/</Kbd>. PNG with a transparent background works best; SVG, JPG and WebP also work.</>],
          ['Name them by role', <>Any name is the full logo. Put <Kbd>mark</Kbd>, <Kbd>icon</Kbd> or <Kbd>symbol</Kbd> in the name for the symbol-only version, and <Kbd>light</Kbd> or <Kbd>white</Kbd> for versions made for dark backgrounds. One file on its own is used everywhere.</>],
          ['Reload', <>The dev server reloads by itself. The logo appears on every poster, and the {THEME_COUNT} colour themes are regenerated from the logo’s colours.</>],
        ]}
      />
      <P>For a one-off change without touching files, upload a logo under <B>Posters → Brand kit</B>. It is stored in this browser only.</P>
    </Section>
  );
}

function Editing() {
  return (
    <Section title="Editing tips & shortcuts" icon="keyboard" defaultOpen={false}>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[12px] leading-relaxed text-ink-300">
        <li><B>Highlight words:</B> click words under a heading field to colour them. <Kbd>*word*</Kbd> in a heading does the same.</li>
        <li><B>Tokens:</B> <Kbd>{'{brand}'}</Kbd>, <Kbd>{'{phone}'}</Kbd>, <Kbd>{'{email}'}</Kbd>, <Kbd>{'{website}'}</Kbd>, <Kbd>{'{address}'}</Kbd>, <Kbd>{'{handle}'}</Kbd> and <Kbd>{'{date}'}</Kbd> are replaced with the page’s details, so one text works for all three pages.</li>
        <li><B>On the preview:</B> click to select, drag to move, and use the handles to resize or rotate. Double-click text to jump to its field. Locked items (logos, decorations) can be unlocked in Advanced → Layers.</li>
        <li><B>Photos:</B> drag and drop or upload JPG/PNG/WebP up to 10 MB, or pick one of the 27 sample photos. Zoom and pan to crop.</li>
        <li><B>Logo style:</B> Full logo, Symbol + name (the default in studio designs), or Symbol only.</li>
      </ul>
      <Table
        head={['Keys', 'Action']}
        rows={[
          [<><Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd></>, 'Undo'],
          [<><Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Z</Kbd> / <Kbd>Ctrl</Kbd> + <Kbd>Y</Kbd></>, 'Redo'],
          [<><Kbd>←</Kbd> <Kbd>↑</Kbd> <Kbd>→</Kbd> <Kbd>↓</Kbd></>, 'Nudge the selected item (hold Shift for bigger steps)'],
          [<><Kbd>Delete</Kbd></>, 'Hide the selected item (bring it back with its eye toggle)'],
          [<><Kbd>Esc</Kbd></>, 'Deselect / leave full screen'],
        ]}
      />
    </Section>
  );
}

function Export() {
  return (
    <Section title="Sizes, export & where to post" icon="download" defaultOpen={false}>
      <Table
        head={['Ratio', 'Pixels (1×)', 'Best for']}
        rows={[
          ['4:5', '1080 × 1350', 'Facebook & Instagram feed (the most screen space; the default)'],
          ['1:1', '1080 × 1080', 'Instagram grid, Facebook square posts, profile highlights'],
          ['9:16', '1080 × 1920', 'Stories, Reels covers, WhatsApp status'],
          ['16:9', '1080 × 608', 'Facebook link / event covers, YouTube thumbnails'],
        ]}
      />
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[12px] leading-relaxed text-ink-300">
        <li><B>PNG</B> keeps text sharpest (best for Facebook). <B>JPG</B> gives smaller files for WhatsApp.</li>
        <li><B>1×</B> is the standard 1080 px width. Use <B>2×</B> or <B>3×</B> for print or very sharp phones.</li>
        <li>Exports are drawn on a separate canvas, so selection boxes and hints never appear in the file. Empty photo slots are left out.</li>
        <li><B>Copy image</B> (under the preview) puts the image on the clipboard, ready to paste into Messenger or Canva. <B>Download all</B> saves every poster in one ZIP.</li>
      </ul>
    </Section>
  );
}

function Privacy() {
  return (
    <Section title="Saving & privacy" icon="lock" defaultOpen={false}>
      <P>
        Everything stays in this browser. Posters save automatically (“Saved” in the header), and uploaded photos and logos are stored in the browser’s IndexedDB. Nothing is sent to a
        server. Clearing the site data removes your work, so download finished posters.
      </P>
    </Section>
  );
}

function Faq() {
  const qa: Array<[string, ReactNode]> = [
    ['Why do all three pages have the same designs?', 'Studio designs are shared on purpose. Each page’s logo, contact details and daily colour theme make the posters different; brand classics add layouts unique to each page.'],
    ['Why did my poster’s colours change today?', 'Its theme is set to “Auto · daily”. Pick a swatch in the Ads tab to keep one theme.'],
    ['Will I lose my text if I switch design or page?', 'No. Text, highlights and photos you changed are carried over. Only positions you dragged reset, and you are asked first.'],
    ['A contact line is missing on the poster.', 'That field is empty in the brand kit. Fill it in under Content → Footer & contact and it appears on every poster of that page.'],
    ['Can I add more designs?', 'Yes. Put a reference in design-references/, add its layout to src/design/studio/, and it appears for all pages with every theme. The tests check its geometry and colours.'],
  ];
  return (
    <Section title="FAQ" icon="info" defaultOpen={false}>
      <dl className="flex flex-col gap-3">
        {qa.map(([q, a]) => (
          <div key={q}>
            <dt className="text-[13px] font-semibold text-white">{q}</dt>
            <dd className="text-[12px] leading-relaxed text-ink-400">{a}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** Everything a new team member needs to know, in the app itself. */
export function GuidePanel() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-brand/40 bg-brand/10 p-4">
        <p className="text-base font-bold text-white">Artova Designs guide</p>
        <p className="mt-1 text-[12px] leading-relaxed text-ink-300">
          Poster studio for Nepal Scholar, Thesis Companion and Artova Research: {STUDIO_ADS.length} studio designs and {CLASSIC_ADS.length} brand classics, with {THEME_COUNT} logo-based colour themes per page.
        </p>
      </div>
      <Today />
      <HowItWorks />
      <Library />
      <Themes />
      <Pages />
      <Logos />
      <Editing />
      <Export />
      <Privacy />
      <Faq />
    </div>
  );
}
