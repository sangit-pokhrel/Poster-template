import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Poster from './Poster';
import { TEMPLATES, SIZES, getTemplate } from './templates';
import { nodesToPngs, downloadDataUrl, downloadZip, slug } from './exporter';
import { parseCsv } from './csv';

const STORAGE_KEY = 'poster-studio-v1';

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);

const newPost = (templateId, fields = {}) => ({
  id: uid(),
  templateId,
  category: 'Breaking',
  headline: '',
  summary: '',
  date: today(),
  source: '',
  image: '',
  ...fields,
});

const DEFAULT_STATE = {
  brand: { brand: 'Kranti Patra', website: 'krantipatra.netlify.app', handle: '@krantipatra', logo: '' },
  size: 'square',
  posts: [
    newPost('classic-red', {
      headline: 'Parliament passes new education bill after long debate',
      summary: 'The bill introduces free secondary education in all public schools from next year.',
      source: 'Kathmandu',
    }),
  ],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const s = JSON.parse(raw);
    if (!s.posts?.length) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...s };
  } catch {
    return DEFAULT_STATE;
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Shows a full-size poster shrunk to `width` pixels wide.
function Scaled({ width, size, children }) {
  const { w, h } = SIZES[size];
  const k = width / w;
  return (
    <div style={{ width, height: h * k, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ transform: `scale(${k})`, transformOrigin: 'top left', width: w, height: h }}>{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ImageField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="image-field">
        {value && <img src={value} alt="" />}
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) onChange(await readFileAsDataUrl(f));
            e.target.value = '';
          }}
        />
        {value && (
          <button type="button" className="ghost small" onClick={() => onChange('')}>
            Remove
          </button>
        )}
      </div>
    </Field>
  );
}

export default function App() {
  const [state, setState] = useState(loadState);
  const [selectedId, setSelectedId] = useState(() => state.posts[0].id);
  const [jobs, setJobs] = useState([]);
  const [busy, setBusy] = useState('');
  const [previewWidth, setPreviewWidth] = useState(520);
  const jobRefs = useRef([]);
  const previewBox = useRef(null);

  const { brand, size, posts } = state;
  const post = posts.find((p) => p.id === selectedId) || posts[0];
  const template = getTemplate(post.templateId);

  // Persist (images can exceed the storage quota — then we just skip saving).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      try {
        const lite = { ...state, posts: state.posts.map((p) => ({ ...p, image: '' })) };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lite));
      } catch {
        /* ignore */
      }
    }
  }, [state]);

  // Fit the preview to its column.
  useEffect(() => {
    const el = previewBox.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPreviewWidth(Math.min(620, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setBrand = (patch) => setState((s) => ({ ...s, brand: { ...s.brand, ...patch } }));
  const updatePost = (patch) =>
    setState((s) => ({ ...s, posts: s.posts.map((p) => (p.id === post.id ? { ...p, ...patch } : p)) }));

  const addPost = () => {
    const p = newPost(post.templateId, { category: post.category, date: post.date });
    setState((s) => ({ ...s, posts: [...s.posts, p] }));
    setSelectedId(p.id);
  };
  const duplicatePost = () => {
    const p = { ...post, id: uid() };
    setState((s) => ({ ...s, posts: [...s.posts, p] }));
    setSelectedId(p.id);
  };
  const removePost = (id) => {
    if (posts.length === 1) return;
    const rest = posts.filter((p) => p.id !== id);
    setState((s) => ({ ...s, posts: rest }));
    if (id === selectedId) setSelectedId(rest[0].id);
  };
  const applyTemplateToAll = () =>
    setState((s) => ({ ...s, posts: s.posts.map((p) => ({ ...p, templateId: post.templateId })) }));

  const importCsv = async (file) => {
    const rows = parseCsv(await file.text());
    if (!rows.length) return alert('No rows found in that CSV.');
    const imported = rows.map((r) =>
      newPost(TEMPLATES.some((t) => t.id === r.template) ? r.template : post.templateId, {
        category: r.category ?? 'Breaking',
        headline: r.headline || r.title || '',
        summary: r.summary || r.description || '',
        date: r.date || today(),
        source: r.source || r.location || '',
        image: r.image || '',
      })
    );
    const keepCurrent = posts.length > 1 || post.headline;
    setState((s) => ({ ...s, posts: keepCurrent ? [...s.posts, ...imported] : imported }));
    setSelectedId(imported[0].id);
  };

  // Render the requested posters off-screen at full size, snapshot each one, then clean up.
  async function exportJobs(list, zipName) {
    if (busy) return;
    setBusy(`Preparing 0/${list.length}…`);
    try {
      jobRefs.current = [];
      flushSync(() => setJobs(list));
      const nodes = jobRefs.current.slice(0, list.length);
      const pngs = await nodesToPngs(nodes, (i, n) => setBusy(`Rendering ${i}/${n}…`));
      const files = list.map((j, i) => ({ name: j.filename, dataUrl: pngs[i] }));
      if (!zipName) downloadDataUrl(files[0].dataUrl, files[0].name);
      else {
        setBusy('Zipping…');
        await downloadZip(files, zipName);
      }
    } catch (err) {
      console.error(err);
      alert('Export failed: ' + (err?.message || err) + '\nIf you used image URLs, try uploading the images instead.');
    } finally {
      setJobs([]);
      setBusy('');
    }
  }

  const jobFor = (p, tpl, i) => ({
    post: p,
    template: tpl,
    filename: `${String(i + 1).padStart(2, '0')}-${slug(p.headline)}-${tpl.id}.png`,
  });

  const downloadCurrent = () =>
    exportJobs([{ ...jobFor(post, template, 0), filename: `${slug(post.headline)}-${template.id}.png` }]);
  const downloadAllPosts = () =>
    exportJobs(posts.map((p, i) => jobFor(p, getTemplate(p.templateId), i)), `posters-${today()}.zip`);
  const downloadAllTemplates = () =>
    exportJobs(TEMPLATES.map((t, i) => jobFor(post, t, i)), `${slug(post.headline)}-all-templates.zip`);

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">
          Poster<span>Studio</span>
        </div>
        <div className="actions">
          <select value={size} onChange={(e) => setState((s) => ({ ...s, size: e.target.value }))}>
            {Object.entries(SIZES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <button onClick={downloadCurrent} disabled={!!busy}>Download PNG</button>
          <button onClick={downloadAllPosts} disabled={!!busy} className="primary">
            Download all {posts.length} posts (ZIP)
          </button>
          <button onClick={downloadAllTemplates} disabled={!!busy}>This post × 20 templates</button>
        </div>
      </header>

      {busy && <div className="busy">{busy}</div>}

      <main className="layout">
        {/* Left: brand kit + post list */}
        <aside className="panel">
          <h2>Brand kit</h2>
          <p className="hint">Shared by every poster.</p>
          <Field label="Brand / page name">
            <input value={brand.brand} onChange={(e) => setBrand({ brand: e.target.value })} />
          </Field>
          <Field label="Website">
            <input value={brand.website} onChange={(e) => setBrand({ website: e.target.value })} />
          </Field>
          <Field label="Social handle">
            <input value={brand.handle} onChange={(e) => setBrand({ handle: e.target.value })} />
          </Field>
          <ImageField label="Logo" value={brand.logo} onChange={(logo) => setBrand({ logo })} />

          <div className="row-between">
            <h2>Posts ({posts.length})</h2>
            <button className="small" onClick={addPost}>+ New</button>
          </div>
          <ul className="post-list">
            {posts.map((p, i) => (
              <li key={p.id} className={p.id === post.id ? 'active' : ''} onClick={() => setSelectedId(p.id)}>
                <span className="num">{i + 1}</span>
                <span className="title">{p.headline || 'Untitled post'}</span>
                {posts.length > 1 && (
                  <button
                    className="ghost small"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePost(p.id);
                    }}
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>

          <h2>Bulk import</h2>
          <p className="hint">
            CSV columns: category, headline, summary, date, source, image, template.{' '}
            <a href="/sample.csv" download>
              Sample CSV
            </a>
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importCsv(f);
              e.target.value = '';
            }}
          />
        </aside>

        {/* Center: preview */}
        <section className="preview" ref={previewBox}>
          <Scaled width={previewWidth} size={size}>
            <Poster data={post} brand={brand} template={template} size={size} />
          </Scaled>
          <div className="preview-meta">
            <strong>{template.name}</strong>
            <button className="ghost small" onClick={applyTemplateToAll}>
              Use this template for all posts
            </button>
          </div>
        </section>

        {/* Right: post fields */}
        <aside className="panel">
          <div className="row-between">
            <h2>Post content</h2>
            <button className="ghost small" onClick={duplicatePost}>Duplicate</button>
          </div>
          <Field label="Category / tag">
            <input value={post.category} onChange={(e) => updatePost({ category: e.target.value })} />
          </Field>
          <Field label={`Headline (${post.headline.length})`}>
            <textarea rows={3} value={post.headline} onChange={(e) => updatePost({ headline: e.target.value })} />
          </Field>
          <Field label="Summary">
            <textarea rows={4} value={post.summary} onChange={(e) => updatePost({ summary: e.target.value })} />
          </Field>
          <div className="two">
            <Field label="Date">
              <input type="date" value={post.date} onChange={(e) => updatePost({ date: e.target.value })} />
            </Field>
            <Field label="Source / place">
              <input value={post.source} onChange={(e) => updatePost({ source: e.target.value })} />
            </Field>
          </div>
          <ImageField label="Photo" value={post.image} onChange={(image) => updatePost({ image })} />
          <Field label="…or photo URL">
            <input
              placeholder="https://…"
              value={post.image.startsWith('data:') ? '' : post.image}
              onChange={(e) => updatePost({ image: e.target.value })}
            />
          </Field>
        </aside>
      </main>

      <section className="gallery">
        <h2>Templates ({TEMPLATES.length})</h2>
        <div className="grid">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`thumb ${t.id === post.templateId ? 'active' : ''}`}
              onClick={() => updatePost({ templateId: t.id })}
            >
              <Scaled width={170} size={size}>
                <Poster data={post} brand={brand} template={t} size={size} />
              </Scaled>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Off-screen full-size renders used only while exporting */}
      <div className="offscreen" aria-hidden="true">
        {jobs.map((j, i) => (
          <Poster
            key={i}
            ref={(el) => (jobRefs.current[i] = el)}
            data={j.post}
            brand={brand}
            template={j.template}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}
