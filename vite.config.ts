import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/data/chapters/')) {
            return 'data-chapters';
          }
          if (id.includes('/data/guides/')) {
            return 'data-guides';
          }
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('prismjs')) {
              return 'vendor-syntax';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-effects';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});

