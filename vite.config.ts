import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom domain (joshhiggins.dev) is served from the root of GitHub Pages,
// so base must stay '/'. Do not set a repo-path base.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
