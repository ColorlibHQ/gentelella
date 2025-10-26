import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  // Tells Vite your project's main folder is 'production'
  root: 'production',

  // Ensures all asset paths are relative, which is critical for Vercel
  base: './',

  logLevel: 'info',
  clearScreen: false,
  build: {
    // Correctly places the 'dist' folder in your project's top-level directory
    outDir: '../dist',
    
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true,
    target: 'es2022',
    rollupOptions: {
      plugins: [
        visualizer({
          // Adjusted path for the stats file
          filename: '../dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap'
        })
      ],
      output: {
        manualChunks: {
          'vendor-core': ['bootstrap', '@popperjs/core'],
          'vendor-charts': ['chart.js', 'echarts'],
          'vendor-maps': ['leaflet'],
          'vendor-forms': ['choices.js', 'nouislider', 'autosize', 'switchery', '@eonasdan/tempus-dominus'],
          'vendor-tables': ['datatables.net', 'datatables.net-bs5'],
          'vendor-tables-ext': ['jszip'],
          'vendor-ui': ['nprogress'],
          'vendor-utils': ['dayjs', 'skycons']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      },
      // Input paths are now relative to the 'production' root
      input: {
        main: 'index.html',
        index2: 'index2.html',
        index3: 'index3.html',
        index4: 'index4.html',
        form: 'form.html',
        form_advanced: 'form_advanced.html',
        form_buttons: 'form_buttons.html',
        form_upload: 'form_upload.html',
        form_validation: 'form_validation.html',
        form_wizards: 'form_wizards.html',
        general_elements: 'general_elements.html',
        media_gallery: 'media_gallery.html',
        typography: 'typography.html',
        icons: 'icons.html',
        widgets: 'widgets.html',
        invoice: 'invoice.html',
        inbox: 'inbox.html',
        calendar: 'calendar.html',
        tables: 'tables.html',
        tables_dynamic: 'tables_dynamic.html',
        chartjs: 'chartjs.html',
        chartjs2: 'chartjs2.html',
        chart3: 'chart3.html',
        echarts: 'echarts.html',
        other_charts: 'other_charts.html',
        fixed_sidebar: 'fixed_sidebar.html',
        fixed_footer: 'fixed_footer.html',
        e_commerce: 'e_commerce.html',
        projects: 'projects.html',
        project_detail: 'project_detail.html',
        contacts: 'contacts.html',
        profile: 'profile.html',
        page_403: 'page_403.html',
        page_404: 'page_404.html',
        page_500: 'page_500.html',
        plain_page: 'plain_page.html',
        login: 'login.html',
        pricing_tables: 'pricing_tables.html',
        level2: 'level2.html',
        map: 'map.html',
        landing: 'landing.html'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        unsafe_comps: true,
        passes: 2
      },
      mangle: {
        safari10: true
      }
    }
  },
  esbuild: {
    target: 'es2022'
  },
  server: {
    open: '/index.html',
    port: 3000,
    host: true,
    watch: {
      usePolling: false,
      interval: 100,
      ignored: ['**/node_modules/**', '**/dist/**']
    },
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: [
      'bootstrap',
      '@popperjs/core',
      'dayjs',
      'nprogress'
    ],
    force: false,
    exclude: ['@simonwep/pickr']
  },
  resolve: {
    // Modern build without jQuery aliases
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
        includePaths: ['node_modules'],
        sourceMap: true,
        sourceMapContents: true
      }
    }
  },
  define: {
    global: 'globalThis',
    process: JSON.stringify({
      env: {
        NODE_ENV: 'production'
      }
    }),
    'process.env': JSON.stringify({
      NODE_ENV: 'production'
    }),
    'process.env.NODE_ENV': '"production"'
  }
});
