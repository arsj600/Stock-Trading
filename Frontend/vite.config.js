import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // your frontend dev port
    proxy: {
      "/api": "http://localhost:4000" // your backend dev port
    }
  },
  build: {
    outDir: "../backend/public", // optional: build frontend into backend public folder
    emptyOutDir: true
  }
});
