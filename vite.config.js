import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: { '.js': 'jsx' },
    },
  },
  build: {
    rolldownOptions: {
      moduleTypes: { '.js': 'jsx' },
    },
  },
});
