import { beforeEach, describe, expect, it } from 'vitest';
import { sanitizePersisted } from '../services/storageService';
import { createPoster } from '../services/templateService';
import { selectActivePoster, useEditorStore } from './editorStore';

const store = () => useEditorStore.getState();
const active = () => selectActivePoster(store());

beforeEach(() => {
  const p = createPoster('thesis-support', 'nepal-scholar');
  store().hydrate({ posters: [p], activeId: p.id, brandOverrides: {} });
});

describe('editor store', () => {
  it('edits text and prunes highlights past the new word count', () => {
    const h = active().elements.find((e) => e.role === 'heading')!;
    store().updateData<'text'>(h.id, { text: 'one two three four', highlights: [0, 3] });
    store().updateData<'text'>(h.id, { text: 'one two' });
    const after = active().elements.find((e) => e.id === h.id)!;
    expect(after.type === 'text' && after.data.highlights).toEqual([0]);
  });

  it('toggles highlighted words', () => {
    const h = active().elements.find((e) => e.role === 'heading')!;
    const before = h.type === 'text' ? h.data.highlights : [];
    store().toggleHighlight(h.id, 0);
    const el = active().elements.find((e) => e.id === h.id)!;
    expect(el.type === 'text' && el.data.highlights.includes(0)).toBe(!before.includes(0));
  });

  it('undo / redo restore previous posters', () => {
    store().setRatio('1:1');
    expect(active().ratio).toBe('1:1');
    store().undo();
    expect(active().ratio).toBe('4:5');
    store().redo();
    expect(active().ratio).toBe('1:1');
  });

  it('coalesces rapid typing into one undo step', () => {
    const h = active().elements.find((e) => e.role === 'heading')!;
    const before = store().past.length;
    store().updateData<'text'>(h.id, { text: 'a' });
    store().updateData<'text'>(h.id, { text: 'ab' });
    store().updateData<'text'>(h.id, { text: 'abc' });
    expect(store().past.length).toBe(before + 1);
  });

  it('stores user frames per ratio and resets them', () => {
    const h = active().elements.find((e) => e.role === 'heading')!;
    store().setFrame(h.id, { x: 0, y: 0, w: 0.5, h: 0.1 }, 15);
    let el = active().elements.find((e) => e.id === h.id)!;
    expect(el.userFrames['4:5']).toEqual({ x: 0, y: 0, w: 0.5, h: 0.1 });
    expect(el.rotation).toBe(15);
    store().resetFrame(h.id);
    el = active().elements.find((e) => e.id === h.id)!;
    expect(el.userFrames['4:5']).toBeUndefined();
  });

  it('reorders layers', () => {
    const ids = () => active().elements.map((e) => e.id);
    const first = ids()[0]!;
    store().moveLayer(first, 'front');
    expect(ids().at(-1)).toBe(first);
    store().moveLayer(first, 'back');
    expect(ids()[0]).toBe(first);
  });

  it('switches brand per poster and keeps at least one poster', () => {
    store().setBrand('thesis-companion');
    expect(active().brandId).toBe('thesis-companion');
    store().removePoster(active().id);
    expect(store().posters).toHaveLength(1);
    store().addPoster('tip-quote-einstein');
    expect(store().posters).toHaveLength(2);
    expect(active().templateId).toBe('tip-quote-einstein');
    expect(active().brandId).toBe('thesis-companion');
  });

  it('reset restores template defaults but keeps the poster id and brand', () => {
    const { id } = active();
    store().setBrand('thesis-companion');
    const h = active().elements.find((e) => e.role === 'heading')!;
    store().updateData<'text'>(h.id, { text: 'custom' });
    store().resetPoster();
    const reset = active().elements.find((e) => e.id === h.id)!;
    expect(active().id).toBe(id);
    expect(active().brandId).toBe('thesis-companion');
    expect(reset.type === 'text' && reset.data.text).not.toBe('custom');
  });
});

describe('persistence sanitizing', () => {
  it('rejects unknown versions and empty data', () => {
    expect(sanitizePersisted({ version: 9 })).toBeNull();
    expect(sanitizePersisted({ version: 1, posters: [] })).toBeNull();
  });

  it('repairs invalid fields and fills new template fields', () => {
    const p = createPoster('thesis-support', 'nepal-scholar');
    const heading = p.elements.find((e) => e.role === 'heading')!;
    const raw = JSON.parse(JSON.stringify({ version: 1, posters: [p], activeId: 'missing', brandOverrides: { 'nepal-scholar': { phone: '98' }, bogus: {} } }));
    raw.posters[0].brandId = 'unknown';
    raw.posters[0].ratio = '3:2';
    delete raw.posters[0].elements.find((e: { id: string }) => e.id === heading.id).data.fontSize;
    raw.posters[0].elements.push({ id: 'junk', type: 'video', data: {} });

    const s = sanitizePersisted(raw)!;
    const restored = s.posters[0]!;
    expect(restored.brandId).toBe('nepal-scholar');
    expect(restored.ratio).toBe('4:5');
    expect(s.activeId).toBe(restored.id);
    expect(restored.elements.some((e) => e.id === 'junk')).toBe(false);
    const h = restored.elements.find((e) => e.id === heading.id)!;
    expect(h.type === 'text' && h.data.fontSize).toBeGreaterThan(0);
    expect(Object.keys(s.brandOverrides)).toEqual(['nepal-scholar']);
  });
});
