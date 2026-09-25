import { DEFAULT_TEMPLATE_ID, SOCIAL_NETWORKS } from '../engine';
import type { AspectRatio, Brand, Lang, Post } from '../engine';
import { todayBs } from '../lib/nepaliDate';

export interface AppState {
  version: 2;
  lang: Lang;
  ratio: AspectRatio;
  brand: Brand;
  posts: Post[];
  activeId: string;
}

export const MAX_EXTRA_PHOTOS = 3;

export const newId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

/** CORS-enabled sample photos (same set the reference offers). */
export const SAMPLE_PHOTOS = [
  { id: 'politics', label: 'Politics / Conference', src: unsplash('photo-1541872703-74c5e44368f9') },
  { id: 'sports', label: 'Sports', src: unsplash('photo-1508098682722-e99c43a406b2') },
  { id: 'tech', label: 'Tech & AI', src: unsplash('photo-1526778548025-fa2f459cd5c1') },
  { id: 'weather', label: 'Weather', src: unsplash('photo-1516912481808-3406841bd33c') },
  { id: 'landscape', label: 'Landscape', src: unsplash('photo-1542273917363-3b1817f69a2d') },
] as const;

/** Typography & photo defaults — identical to the reference's defaultState. */
export const POST_LAYOUT_DEFAULTS = {
  photoFit: 'cover',
  zoom: 100,
  panX: 0,
  panY: 0,
  gradientHeight: 55,
  fontSize: 48,
  lineHeight: 1.35,
  headlineX: 0,
  headlineY: 0,
} as const satisfies Partial<Post>;

export function createPost(overrides: Partial<Post> = {}): Post {
  return {
    id: newId(),
    templateId: DEFAULT_TEMPLATE_ID,
    headline: '',
    highlighted: [],
    speaker: '',
    badgeText: '',
    date: todayBs(),
    photoSrc: '',
    extraPhotoSrcs: [],
    ...POST_LAYOUT_DEFAULTS,
    ...overrides,
  };
}

export const DEFAULT_BRAND: Brand = {
  name: 'KrantiPatra',
  logoSrc: '',
  websiteUrl: 'www.krantipatra.com',
  commentTag: 'पूरा समाचार कमेन्टमा',
  primary: '#df1c24',
  secondary: '#1352a2',
  socials: [...SOCIAL_NETWORKS],
  showMap: true,
};

export interface Preset {
  id: string;
  label: { en: string; ne: string };
  patch: Partial<Post>;
}

/** Quick sample content (the reference's "Sample Templates" buttons). */
export const PRESETS: Preset[] = [
  {
    id: 'ai',
    label: { en: 'AI & Trump News', ne: 'ट्रम्प र एआई समाचार' },
    patch: {
      headline: "एआई विकास सुस्त पार्ने माग ट्रम्पद्वारा अस्वीकार, 'चीनभन्दा अगाडि रहनुपर्छ'",
      highlighted: [3, 4],
      speaker: '— डोनाल्ड ट्रम्प, अमेरिकी राष्ट्रपति',
      photoSrc: SAMPLE_PHOTOS[0].src,
    },
  },
  {
    id: 'sports',
    label: { en: 'Nepal Sports News', ne: 'नेपाल खेलकुद खबर' },
    patch: {
      headline: 'नेपाल प्रिमियर लिग: काठमाडौं गुर्खाजद्वारा पोखरा एभेन्जर्स पराजित',
      highlighted: [0, 1, 3, 4],
      speaker: '— नेपाल क्रिकेट सङ्घ (CAN)',
      photoSrc: SAMPLE_PHOTOS[1].src,
      templateId: 'sports',
    },
  },
  {
    id: 'weather',
    label: { en: 'Weather Alert', ne: 'मौसम तथा जलवायु अपडेट' },
    patch: {
      headline: 'देशभर आगामी तीन दिन वर्षा र हिमपातको सम्भावना, सतर्कता अपनाउन आग्रह',
      highlighted: [4, 5, 7],
      speaker: '— जल तथा मौसम विज्ञान विभाग',
      photoSrc: SAMPLE_PHOTOS[3].src,
      templateId: 'weather',
    },
  },
  {
    id: 'photo',
    label: { en: '📷 Photo & Dual Line', ne: '📷 फोटो र दुईरङ्गी रेखा' },
    patch: { headline: '', highlighted: [], templateId: 'purephoto', photoSrc: SAMPLE_PHOTOS[4].src },
  },
];

export function createInitialState(): AppState {
  const first = createPost(PRESETS[0]?.patch);
  return { version: 2, lang: 'en', ratio: '1:1', brand: DEFAULT_BRAND, posts: [first], activeId: first.id };
}
