import { describe, expect, it } from 'vitest';
import { parseCsv } from '../lib/csv';
import { slugify } from '../lib/files';
import { createInitialState, createPost } from './defaults';
import { parseHighlightMarkup, postsFromCsv } from './importPosts';
import { sanitizeState } from './persistence';
import { reducer, selectActivePost } from './reducer';

describe('parseCsv', () => {
  it('handles quotes, escaped quotes, embedded commas/newlines and BOM', () => {
    const rows = parseCsv(String.fromCharCode(0xfeff) + 'headline,speaker\r\n"a, ""b""\nc",x\n');
    expect(rows).toEqual([{ headline: 'a, "b"\nc', speaker: 'x' }]);
  });
  it('lower-cases headers and skips blank lines', () => {
    expect(parseCsv('Headline\n\nfoo\n')).toEqual([{ headline: 'foo' }]);
  });
});

describe('parseHighlightMarkup', () => {
  it('turns *marked* words (and spans) into indices', () => {
    expect(parseHighlightMarkup('नेपाल *प्रिमियर लिग* सुरु *आज*')).toEqual({
      headline: 'नेपाल प्रिमियर लिग सुरु आज',
      highlighted: [1, 2, 4],
    });
  });
});

describe('postsFromCsv', () => {
  it('maps columns and falls back for unknown templates', () => {
    const [post] = postsFromCsv('template,headline,photo2\nbogus,*Big* news,https://x/y.jpg\n', 'classic', '१ बैशाख');
    expect(post?.templateId).toBe('classic');
    expect(post?.headline).toBe('Big news');
    expect(post?.highlighted).toEqual([0]);
    expect(post?.date).toBe('१ बैशाख');
    expect(post?.extraPhotoSrcs).toEqual(['https://x/y.jpg']);
  });
});

describe('reducer', () => {
  const base = () => {
    const s = createInitialState();
    return { ...s, posts: [createPost({ id: 'a', headline: 'one two three', highlighted: [0, 2] })], activeId: 'a' };
  };

  it('toggles highlighted words', () => {
    const s = reducer(base(), { type: 'post/toggleWord', id: 'a', index: 1 });
    expect(selectActivePost(s).highlighted).toEqual([0, 1, 2]);
    const s2 = reducer(s, { type: 'post/toggleWord', id: 'a', index: 0 });
    expect(selectActivePost(s2).highlighted).toEqual([1, 2]);
  });

  it('prunes highlights that point past the end of an edited headline', () => {
    const s = reducer(base(), { type: 'post/update', id: 'a', patch: { headline: 'one two' } });
    expect(selectActivePost(s).highlighted).toEqual([0]);
  });

  it('never removes the last post', () => {
    const s = base();
    expect(reducer(s, { type: 'post/remove', id: 'a' })).toBe(s);
  });

  it('duplicates next to the source and selects the copy', () => {
    const s = reducer(base(), { type: 'post/duplicate', id: 'a' });
    expect(s.posts).toHaveLength(2);
    expect(s.activeId).toBe(s.posts[1]?.id);
    expect(s.posts[1]?.headline).toBe('one two three');
  });

  it('applies a template to every post', () => {
    let s = reducer(base(), { type: 'post/add' });
    s = reducer(s, { type: 'template/applyToAll', templateId: 'breaking' });
    expect(s.posts.every((p) => p.templateId === 'breaking')).toBe(true);
  });

  it('returns the same state object for no-op updates', () => {
    const s = base();
    expect(reducer(s, { type: 'settings/ratio', ratio: s.ratio })).toBe(s);
  });
});

describe('sanitizeState', () => {
  it('rejects unknown versions and empty post lists', () => {
    expect(sanitizeState({ version: 1, posts: [{}] })).toBeNull();
    expect(sanitizeState({ version: 2, posts: [] })).toBeNull();
  });
  it('clamps numbers and repairs invalid fields', () => {
    const s = sanitizeState({
      version: 2,
      ratio: '3:2',
      brand: { primary: 'red', socials: ['x', 'myspace'] },
      posts: [{ id: 'p', templateId: 'ghost', fontSize: 999, highlighted: [1, -1, 'a'] }],
    });
    expect(s?.ratio).toBe('1:1');
    expect(s?.brand.primary).toBe('#df1c24');
    expect(s?.brand.socials).toEqual(['x']);
    expect(s?.posts[0]?.templateId).toBe('classic');
    expect(s?.posts[0]?.fontSize).toBe(70);
    expect(s?.posts[0]?.highlighted).toEqual([1]);
    expect(s?.activeId).toBe('p');
  });
});

describe('slugify', () => {
  it('keeps Devanagari including vowel signs', () => {
    expect(slugify('नेपाल प्रिमियर लिग!')).toBe('नेपाल-प्रिमियर-लिग');
  });
  it('falls back when nothing usable remains', () => {
    expect(slugify('!!!', 'x')).toBe('x');
  });
});
