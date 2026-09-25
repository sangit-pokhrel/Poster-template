import { useState } from 'react';
import { ASPECT_RATIOS, ASPECT_RATIO_KEYS } from '../../engine';
import type { AspectRatio, PhotoFit } from '../../engine';
import { fileToOptimizedDataUrl } from '../../lib/images';
import { MAX_EXTRA_PHOTOS, SAMPLE_PHOTOS } from '../../state/defaults';
import { useActivePost, useStore } from '../../state/store';
import { Card, Dropzone, Field, FileButton, Segmented, Slider } from '../ui/controls';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/Toast';

export function PhotoTab() {
  const { state, dispatch, t } = useStore();
  const { post, update } = useActivePost();
  const toast = useToast();
  const [urlDraft, setUrlDraft] = useState('');

  const withFile = async (file: File, apply: (src: string) => void) => {
    try {
      apply(await fileToOptimizedDataUrl(file));
    } catch {
      toast(t('toastPhotoFailed'), 'error');
    }
  };

  const setMainPhoto = (photoSrc: string) => update({ photoSrc, panX: 0, panY: 0, zoom: 100 });

  const setExtra = (index: number, src: string) => {
    const next = [...post.extraPhotoSrcs];
    if (src) next[index] = src;
    else next.splice(index, 1);
    update({ extraPhotoSrcs: next.filter(Boolean).slice(0, MAX_EXTRA_PHOTOS) });
  };

  const commitUrl = () => {
    const url = urlDraft.trim();
    if (/^https?:\/\//i.test(url)) {
      setMainPhoto(url);
      setUrlDraft('');
    }
  };

  return (
    <>
      <Card title={t('uploadTitle')} icon="image">
        {post.photoSrc && (
          <div className="photo-current">
            <img src={post.photoSrc} alt="" />
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => update({ photoSrc: '' })}>
              <Icon name="trash" size={14} /> {t('remove')}
            </button>
          </div>
        )}
        <Dropzone text={t('dropzoneText')} hint={t('fileHint')} onFile={(f) => void withFile(f, setMainPhoto)} />
        <Field label={t('photoUrl')}>
          {(id) => (
            <input
              id={id}
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onBlur={commitUrl}
              onKeyDown={(e) => e.key === 'Enter' && commitUrl()}
            />
          )}
        </Field>

        <div className="field">
          <span className="field__label">{t('extraPhotosLabel')}</span>
          <div className="slot-grid">
            {Array.from({ length: MAX_EXTRA_PHOTOS }, (_, i) => {
              const src = post.extraPhotoSrcs[i];
              return (
                <div key={i} className={`slot ${src ? 'has-image' : ''}`}>
                  {src ? (
                    <>
                      <img src={src} alt="" />
                      <button type="button" className="slot__remove" aria-label={t('remove')} onClick={() => setExtra(i, '')}>
                        <Icon name="x" size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="slot__label">{t('photoN', { n: i + 2 })}</span>
                      <FileButton
                        accept="image/*"
                        onFile={(f) => void withFile(f, (s) => setExtra(Math.min(i, post.extraPhotoSrcs.length), s))}
                      >
                        <Icon name="plus" size={14} /> {t('upload')}
                      </FileButton>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="field">
          <span className="field__label">{t('samplesLabel')}</span>
          <div className="chip-row">
            {SAMPLE_PHOTOS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`chip ${post.photoSrc === p.src ? 'is-active' : ''}`}
                onClick={() => setMainPhoto(p.src)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card
        title={t('adjustTitle')}
        icon="layers"
        actions={
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => update({ zoom: 100, panX: 0, panY: 0 })}>
            {t('resetPhoto')}
          </button>
        }
      >
        <div className="field">
          <span className="field__label">{t('ratioLabel')}</span>
          <Segmented<AspectRatio>
            label={t('ratioLabel')}
            value={state.ratio}
            onChange={(ratio) => dispatch({ type: 'settings/ratio', ratio })}
            options={ASPECT_RATIO_KEYS.map((r) => ({ value: r, label: `${ASPECT_RATIOS[r].icon} ${r}` }))}
          />
        </div>
        <div className="field">
          <span className="field__label">{t('fitLabel')}</span>
          <Segmented<PhotoFit>
            label={t('fitLabel')}
            value={post.photoFit}
            onChange={(photoFit) => update({ photoFit })}
            options={[
              { value: 'cover', label: t('fitCover') },
              { value: 'contain', label: t('fitContain') },
            ]}
          />
        </div>
        <Slider label={t('zoom')} value={post.zoom} min={50} max={250} unit="%" onChange={(zoom) => update({ zoom })} />
        <div className="grid-2">
          <Slider label={t('panX')} value={post.panX} min={-600} max={600} unit="px" onChange={(panX) => update({ panX })} />
          <Slider label={t('panY')} value={post.panY} min={-600} max={600} unit="px" onChange={(panY) => update({ panY })} />
        </div>
        <Slider
          label={t('gradient')}
          value={post.gradientHeight}
          min={30}
          max={80}
          unit="%"
          onChange={(gradientHeight) => update({ gradientHeight })}
        />
      </Card>
    </>
  );
}
