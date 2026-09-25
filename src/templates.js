// Every template = one layout (see Poster.jsx) + one theme.
// To add a template, append an entry here — nothing else needs to change.

export const SIZES = {
  square: { label: 'Square 1080×1080', w: 1080, h: 1080 },
  portrait: { label: 'Portrait 1080×1350', w: 1080, h: 1350 },
  story: { label: 'Story 1080×1920', w: 1080, h: 1920 },
};

const F = {
  bebas: "'Bebas Neue', 'Mukta', sans-serif",
  anton: "'Anton', 'Mukta', sans-serif",
  playfair: "'Playfair Display', 'Noto Serif Devanagari', serif",
  serif: "'Noto Serif Devanagari', 'Playfair Display', serif",
  mukta: "'Mukta', sans-serif",
  poppins: "'Poppins', 'Mukta', sans-serif",
};

export const TEMPLATES = [
  // Classic — photo on top, headline block below
  { id: 'classic-red', name: 'Classic Red', layout: 'classic',
    theme: { bg: '#ffffff', fg: '#111111', muted: '#555555', accent: '#d7141a', accentFg: '#ffffff', heading: F.mukta, body: F.mukta } },
  { id: 'classic-navy', name: 'Classic Navy', layout: 'classic',
    theme: { bg: '#0f1c3f', fg: '#ffffff', muted: '#b8c2dc', accent: '#ffc53d', accentFg: '#0f1c3f', heading: F.poppins, body: F.poppins } },
  { id: 'classic-cream', name: 'Classic Cream', layout: 'classic',
    theme: { bg: '#f6efe2', fg: '#2b1d12', muted: '#6b5644', accent: '#9c2b1c', accentFg: '#f6efe2', heading: F.playfair, body: F.mukta } },
  { id: 'classic-green', name: 'Classic Green', layout: 'classic',
    theme: { bg: '#ffffff', fg: '#0d2b1d', muted: '#4a6356', accent: '#0a8f4e', accentFg: '#ffffff', heading: F.bebas, body: F.mukta, upper: true } },

  // Full bleed — photo fills the poster, text over a gradient
  { id: 'full-dark', name: 'Full Bleed Dark', layout: 'full',
    theme: { bg: '#000000', fg: '#ffffff', muted: '#d0d0d0', accent: '#e11d2e', accentFg: '#ffffff', heading: F.mukta, body: F.mukta } },
  { id: 'full-blue', name: 'Full Bleed Blue', layout: 'full',
    theme: { bg: '#061a40', fg: '#ffffff', muted: '#c9d7f2', accent: '#29a3ff', accentFg: '#061a40', heading: F.poppins, body: F.poppins } },
  { id: 'full-gold', name: 'Full Bleed Gold', layout: 'full',
    theme: { bg: '#141008', fg: '#fff8e7', muted: '#e6d6b0', accent: '#e8b12a', accentFg: '#141008', heading: F.playfair, body: F.mukta } },
  { id: 'full-impact', name: 'Full Bleed Impact', layout: 'full',
    theme: { bg: '#1a0000', fg: '#ffffff', muted: '#ffd0d0', accent: '#ffe600', accentFg: '#1a0000', heading: F.anton, body: F.mukta, upper: true } },

  // Split — photo on one side, text on the other
  { id: 'split-navy', name: 'Split Navy', layout: 'split',
    theme: { bg: '#10224d', fg: '#ffffff', muted: '#b6c3e3', accent: '#ff5a36', accentFg: '#ffffff', heading: F.poppins, body: F.poppins } },
  { id: 'split-white', name: 'Split White', layout: 'split',
    theme: { bg: '#ffffff', fg: '#151515', muted: '#5c5c5c', accent: '#c8102e', accentFg: '#ffffff', heading: F.mukta, body: F.mukta } },
  { id: 'split-maroon', name: 'Split Maroon', layout: 'split',
    theme: { bg: '#5a0f1f', fg: '#fff4e8', muted: '#f0c9c0', accent: '#f4b400', accentFg: '#3a0913', heading: F.serif, body: F.mukta } },
  { id: 'split-teal', name: 'Split Teal', layout: 'split',
    theme: { bg: '#e8f6f3', fg: '#073b3a', muted: '#3b6664', accent: '#0b7a75', accentFg: '#ffffff', heading: F.bebas, body: F.mukta, upper: true } },

  // Newspaper — framed, masthead, serif headline
  { id: 'paper-classic', name: 'Newspaper', layout: 'paper',
    theme: { bg: '#f4f1ea', fg: '#111111', muted: '#4d4d4d', accent: '#111111', accentFg: '#f4f1ea', heading: F.playfair, body: F.serif } },
  { id: 'paper-red', name: 'Newspaper Red', layout: 'paper',
    theme: { bg: '#ffffff', fg: '#1a1a1a', muted: '#555555', accent: '#b3001b', accentFg: '#ffffff', heading: F.serif, body: F.mukta } },
  { id: 'paper-sepia', name: 'Newspaper Sepia', layout: 'paper',
    theme: { bg: '#efe0c2', fg: '#3b2a17', muted: '#6e5639', accent: '#5b3a1a', accentFg: '#efe0c2', heading: F.playfair, body: F.serif } },
  { id: 'paper-night', name: 'Newspaper Night', layout: 'paper',
    theme: { bg: '#121212', fg: '#f2f2f2', muted: '#a8a8a8', accent: '#f2f2f2', accentFg: '#121212', heading: F.playfair, body: F.mukta } },

  // Bold — big type, colour bands, round photo
  { id: 'bold-lime', name: 'Bold Lime', layout: 'bold',
    theme: { bg: '#111111', fg: '#ffffff', muted: '#bbbbbb', accent: '#c6ff00', accentFg: '#111111', heading: F.anton, body: F.poppins, upper: true } },
  { id: 'bold-orange', name: 'Bold Orange', layout: 'bold',
    theme: { bg: '#ff5a1f', fg: '#ffffff', muted: '#ffe1d3', accent: '#1b1b1b', accentFg: '#ffffff', heading: F.bebas, body: F.poppins, upper: true } },
  { id: 'bold-purple', name: 'Bold Purple', layout: 'bold',
    theme: { bg: '#2d0b59', fg: '#ffffff', muted: '#d7c6f5', accent: '#ff3d8b', accentFg: '#ffffff', heading: F.poppins, body: F.poppins } },
  { id: 'bold-yellow', name: 'Bold Yellow', layout: 'bold',
    theme: { bg: '#ffd400', fg: '#111111', muted: '#3d3500', accent: '#111111', accentFg: '#ffd400', heading: F.anton, body: F.mukta, upper: true } },
];

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
