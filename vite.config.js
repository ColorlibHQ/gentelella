import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'production',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'production/index.html',
        index2: 'production/index2.html',
        index3: 'production/index3.html'
      }
    }
  },
  server: {
    open: '/production/index.html',
    port: 3000
  },
  optimizeDeps: {
    include: ['jquery', 'bootstrap']
  },
  resolve: {
    alias: {
      jquery: 'jquery'
    }
  },
  define: {
    global: 'globalThis'
  }
}); 