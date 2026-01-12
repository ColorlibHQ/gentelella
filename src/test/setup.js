/**
 * Vitest Test Setup
 * Configures the testing environment with necessary globals and mocks
 */

import { vi } from 'vitest';

// Mock DOMPurify for security tests
vi.mock('dompurify', () => ({
  default: {
    sanitize: (html, config = {}) => {
      // Simple mock that strips script tags and onerror handlers
      if (!html || typeof html !== 'string') return '';

      let sanitized = html;

      // Remove script tags
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      // Remove event handlers
      sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

      // If ALLOWED_TAGS is empty, strip all tags
      if (config.ALLOWED_TAGS && config.ALLOWED_TAGS.length === 0) {
        sanitized = sanitized.replace(/<[^>]*>/g, '');
      }

      return sanitized;
    }
  }
}));

// Setup global window object properties for DOM tests
if (typeof window !== 'undefined') {
  window.scrollY = 0;
  window.scrollX = 0;
}

// Mock requestAnimationFrame for animation tests
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);
