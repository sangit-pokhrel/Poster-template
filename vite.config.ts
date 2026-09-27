/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { brandLogos } from './vite.brandLogos.ts';

export default defineConfig({
  plugins: [react(), tailwindcss(), brandLogos()],
  build: {
    // Fabric.js (~450 kB) is needed for the first paint of the editor canvas; JSZip is lazy-loaded.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        // Vendor chunks change rarely, so browsers keep them cached across app updates.
        codeSplitting: {
          groups: [
            { name: 'fabric', test: /node_modules[\\/]fabric/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|zustand|immer)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
