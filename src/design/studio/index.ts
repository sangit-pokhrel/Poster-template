/**
 * Shared studio designs: every reference in design-references/ rebuilt as an
 * editable layout, in two variations. The same layouts are used by all three
 * pages; the brand's colour theme makes them different.
 */
import type { StudioEntry } from './kit';
import { REFS_A } from './refsA';
import { REFS_B } from './refsB';
import { REFS_C } from './refsC';

export const STUDIO: readonly StudioEntry[] = [...REFS_A, ...REFS_B, ...REFS_C];
