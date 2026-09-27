import { memo, useMemo } from 'react';
import { BRANDS } from '../../data/brands';
import { getAd } from '../../design/registry';
import { useExportActions } from '../../hooks/useExportActions';
import { useImageUrl } from '../../hooks/useImageUrl';
import { useThumbnail } from '../../hooks/useThumbnail';
import { UploadError, importImageFile } from '../../services/imageService';
import { useEditorStore } from '../../store/editorStore';
import { buildEnv, posterTheme, useActivePoster, useBrandFor } from '../../store/selectors';
import type { BrandOverrides, BrandPalette } from '../../types/brand';
import type { Poster } from '../../types/poster';
import { Button, ColorInput, Dropzone, IconButton, Section, cx } from '../common/controls';
import { confirm, toast } from '../common/feedback';

const PosterRow = memo(function PosterRow({ poster, index, active, overrides }: { poster: Poster; index: number; active: boolean; overrides: BrandOverrides | undefined }) {
  const setActivePoster = useEditorStore((s) => s.setActivePoster);
  const duplicatePoster = useEditorStore((s) => s.duplicatePoster);
  const removePoster = useEditorStore((s) => s.removePoster);
  const count = useEditorStore((s) => s.posters.length);
  const env = useMemo(() => buildEnv(poster, overrides, 'export'), [poster, overrides]);
  const thumb = useThumbnail(`${poster.id}:${poster.updatedAt}:${posterTheme(poster, overrides).index}:${JSON.stringify(overrides ?? {})}`, poster, poster.ratio, env, 120);
  const heading = poster.elements.find((e) => e.type === 'text' && (e.role === 'heading' || e.role === 'quote'));
  const title = heading?.type === 'text' ? heading.data.text : getAd(poster.templateId).name;

  const onDelete = async () => {
    if (await confirm({ title: 'Delete this poster?', message: 'This removes it from the list. You can undo with Ctrl+Z.', confirmLabel: 'Delete', danger: true })) {
      removePoster(poster.id);
    }
  };

  return (
    <li className={cx('flex items-center gap-3 rounded-xl border p-2 transition', active ? 'border-brand bg-brand/5' : 'border-ink-800 hover:border-ink-700')}>
      <button type="button" onClick={() => setActivePoster(poster.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="w-5 text-right text-xs tabular-nums text-ink-500">{index + 1}</span>
        <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-md bg-ink-950">
          {thumb ? <img src={thumb} alt="" className="max-h-full max-w-full" /> : <div className="size-full animate-pulse bg-ink-800" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{title}</p>
          <p className="truncate text-[11px] text-ink-400">
            {BRANDS[poster.brandId].name} · {getAd(poster.templateId).name} · {poster.ratio}
          </p>
        </div>
      </button>
      <IconButton icon="copy" label="Duplicate poster" className="size-7" onClick={() => duplicatePoster(poster.id)} />
      <IconButton icon="trash" label="Delete poster" className="size-7" disabled={count <= 1} onClick={() => void onDelete()} />
    </li>
  );
});

function BrandKit() {
  const poster = useActivePoster();
  const brand = useBrandFor(poster.brandId);
  const overrides = useEditorStore((s) => s.brandOverrides[poster.brandId]);
  const updateBrand = useEditorStore((s) => s.updateBrand);
  const logoUrl = useImageUrl(brand.assets.logo);
  const keys: ReadonlyArray<{ key: keyof BrandPalette; label: string }> = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent / highlight' },
    { key: 'ink', label: 'Text' },
    { key: 'paper', label: 'Paper' },
  ];

  const onLogo = async (file: File) => {
    try {
      updateBrand(brand.id, { logo: await importImageFile(file) });
      toast.success('Logo updated');
    } catch (e) {
      toast.error(e instanceof UploadError ? e.message : 'This image could not be read.');
    }
  };

  return (
    <Section title={`Brand kit · ${brand.name}`} icon="palette" defaultOpen={false}>
      <div className="flex items-center gap-3">
        <div className="grid size-20 shrink-0 place-items-center rounded-lg bg-white p-2">{logoUrl && <img src={logoUrl} alt={`${brand.name} logo`} className="max-h-full max-w-full" />}</div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Dropzone compact label="Replace logo (transparent PNG)" onFile={(f) => void onLogo(f)} />
          {overrides?.logo && (
            <Button size="sm" variant="ghost" icon="reset" onClick={() => updateBrand(brand.id, { logo: undefined })}>
              Use original logo
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {keys.map(({ key, label }) => (
          <ColorInput key={key} label={label} value={brand.palette[key]} onChange={(v) => updateBrand(brand.id, { palette: { [key]: v } })} />
        ))}
      </div>
      {overrides?.palette && Object.keys(overrides.palette).length > 0 && (
        <Button size="sm" variant="ghost" icon="reset" onClick={() => updateBrand(brand.id, { palette: Object.fromEntries(keys.map((k) => [k.key, BRANDS[brand.id].palette[k.key]])) })}>
          Restore brand colours
        </Button>
      )}
      <a href={brand.facebookUrl} target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline">
        Open {brand.name} on Facebook ↗
      </a>
    </Section>
  );
}

/** Many posters per session + ZIP export of all of them. */
export function PostersPanel() {
  const posters = useEditorStore((s) => s.posters);
  const activeId = useEditorStore((s) => s.activeId);
  const overrides = useEditorStore((s) => s.brandOverrides);
  const addPoster = useEditorStore((s) => s.addPoster);
  const { busy, progress, downloadAll } = useExportActions();

  return (
    <div className="flex flex-col gap-4">
      <Section
        title={`Posters (${posters.length})`}
        icon="posters"
        actions={
          <Button size="sm" icon="plus" onClick={() => addPoster()}>
            New
          </Button>
        }
      >
        <p className="text-[11px] text-ink-400">Each poster keeps its own template, brand, text and photos. New posters copy the current template.</p>
        <ol className="flex flex-col gap-1.5">
          {posters.map((p, i) => (
            <PosterRow key={p.id} poster={p} index={i} active={p.id === activeId} overrides={overrides[p.brandId]} />
          ))}
        </ol>
        <Button variant="primary" icon="download" disabled={busy} onClick={() => void downloadAll()}>
          {progress ? `Rendering ${progress.done}/${progress.total}…` : `Download all ${posters.length} (ZIP)`}
        </Button>
      </Section>
      <BrandKit />
    </div>
  );
}
