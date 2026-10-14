import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages deployment: change base to '/your-repo-name/'
  // Local development or custom domain: use '/'
  base: '/',
  server: {
    host: true,
    open: true,
    port: 3001
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})
