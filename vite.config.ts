import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // For custom domain (nexusbiotech.org) - using root path
    // You can override this with environment variable: VITE_BASE_PATH=/your-path/
    const base = process.env.VITE_BASE_PATH || '/';
    
    return {
      base: base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Output directory
        outDir: 'dist',
        // Optimize chunk size
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              lenis: ['lenis'],
            },
          },
        },
        // Enable minification
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
        // Generate source maps for debugging
        sourcemap: false,
        // Optimize CSS
        cssMinify: true,
        // Target modern browsers for smaller bundle
        target: 'es2020',
        // Chunk size warning limit
        chunkSizeWarningLimit: 500,
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'lenis', 'lucide-react'],
      },
    };
});
