import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Like the backend, read configuration from the project root.
  // Only variables prefixed with VITE_ are exposed to browser code.
  envDir: '../',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
