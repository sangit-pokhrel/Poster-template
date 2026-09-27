/**
 * `virtual:brand-logos`: the logo files the team drops into
 * public/logo/<brand-id>/, so a new logo shows up without code changes.
 *
 * File names pick the role:
 *   *mark* / *icon* / *symbol*  → the symbol-only mark
 *   *light* / *white*           → the version for dark backgrounds
 *   anything else               → the full logo
 * A single file is used everywhere.
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

const ID = 'virtual:brand-logos';
const RESOLVED = `\0${ID}`;
const IMAGE = /\.(png|jpe?g|webp|svg)$/i;

interface Dropped {
  logo: string;
  mark?: string;
  logoLight?: string;
  markLight?: string;
}

export function scanLogoFolder(root: string): Record<string, Dropped> {
  const dir = join(root, 'public', 'logo');
  const out: Record<string, Dropped> = {};
  if (!existsSync(dir)) return out;
  for (const brand of readdirSync(dir, { withFileTypes: true })) {
    if (!brand.isDirectory()) continue;
    const files = readdirSync(join(dir, brand.name)).filter((f) => IMAGE.test(f)).sort();
    if (files.length === 0) continue;
    const url = (f: string) => `/logo/${encodeURIComponent(brand.name)}/${encodeURIComponent(f)}`;
    const isMark = (f: string) => /mark|icon|symbol/i.test(f);
    const isLight = (f: string) => /light|white/i.test(f);
    const full = files.find((f) => !isMark(f) && !isLight(f)) ?? files.find((f) => !isMark(f)) ?? files[0];
    if (!full) continue;
    const pick = (mark: boolean, light: boolean) => files.find((f) => isMark(f) === mark && isLight(f) === light);
    const mark = pick(true, false);
    const logoLight = pick(false, true);
    const markLight = pick(true, true);
    out[brand.name] = {
      logo: url(full),
      ...(mark ? { mark: url(mark) } : {}),
      ...(logoLight ? { logoLight: url(logoLight) } : {}),
      ...(markLight ? { markLight: url(markLight) } : {}),
    };
  }
  return out;
}

export function brandLogos(): Plugin {
  let root = process.cwd();
  return {
    name: 'brand-logos',
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === ID ? RESOLVED : undefined;
    },
    load(id) {
      return id === RESOLVED ? `export default ${JSON.stringify(scanLogoFolder(root))};` : undefined;
    },
    configureServer(server) {
      // Adding or removing a logo reloads the app with the new artwork.
      const onChange = (file: string) => {
        if (!/[\\/]public[\\/]logo[\\/]/.test(file)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.add(join(root, 'public', 'logo'));
      server.watcher.on('add', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
}
