import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/utils/**/*.js'],
      exclude: ['src/**/*.test.js', 'src/**/*.spec.js']
    },
    setupFiles: ['./src/test/setup.js']
  },
  define: {
    'process.env.NODE_ENV': '"test"'
  }
});
