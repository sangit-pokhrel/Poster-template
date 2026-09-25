import { forwardRef } from 'react';
import { SIZES } from './templates';

// Shrink the headline as it gets longer so it always fits.
function headlineSize(text, base) {
  const n = (text || '').length;
  if (n <= 30) return base;
  if (n <= 60) return base * 0.82;
  if (n <= 100) return base * 0.66;
  if (n <= 150) return base * 0.54;
  return base * 0.44;
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function Photo({ src, t, style }) {
  const box = { overflow: 'hidden', position: 'relative', ...style };
  if (!src) {
    return <div style={{ ...box, background: `linear-gradient(135deg, ${t.accent} 0%, ${t.muted} 100%)`, opacity: 0.85 }} />;
  }
  return (
    <div style={box}>
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}

function Tag({ d, t, style }) {
  if (!d.category) return null;
  return (
    <span
      style={{
        display: 'inline-block', alignSelf: 'flex-start', background: t.accent, color: t.accentFg,
        padding: '8px 22px', fontWeight: 800, fontSize: 28, letterSpacing: 2,
        textTransform: 'uppercase', fontFamily: t.body, lineHeight: 1.3, ...style,
      }}
    >
      {d.category}
    </span>
  );
}

function Headline({ d, t, base, style }) {
  return (
    <h1
      style={{
        margin: 0, fontFamily: t.heading, fontWeight: 800, color: t.fg,
        fontSize: headlineSize(d.headline, base), lineHeight: t.upper ? 1.05 : 1.2,
        textTransform: t.upper ? 'uppercase' : 'none', letterSpacing: t.upper ? 1 : 0,
        wordBreak: 'break-word', ...style,
      }}
    >
      {d.headline || 'Your headline goes here'}
    </h1>
  );
}

function Summary({ d, t, size = 32, style }) {
  if (!d.summary) return null;
  return (
    <p style={{ margin: 0, fontFamily: t.body, fontSize: size, lineHeight: 1.45, color: t.muted, ...style }}>
      {d.summary}
    </p>
  );
}

function Brand({ b, t, color, size = 34 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {b.logo && <img src={b.logo} alt="" style={{ height: size * 1.6, width: 'auto', objectFit: 'contain' }} />}
      {b.brand && (
        <span style={{ fontFamily: t.heading, fontWeight: 800, fontSize: size, color: color || t.fg, lineHeight: 1.1 }}>
          {b.brand}
        </span>
      )}
    </div>
  );
}

function Footer({ d, b, t, color, border = true }) {
  const meta = [formatDate(d.date), d.source].filter(Boolean).join('  •  ');
  const links = [b.website, b.handle].filter(Boolean).join('  |  ');
  return (
    <div
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
        borderTop: border ? `3px solid ${t.accent}` : 'none', paddingTop: border ? 24 : 0,
        color: color || t.muted, fontFamily: t.body, fontSize: 26,
      }}
    >
      <Brand b={b} t={t} color={color} size={30} />
      <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
        {meta && <div>{meta}</div>}
        {links && <div style={{ fontWeight: 600 }}>{links}</div>}
      </div>
    </div>
  );
}

/* ---------- Layouts ---------- */

function Classic({ d, b, t, h }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', flex: `0 0 ${h > 1400 ? 52 : 50}%` }}>
        <Photo src={d.image} t={t} style={{ position: 'absolute', inset: 0 }} />
        <Tag d={d} t={t} style={{ position: 'absolute', left: 56, bottom: -24 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22, padding: '56px 56px 44px', borderLeft: `14px solid ${t.accent}` }}>
        <Headline d={d} t={t} base={76} />
        <Summary d={d} t={t} />
        <div style={{ marginTop: 'auto' }}>
          <Footer d={d} b={b} t={t} />
        </div>
      </div>
    </div>
  );
}

function Full({ d, b, t }) {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Photo src={d.image} t={t} style={{ position: 'absolute', inset: 0 }} />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, ${t.bg}66 0%, transparent 25%, transparent 35%, ${t.bg}dd 65%, ${t.bg} 100%)`,
        }}
      />
      <div style={{ position: 'absolute', top: 48, left: 56, right: 56 }}>
        <Brand b={b} t={t} size={36} />
      </div>
      <div style={{ position: 'absolute', left: 56, right: 56, bottom: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Tag d={d} t={t} />
        <Headline d={d} t={t} base={84} />
        <Summary d={d} t={t} />
        <Footer d={d} b={{ ...b, logo: '', brand: '' }} t={t} />
      </div>
    </div>
  );
}

function Split({ d, b, t, w, h }) {
  const stacked = h / w > 1.5;
  return (
    <div style={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', height: '100%' }}>
      <Photo src={d.image} t={t} style={{ flex: '0 0 48%' }} />
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: 26, padding: 52,
          borderTop: stacked ? `14px solid ${t.accent}` : 'none', borderLeft: stacked ? 'none' : `14px solid ${t.accent}`,
        }}
      >
        <Brand b={b} t={t} size={30} />
        <Tag d={d} t={t} style={{ marginTop: stacked ? 8 : 'auto' }} />
        <Headline d={d} t={t} base={stacked ? 84 : 64} />
        <Summary d={d} t={t} size={28} />
        <div style={{ marginTop: 'auto', color: t.muted, fontFamily: t.body, fontSize: 24, lineHeight: 1.5 }}>
          <div style={{ height: 3, background: t.accent, marginBottom: 18 }} />
          <div>{[formatDate(d.date), d.source].filter(Boolean).join('  •  ')}</div>
          <div style={{ fontWeight: 600 }}>{[b.website, b.handle].filter(Boolean).join('  |  ')}</div>
        </div>
      </div>
    </div>
  );
}

function Paper({ d, b, t }) {
  const rule = { height: 0, borderTop: `2px solid ${t.fg}`, borderBottom: `1px solid ${t.fg}`, paddingTop: 4 };
  return (
    <div style={{ height: '100%', padding: 40, boxSizing: 'border-box' }}>
      <div
        style={{
          height: '100%', boxSizing: 'border-box', border: `3px solid ${t.fg}`, padding: '32px 44px',
          display: 'flex', flexDirection: 'column', gap: 22,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {b.logo || b.brand ? <Brand b={b} t={t} size={52} /> : <span style={{ fontFamily: t.heading, fontSize: 52, fontWeight: 900 }}>The Daily</span>}
        </div>
        <div style={rule} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: t.body, fontSize: 24, color: t.muted, marginTop: -8 }}>
          <span>{formatDate(d.date)}</span>
          <span style={{ fontWeight: 700, color: t.accent === t.fg ? t.fg : t.accent, textTransform: 'uppercase', letterSpacing: 2 }}>{d.category}</span>
          <span>{b.website}</span>
        </div>
        <div style={{ ...rule, marginTop: -8 }} />
        <Headline d={d} t={t} base={80} style={{ textAlign: 'center', fontWeight: 900 }} />
        <Photo src={d.image} t={t} style={{ flex: 1, minHeight: 200, border: `2px solid ${t.fg}` }} />
        <Summary d={d} t={t} size={28} style={{ textAlign: 'center', fontStyle: 'italic' }} />
        {(d.source || b.handle) && (
          <div style={{ textAlign: 'center', fontFamily: t.body, fontSize: 22, color: t.muted }}>
            {[d.source, b.handle].filter(Boolean).join('  •  ')}
          </div>
        )}
      </div>
    </div>
  );
}

function Bold({ d, b, t, w }) {
  const circle = Math.round(w * 0.42);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ background: t.accent, color: t.accentFg, padding: '28px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: t.heading, fontSize: 56, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 3, lineHeight: 1.1 }}>
          {d.category || 'News'}
        </span>
        <Brand b={b} t={t} color={t.accentFg} size={30} />
      </div>
      <div style={{ flex: 1, padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 28, position: 'relative' }}>
        <Headline d={d} t={t} base={112} style={{ paddingRight: 0 }} />
        <Summary d={d} t={t} size={30} style={{ maxWidth: w - circle - 60 }} />
        <Photo
          src={d.image}
          t={t}
          style={{
            width: circle, height: circle, borderRadius: '50%', border: `12px solid ${t.accent}`,
            marginTop: 'auto', alignSelf: 'flex-end', flexShrink: 0,
          }}
        />
      </div>
      <div style={{ padding: '0 56px 40px' }}>
        <Footer d={d} b={{ ...b, logo: '', brand: '' }} t={t} />
      </div>
    </div>
  );
}

const LAYOUTS = { classic: Classic, full: Full, split: Split, paper: Paper, bold: Bold };

// Renders a poster at its real pixel size (e.g. 1080×1080). Scale it with a wrapper for previews.
const Poster = forwardRef(function Poster({ data, brand, template, size = 'square' }, ref) {
  const { w, h } = SIZES[size] || SIZES.square;
  const t = template.theme;
  const Layout = LAYOUTS[template.layout] || Classic;
  return (
    <div
      ref={ref}
      style={{
        width: w, height: h, position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
        background: t.bg, color: t.fg, fontFamily: t.body,
      }}
    >
      <Layout d={data} b={brand} t={t} w={w} h={h} />
    </div>
  );
});

export default Poster;
