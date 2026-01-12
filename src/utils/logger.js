/**
 * Development-only Logger Utility
 * Wraps console methods to only output in development mode
 * Production builds strip these via Terser
 */

const isDev = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (isDev) {
      console.error(...args);
    }
  },
  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  },
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },
  group: (...args) => {
    if (isDev) {
      console.group(...args);
    }
  },
  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  }
};

export default logger;
