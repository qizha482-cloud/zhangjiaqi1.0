import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// Custom plugin to enforce correct MIME types (Content-Type: application/javascript)
// for JS, MJS, TS, and TSX files on the dev and preview servers to avoid 'application/octet-stream' errors.
const mimeTypePlugin = {
  name: 'mime-type-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const oldSetHeader = res.setHeader;
      res.setHeader = function (name, value) {
        if (name && name.toLowerCase() === 'content-type') {
          const url = req.url?.split('?')[0] || '';
          if (url.endsWith('.js') || url.endsWith('.mjs') || url.endsWith('.ts') || url.endsWith('.tsx')) {
            value = 'application/javascript';
          }
        }
        return oldSetHeader.call(this, name, value);
      };
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      const oldSetHeader = res.setHeader;
      res.setHeader = function (name, value) {
        if (name && name.toLowerCase() === 'content-type') {
          const url = req.url?.split('?')[0] || '';
          if (url.endsWith('.js') || url.endsWith('.mjs') || url.endsWith('.ts') || url.endsWith('.tsx')) {
            value = 'application/javascript';
          }
        }
        return oldSetHeader.call(this, name, value);
      };
      next();
    });
  }
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: mode === 'production' ? './' : '/', // Ensures relative assets path resolution on static hosting like GitHub Pages in production while keeping standard root resolution in dev mode
    plugins: [react(), tailwindcss(), mimeTypePlugin],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), interest-cohort=()'
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
  };
});
