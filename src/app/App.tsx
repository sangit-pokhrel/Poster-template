import { useEffect } from 'react';
import { ConfirmDialog, Toaster } from '../components/common/feedback';
import { AppHeader } from '../components/layout/AppHeader';
import { Workspace } from '../components/layout/Workspace';
import { useShortcuts } from '../hooks/useShortcuts';
import { luminance } from '../render/color';
import { useActivePoster, useBrandFor } from '../store/selectors';

/** Studio shell. The UI accent follows the active brand (gold for Nepal Scholar, blue for Thesis Companion). */
export function App() {
  useShortcuts();
  const poster = useActivePoster();
  const brand = useBrandFor(poster.brandId);
  const accent = brand.palette.accent;

  // Tailwind resolves `--color-brand` at :root, so the variables must live there too.
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--brand-accent', accent);
    root.setProperty('--brand-accent-ink', luminance(accent) > 0.35 ? '#10141f' : '#ffffff');
  }, [accent]);

  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <Workspace />
      <Toaster />
      <ConfirmDialog />
    </div>
  );
}
