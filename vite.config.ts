import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // GitHub Pages base path
  // This site will be served from: https://burulemirhan.github.io/Nexus/
  const base = '/Nexus/';

  return {
    base,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            lenis: ['lenis'],
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      sourcemap: false,
      cssMinify: true,
      target: 'es2020',
      chunkSizeWarningLimit: 500,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lenis', 'lucide-react'],
    },
  };
});
