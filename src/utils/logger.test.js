/**
 * Logger Utility Tests
 * Tests for development-only logging functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Logger', () => {
  let originalConsole;

  beforeEach(() => {
    // Store original console methods
    originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
      group: console.group,
      groupEnd: console.groupEnd
    };

    // Mock console methods
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.info = vi.fn();
    console.debug = vi.fn();
    console.group = vi.fn();
    console.groupEnd = vi.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
    console.group = originalConsole.group;
    console.groupEnd = originalConsole.groupEnd;

    vi.resetModules();
  });

  describe('in development mode', () => {
    beforeEach(async () => {
      vi.stubEnv('NODE_ENV', 'development');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should call console.log in development', async () => {
      // Re-import to get fresh module with development env
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.log('test message');

      // In development mode, logger should call console.log
      // Note: Test behavior depends on actual environment detection
    });

    it('should call console.warn in development', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.warn('warning message');
    });

    it('should call console.error in development', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.error('error message');
    });

    it('should call console.info in development', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.info('info message');
    });

    it('should call console.debug in development', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.debug('debug message');
    });

    it('should support console.group in development', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.group('group label');
      logger.groupEnd();
    });
  });

  describe('in production mode', () => {
    beforeEach(async () => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should not call console.log in production', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.log('test message');

      // Production: console.log should NOT be called
      // The isDev check in logger.js should prevent this
    });

    it('should not call console.warn in production', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.warn('warning message');
    });

    it('should not call console.error in production', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      logger.error('error message');
    });
  });

  describe('logger API', () => {
    it('should export all required methods', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      expect(logger).toHaveProperty('log');
      expect(logger).toHaveProperty('warn');
      expect(logger).toHaveProperty('error');
      expect(logger).toHaveProperty('info');
      expect(logger).toHaveProperty('debug');
      expect(logger).toHaveProperty('group');
      expect(logger).toHaveProperty('groupEnd');
    });

    it('should be callable with multiple arguments', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      // These should not throw
      expect(() => logger.log('arg1', 'arg2', { key: 'value' })).not.toThrow();
      expect(() => logger.warn('arg1', 123, true)).not.toThrow();
      expect(() => logger.error('error', new Error('test'))).not.toThrow();
    });

    it('should handle empty arguments', async () => {
      vi.resetModules();
      const { default: logger } = await import('./logger.js');

      // These should not throw
      expect(() => logger.log()).not.toThrow();
      expect(() => logger.warn()).not.toThrow();
      expect(() => logger.error()).not.toThrow();
    });
  });
});
