import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy API calls to the backend during development
      '/analyze': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});