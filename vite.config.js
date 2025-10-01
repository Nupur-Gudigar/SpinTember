import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isWeb = process.env.BUILD_TARGET === "web";

export default defineConfig({
  plugins: [react()],
  base: isWeb ? "/SpinTember/" : "./", // ✅ works on GitHub Pages + Electron
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
