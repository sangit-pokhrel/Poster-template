import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { loadLogoColors } from './services/logoColors';
import { startPersistence } from './services/storageService';
import './styles.css';

// Restore the saved session before the first render so there is no flash of defaults.
startPersistence();
// Colour themes follow logos dropped into public/logo/<brand>/.
loadLogoColors();

const root = document.getElementById('root');
if (!root) throw new Error('#root element missing from index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
