import { getTemplate, tokenizeHeadline } from '../../engine';
import { PRESETS } from '../../state/defaults';
import { useActivePost, useStore } from '../../state/store';
import { Card, Field, Slider } from '../ui/controls';

export function TextTab() {
  const { state, dispatch, t } = useStore();
  const { post, update } = useActivePost();
  const words = tokenizeHeadline(post.headline);
  const highlighted = new Set(post.highlighted);
  const template = getTemplate(post.templateId);

  return (
    <>
      <Card title={t('headlineTitle')} icon="text">
        <Field label={t('headlineLabel')}>
          {(id) => (
            <textarea
              id={id}
              rows={4}
              value={post.headline}
              placeholder={t('headlinePlaceholder')}
              onChange={(e) => update({ headline: e.target.value })}
            />
          )}
        </Field>

        <div className="field">
          <span className="field__label">{t('wordPickerLabel')}</span>
          <div className="word-picker" role="group" aria-label={t('wordPickerLabel')}>
            {words.length === 0 && <span className="hint">{t('wordPickerEmpty')}</span>}
            {words.map((word, i) => (
              <button
                // index is the identity here: highlights are stored by word position
                key={`${i}-${word}`}
                type="button"
                className={`word-pill ${highlighted.has(i) ? 'is-on' : ''}`}
                aria-pressed={highlighted.has(i)}
                onClick={() => dispatch({ type: 'post/toggleWord', id: post.id, index: i })}
              >
                {word}
              </button>
            ))}
          </div>
          <small className="hint">{t('wordPickerHint')}</small>
        </div>

        <div className="grid-2">
          <Field label={t('speakerLabel')} hint={template.usesSpeaker ? undefined : t('speakerHint')}>
            {(id) => (
              <input
                id={id}
                value={post.speaker}
                placeholder="— नाम, पद"
                onChange={(e) => update({ speaker: e.target.value })}
              />
            )}
          </Field>
          <Field label={t('badgeLabel')} hint={t('badgeHint')}>
            {(id) => <input id={id} value={post.badgeText} onChange={(e) => update({ badgeText: e.target.value })} />}
          </Field>
        </div>
      </Card>

      <Card
        title={t('typographyTitle')}
        icon="sparkles"
        actions={
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => update({ headlineX: 0, headlineY: 0 })}>
            {t('resetPosition')}
          </button>
        }
      >
        <div className="grid-2">
          <Slider label={t('fontSize')} value={post.fontSize} min={30} max={70} unit="px" onChange={(fontSize) => update({ fontSize })} />
          <Slider label={t('lineHeight')} value={post.lineHeight} min={1.1} max={1.8} step={0.05} onChange={(lineHeight) => update({ lineHeight })} />
          <Slider label={t('headlineX')} value={post.headlineX} min={-400} max={400} unit="px" onChange={(headlineX) => update({ headlineX })} />
          <Slider label={t('headlineY')} value={post.headlineY} min={-400} max={400} unit="px" onChange={(headlineY) => update({ headlineY })} />
        </div>
      </Card>

      <Card title={t('presetsTitle')} icon="sparkles">
        <div className="chip-row">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              onClick={() => update({ ...p.patch, headlineX: 0, headlineY: 0, panX: 0, panY: 0, zoom: 100 })}
            >
              {p.label[state.lang]}
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}
