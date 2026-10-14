import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  base: './',
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
