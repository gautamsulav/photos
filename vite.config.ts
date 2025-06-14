import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
export default defineConfig({
  plugins: [
      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
      react(),
      tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})