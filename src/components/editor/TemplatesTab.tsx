import { useDeferredValue, useState } from 'react';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../../engine';
import type { TemplateCategory } from '../../engine';
import { useFontsReady } from '../../hooks/useFontsReady';
import { usePosterAssets } from '../../hooks/usePosterAssets';
import { useActivePost, useStore } from '../../state/store';
import { TemplateThumb } from '../preview/TemplateThumb';
import { Card } from '../ui/controls';

const THUMB_WIDTH = 150;

export function TemplatesTab() {
  const { state, dispatch, t } = useStore();
  const { post, update } = useActivePost();
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all');

  // Thumbnails re-render at low priority so typing in the editor stays instant.
  const deferredPost = useDeferredValue(post);
  const deferredBrand = useDeferredValue(state.brand);
  const assets = usePosterAssets(deferredPost.photoSrc, deferredPost.extraPhotoSrcs, deferredBrand.logoSrc);
  const fontsReady = useFontsReady();

  const visible = TEMPLATES.filter((tpl) => category === 'all' || tpl.category === category);

  return (
    <Card
      title={t('templatesTitle')}
      icon="grid"
      actions={
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => dispatch({ type: 'template/applyToAll', templateId: post.templateId })}
        >
          {t('applyToAll')}
        </button>
      }
    >
      <p className="hint">{t('templatesDesc')}</p>
      <div className="chip-row" role="tablist" aria-label="Template categories">
        {TEMPLATE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={category === c.id}
            className={`chip ${category === c.id ? 'is-active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.icon} {t(`cat_${c.id}`)}
          </button>
        ))}
      </div>

      <div className="template-grid">
        {visible.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            className={`template-card ${tpl.id === post.templateId ? 'is-active' : ''}`}
            aria-pressed={tpl.id === post.templateId}
            title={tpl.description}
            onClick={() => update({ templateId: tpl.id })}
          >
            <TemplateThumb
              post={deferredPost}
              templateId={tpl.id}
              brand={deferredBrand}
              ratio={state.ratio}
              assets={assets}
              fontsReady={fontsReady}
              width={THUMB_WIDTH}
            />
            <span className="template-card__name">{state.lang === 'ne' ? tpl.nameNe : tpl.name}</span>
            <span className="template-card__desc">{tpl.description}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
