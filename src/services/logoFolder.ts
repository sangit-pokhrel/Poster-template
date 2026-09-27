import logos from 'virtual:brand-logos';
import type { BrandId } from '../types/brand';

/** Logo files found in public/logo/<brand>/ at build time (see vite.brandLogos.ts). */
export interface DroppedLogo {
  logo: string;
  mark?: string;
  logoLight?: string;
  markLight?: string;
}

export const droppedLogos: Partial<Record<BrandId, DroppedLogo>> = logos;
