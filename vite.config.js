import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  root: '.',
  base: '/polygon/gentelella/',
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
        manualChunks: {
          // Core UI framework - used on all pages
          'vendor-core': ['bootstrap', '@popperjs/core'],

          // Chart.js - used on chartjs.html, other_charts.html, dashboards
          'vendor-chartjs': ['chart.js'],

          // ECharts - separate chunk, only used on echarts.html (large library ~800KB)
          'vendor-echarts': ['echarts'],

          // Maps - separate since it's large and only used on map pages
          'vendor-maps': ['leaflet'],

          // FullCalendar - only used on calendar.html (~220KB total)
          'vendor-calendar': [
            '@fullcalendar/core',
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid',
            '@fullcalendar/interaction'
          ],

          // Form libraries - loaded on form pages
          'vendor-forms': ['choices.js', 'nouislider', '@eonasdan/tempus-dominus'],

          // File upload - Uppy (replaces Dropzone)
          'vendor-upload': ['@uppy/core', '@uppy/dashboard', '@uppy/xhr-upload'],

          // DataTables core - frequently used
          'vendor-tables': ['datatables.net', 'datatables.net-bs5'],

          // DataTables extensions - only loaded when needed (export, responsive, etc.)
          'vendor-tables-ext': [
            'jszip',
            'datatables.net-buttons',
            'datatables.net-buttons-bs5',
            'datatables.net-responsive',
            'datatables.net-responsive-bs5',
            'datatables.net-fixedheader',
            'datatables.net-keytable'
          ],

          // Date/time and small utilities
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
}); 