import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'production',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Dashboard pages
        main: 'production/index.html',
        index2: 'production/index2.html',
        index3: 'production/index3.html',
        
        // Form pages
        form: 'production/form.html',
        form_advanced: 'production/form_advanced.html',
        form_buttons: 'production/form_buttons.html',
        form_upload: 'production/form_upload.html',
        form_validation: 'production/form_validation.html',
        form_wizards: 'production/form_wizards.html',
        
        // UI Elements
        general_elements: 'production/general_elements.html',
        media_gallery: 'production/media_gallery.html',
        typography: 'production/typography.html',
        icons: 'production/icons.html',
        glyphicons: 'production/glyphicons.html',
        widgets: 'production/widgets.html',
        invoice: 'production/invoice.html',
        inbox: 'production/inbox.html',
        calendar: 'production/calendar.html',
        
        // Tables
        tables: 'production/tables.html',
        tables_dynamic: 'production/tables_dynamic.html',
        
        // Charts
        chartjs: 'production/chartjs.html',
        chartjs2: 'production/chartjs2.html',
        morisjs: 'production/morisjs.html',
        echarts: 'production/echarts.html',
        other_charts: 'production/other_charts.html',
        
        // Layouts
        fixed_sidebar: 'production/fixed_sidebar.html',
        fixed_footer: 'production/fixed_footer.html',
        
        // Additional Pages
        e_commerce: 'production/e_commerce.html',
        projects: 'production/projects.html',
        project_detail: 'production/project_detail.html',
        contacts: 'production/contacts.html',
        profile: 'production/profile.html',
        
        // Error & Extra Pages
        page_403: 'production/page_403.html',
        page_404: 'production/page_404.html',
        page_500: 'production/page_500.html',
        plain_page: 'production/plain_page.html',
        login: 'production/login.html',
        pricing_tables: 'production/pricing_tables.html',
        
        // Level & Test Pages
        level2: 'production/level2.html',
        sidebar_test: 'production/sidebar_test.html',
        map: 'production/map.html',
        xx: 'production/xx.html'
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
    global: 'globalThis',
    'process.env': {},
    'process.env.NODE_ENV': '"production"'
  }
}); 