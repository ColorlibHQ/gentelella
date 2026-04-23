import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// `base` is the public path the built site is served from (e.g. when hosted
// at https://example.com/polygon/gentelella/). Local dev should always serve
// from `/` — otherwise the dev server URL becomes /polygon/gentelella/... and
// nothing matches because the HTML entries live under production/.
export default defineConfig(({ command }) => ({
  root: '.',
  base: command === 'build' ? '/polygon/gentelella/' : '/',
  publicDir: 'public',
  logLevel: 'info',
  clearScreen: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    // Optimize source maps: 'hidden' for production (generates but doesn't reference in bundle)
    // This allows debugging in production without exposing source maps to users
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true,
    target: 'es2022',
    rollupOptions: {
      plugins: [
        // Bundle analyzer - generates stats.html file
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap' // 'treemap', 'sunburst', 'network'
        })
      ],
      output: {
        // Function form required by Rolldown (Vite 8+). Matches by
        // node_modules path because rolldown doesn't resolve package names.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules\/(bootstrap|@popperjs)\//.test(id)) return 'vendor-core';
          if (/node_modules\/chart\.js\//.test(id)) return 'vendor-chartjs';
          if (/node_modules\/echarts\//.test(id)) return 'vendor-echarts';
          if (/node_modules\/leaflet\//.test(id)) return 'vendor-maps';
          if (/node_modules\/@fullcalendar\//.test(id)) return 'vendor-calendar';
          if (/node_modules\/(choices\.js|nouislider|@eonasdan\/tempus-dominus)\//.test(id)) return 'vendor-forms';
          if (/node_modules\/@uppy\//.test(id)) return 'vendor-upload';
          if (/node_modules\/jszip\//.test(id)) return 'vendor-tables-ext';
          if (/node_modules\/datatables\.net-(buttons|responsive|fixedheader|keytable)/.test(id)) return 'vendor-tables-ext';
          if (/node_modules\/datatables\.net(-bs5)?\//.test(id)) return 'vendor-tables';
          if (/node_modules\/(dayjs|skycons)\//.test(id)) return 'vendor-utils';
        },
        assetFileNames: (assetInfo) => {
          // Rolldown (Vite 8+) passes `names` (array); Rollup passes `name`.
          const name = assetInfo.name ?? assetInfo.names?.[0] ?? '';
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      },
      input: {
        main: 'production/index.html',
        index2: 'production/index2.html',
        index3: 'production/index3.html',
        index4: 'production/index4.html',
        
        form: 'production/form.html',
        form_advanced: 'production/form_advanced.html',
        form_buttons: 'production/form_buttons.html',
        form_upload: 'production/form_upload.html',
        form_validation: 'production/form_validation.html',
        form_wizards: 'production/form_wizards.html',
        
        general_elements: 'production/general_elements.html',
        media_gallery: 'production/media_gallery.html',
        typography: 'production/typography.html',
        icons: 'production/icons.html',

        widgets: 'production/widgets.html',
        invoice: 'production/invoice.html',
        inbox: 'production/inbox.html',
        calendar: 'production/calendar.html',
        
        tables: 'production/tables.html',
        tables_dynamic: 'production/tables_dynamic.html',
        
        chartjs: 'production/chartjs.html',
        echarts: 'production/echarts.html',
        other_charts: 'production/other_charts.html',
        
        fixed_sidebar: 'production/fixed_sidebar.html',
        fixed_footer: 'production/fixed_footer.html',
        
        e_commerce: 'production/e_commerce.html',
        projects: 'production/projects.html',
        project_detail: 'production/project_detail.html',
        contacts: 'production/contacts.html',
        profile: 'production/profile.html',
        
        page_403: 'production/page_403.html',
        page_404: 'production/page_404.html',
        page_500: 'production/page_500.html',
        plain_page: 'production/plain_page.html',
        login: 'production/login.html',
        pricing_tables: 'production/pricing_tables.html',
        
        level2: 'production/level2.html',
        map: 'production/map.html',
        landing: 'production/landing.html',

        // Theme comparison page (for testing)
        theme_comparison: 'production/theme-comparison.html'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        unsafe_comps: true,
        passes: 3,
        pure_getters: true,
        reduce_vars: true,
        collapse_vars: true,
        dead_code: true,
        unused: true
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    }
  },
  esbuild: {
    target: 'es2022'
  },
  server: {
    // Entry HTMLs live in production/, not at the project root.
    open: '/production/index.html',
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
      '@simonwep/pickr'
    ],
    force: false
  },
  resolve: {
    // Modern build without jQuery aliases
  },
  css: {
    // Enable CSS source maps only in development (saves ~8MB in production build)
    devSourcemap: process.env.NODE_ENV !== 'production',
    preprocessorOptions: {
      scss: {
        // Silence Sass deprecation warnings
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
        // Additional settings for better performance
        includePaths: ['node_modules'],
        // Generate source maps only in development
        sourceMap: process.env.NODE_ENV !== 'production',
        sourceMapContents: process.env.NODE_ENV !== 'production'
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
}));
