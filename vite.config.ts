import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// Configuração estática padrão para React + Vite (GitHub Pages)
export default defineConfig({
  base: "/vitaliza-flow/",
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
