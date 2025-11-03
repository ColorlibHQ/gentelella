import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
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
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        globalThis: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
        bootstrap: 'readonly',
        Chart: 'readonly',
        echarts: 'readonly',
        NProgress: 'readonly',
        dayjs: 'readonly'
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
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
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