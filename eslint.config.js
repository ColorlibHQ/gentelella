import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        globalThis: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        getComputedStyle: 'readonly',
        CustomEvent: 'readonly',
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        MutationObserver: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        Image: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        fetch: 'readonly',
        performance: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLFormElement: 'readonly',
        Element: 'readonly',
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        DOMParser: 'readonly',
        // Library globals
        $: 'readonly',
        jQuery: 'readonly',
        bootstrap: 'readonly',
        Chart: 'readonly',
        echarts: 'readonly',
        dayjs: 'readonly',
        Skycons: 'readonly',
        DataTable: 'readonly',
        L: 'readonly',
        hljs: 'readonly',
        Choices: 'readonly',
        noUiSlider: 'readonly',
        Uppy: 'readonly',
        Cropper: 'readonly',
        Inputmask: 'readonly',
        moment: 'readonly',
        flatpickr: 'readonly',
        Pickr: 'readonly',
        Flot: 'readonly',
        FullCalendar: 'readonly',
        TempusDominus: 'readonly',
        process: 'readonly',
        sample_data: 'readonly',
        prettyPrint: 'readonly',
        validator: 'readonly',
        TabbedNotification: 'readonly',
        CustomTabs: 'readonly',
        TableManageButtons: 'readonly',
        init_sidebar: 'readonly',
        idname: 'writable',
        ended: 'writable',
        optionSet2: 'readonly'
      }
    },
    rules: {
      // Code Quality
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',

      // Best Practices
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // Security
      'no-script-url': 'error',
      'no-void': 'error',

      // Style (basic)
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error'
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'docs/_site/**',
      'production/images/**',
      '**/*.min.js',
      'vite.config.js'
    ]
  }
];
