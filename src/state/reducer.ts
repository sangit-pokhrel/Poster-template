import { tokenizeHeadline } from '../engine';
import type { AspectRatio, Brand, Lang, Post } from '../engine';
import { createInitialState, createPost, newId } from './defaults';
import type { AppState } from './defaults';

export type PostPatch = Partial<Omit<Post, 'id'>>;

export type Action =
  | { type: 'post/update'; id: string; patch: PostPatch }
  | { type: 'post/toggleWord'; id: string; index: number }
  | { type: 'post/add' }
  | { type: 'post/duplicate'; id: string }
  | { type: 'post/remove'; id: string }
  | { type: 'post/select'; id: string }
  | { type: 'post/import'; posts: Post[]; replace: boolean }
  | { type: 'template/applyToAll'; templateId: string }
  | { type: 'brand/update'; patch: Partial<Brand> }
  | { type: 'settings/ratio'; ratio: AspectRatio }
  | { type: 'settings/lang'; lang: Lang }
  | { type: 'reset' };

function mapPost(state: AppState, id: string, fn: (p: Post) => Post): AppState {
  let changed = false;
  const posts = state.posts.map((p) => {
    if (p.id !== id) return p;
    const next = fn(p);
    changed = next !== p;
    return next;
  });
  return changed ? { ...state, posts } : state;
}

/** Keeps highlight indices valid when the headline text changes. */
function pruneHighlights(post: Post): Post {
  const count = tokenizeHeadline(post.headline).length;
  const highlighted = post.highlighted.filter((i) => i < count);
  return highlighted.length === post.highlighted.length ? post : { ...post, highlighted };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'post/update':
      return mapPost(state, action.id, (p) => {
        const next = { ...p, ...action.patch };
        return action.patch.headline !== undefined ? pruneHighlights(next) : next;
      });

    case 'post/toggleWord':
      return mapPost(state, action.id, (p) => {
        const set = new Set(p.highlighted);
        if (set.has(action.index)) set.delete(action.index);
        else set.add(action.index);
        return { ...p, highlighted: [...set].sort((a, b) => a - b) };
      });

    case 'post/add': {
      const active = state.posts.find((p) => p.id === state.activeId);
      const post = createPost({ templateId: active?.templateId, date: active?.date });
      return { ...state, posts: [...state.posts, post], activeId: post.id };
    }

    case 'post/duplicate': {
      const index = state.posts.findIndex((p) => p.id === action.id);
      const source = state.posts[index];
      if (!source) return state;
      const copy = { ...source, id: newId(), highlighted: [...source.highlighted], extraPhotoSrcs: [...source.extraPhotoSrcs] };
      const posts = [...state.posts.slice(0, index + 1), copy, ...state.posts.slice(index + 1)];
      return { ...state, posts, activeId: copy.id };
    }

    case 'post/remove': {
      if (state.posts.length <= 1) return state;
      const index = state.posts.findIndex((p) => p.id === action.id);
      if (index < 0) return state;
      const posts = state.posts.filter((p) => p.id !== action.id);
      const activeId =
        state.activeId === action.id ? (posts[Math.min(index, posts.length - 1)]?.id ?? state.activeId) : state.activeId;
      return { ...state, posts, activeId };
    }

    case 'post/select':
      return state.posts.some((p) => p.id === action.id) ? { ...state, activeId: action.id } : state;

    case 'post/import': {
      if (action.posts.length === 0) return state;
      const posts = action.replace ? action.posts : [...state.posts, ...action.posts];
      return { ...state, posts, activeId: action.posts[0]?.id ?? state.activeId };
    }

    case 'template/applyToAll':
      return { ...state, posts: state.posts.map((p) => ({ ...p, templateId: action.templateId })) };

    case 'brand/update':
      return { ...state, brand: { ...state.brand, ...action.patch } };

    case 'settings/ratio':
      return state.ratio === action.ratio ? state : { ...state, ratio: action.ratio };

    case 'settings/lang':
      return state.lang === action.lang ? state : { ...state, lang: action.lang };

    case 'reset': {
      const fresh = createInitialState();
      return { ...fresh, lang: state.lang };
    }
  }
}

export const selectActivePost = (state: AppState): Post =>
  state.posts.find((p) => p.id === state.activeId) ?? (state.posts[0] as Post);
