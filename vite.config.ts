import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mantine-core': ['@mantine/core'],
          'mantine-hooks': ['@mantine/hooks'],
        }
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
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
