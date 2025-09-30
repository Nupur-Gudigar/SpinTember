import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SpinTember/', // ✅ important for GitHub Pages (repo name)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable source maps in production for smaller builds
  },
  server: {
    port: 5173,
    strictPort: true, // Exit if port is already in use
  }
})
