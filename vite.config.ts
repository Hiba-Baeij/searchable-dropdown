import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    target: 'esnext',
    minify: 'esbuild',
    // Ensure proper module format
    modulePreload: {
      polyfill: true,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', '@mantine/core', '@mantine/hooks'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
