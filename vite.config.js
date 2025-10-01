import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Accept either BUILD_TARGET or VITE_BUILD_TARGET
const buildTarget = process.env.BUILD_TARGET || process.env.VITE_BUILD_TARGET;
const isWeb = buildTarget === "web";

export default defineConfig({
  plugins: [react()],
  base: isWeb ? "/Spintember/" : "./",   // 👈 must match repo name exactly
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
