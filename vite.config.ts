import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mantine-core': ['@mantine/core'],
          'mantine-hooks': ['@mantine/hooks'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@mantine/core', '@mantine/hooks'],
  },
});
