import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/SpinTember/' : './', // Use repo name for GitHub Pages, relative for Electron
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
