import { SOCIAL_NETWORKS } from '../../engine';
import type { SocialNetwork } from '../../engine';
import { fileToOptimizedDataUrl } from '../../lib/images';
import { todayBs } from '../../lib/nepaliDate';
import { useActivePost, useStore } from '../../state/store';
import { Card, Field, FileButton } from '../ui/controls';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/Toast';

const SOCIAL_LABEL: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  youtube: 'YouTube',
  x: 'X / Twitter',
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

export function BrandTab() {
  const { state, dispatch, t } = useStore();
  const { post, update } = useActivePost();
  const toast = useToast();
  const { brand } = state;
  const setBrand = (patch: Partial<typeof brand>) => dispatch({ type: 'brand/update', patch });

  const toggleSocial = (network: SocialNetwork) => {
    const on = new Set(brand.socials);
    if (on.has(network)) on.delete(network);
    else on.add(network);
    setBrand({ socials: SOCIAL_NETWORKS.filter((n) => on.has(n)) });
  };

  return (
    <>
      <Card title={t('dateTitle')} icon="calendar">
        <Field label={t('dateLabel')}>
          {(id) => (
            <div className="input-with-button">
              <input id={id} value={post.date} placeholder="९ आश्विन २०८३" onChange={(e) => update({ date: e.target.value })} />
              <button type="button" className="btn btn--secondary" onClick={() => update({ date: todayBs() })}>
                <Icon name="calendar" size={16} /> {t('today')}
              </button>
            </div>
          )}
        </Field>
      </Card>

      <Card title={t('brandTitle')} icon="globe">
        <div className="field">
          <span className="field__label">{t('logo')}</span>
          <div className="logo-row">
            {brand.logoSrc ? <img className="logo-preview" src={brand.logoSrc} alt="" /> : <span className="logo-empty">{brand.name}</span>}
            <FileButton
              accept="image/*"
              className="btn btn--secondary btn--sm"
              onFile={(f) =>
                void fileToOptimizedDataUrl(f, 800)
                  .then((logoSrc) => setBrand({ logoSrc }))
                  .catch(() => toast(t('toastPhotoFailed'), 'error'))
              }
            >
              <Icon name="upload" size={14} /> {t('upload')}
            </FileButton>
            {brand.logoSrc && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setBrand({ logoSrc: '' })}>
                {t('remove')}
              </button>
            )}
          </div>
          <small className="hint">{t('logoHint')}</small>
        </div>

        <div className="grid-2">
          <Field label={t('brandName')}>
            {(id) => <input id={id} value={brand.name} onChange={(e) => setBrand({ name: e.target.value })} />}
          </Field>
          <Field label={t('website')}>
            {(id) => <input id={id} value={brand.websiteUrl} onChange={(e) => setBrand({ websiteUrl: e.target.value })} />}
          </Field>
        </div>
        <Field label={t('commentTag')}>
          {(id) => <input id={id} value={brand.commentTag} onChange={(e) => setBrand({ commentTag: e.target.value })} />}
        </Field>

        <div className="field">
          <span className="field__label">{t('colors')}</span>
          <div className="grid-2">
            <label className="color-input">
              <input type="color" value={brand.primary} onChange={(e) => setBrand({ primary: e.target.value })} />
              <span>{t('primary')}</span>
            </label>
            <label className="color-input">
              <input type="color" value={brand.secondary} onChange={(e) => setBrand({ secondary: e.target.value })} />
              <span>{t('secondary')}</span>
            </label>
          </div>
        </div>

        <fieldset className="field">
          <legend className="field__label">{t('socialsLabel')}</legend>
          <div className="chip-row">
            {SOCIAL_NETWORKS.map((n) => (
              <label key={n} className={`chip chip--check ${brand.socials.includes(n) ? 'is-active' : ''}`}>
                <input type="checkbox" checked={brand.socials.includes(n)} onChange={() => toggleSocial(n)} />
                {SOCIAL_LABEL[n]}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="checkbox">
          <input type="checkbox" checked={brand.showMap} onChange={(e) => setBrand({ showMap: e.target.checked })} />
          {t('showMap')}
        </label>
      </Card>
    </>
  );
}
