/**
 * Security Utilities Tests
 * Tests for XSS prevention and HTML sanitization functions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeHtml, sanitizeText, setSafeInnerHTML } from './security.js';

describe('sanitizeHtml', () => {
  it('should return empty string for null input', () => {
    expect(sanitizeHtml(null)).toBe('');
  });

  it('should return empty string for undefined input', () => {
    expect(sanitizeHtml(undefined)).toBe('');
  });

  it('should return empty string for non-string input', () => {
    expect(sanitizeHtml(123)).toBe('');
    expect(sanitizeHtml({})).toBe('');
    expect(sanitizeHtml([])).toBe('');
  });

  it('should preserve allowed tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeHtml(input);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
  });

  it('should remove script tags', () => {
    const input = '<p>Safe</p><script>alert("XSS")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should remove onclick handlers', () => {
    const input = '<p onclick="alert(\'XSS\')">Click me</p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('onclick');
  });

  it('should remove onerror handlers', () => {
    const input = '<img src="x" onerror="alert(\'XSS\')">';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('onerror');
  });

  it('should allow safe attributes', () => {
    const input = '<a href="https://example.com" class="link">Link</a>';
    const result = sanitizeHtml(input);
    expect(result).toContain('href');
    expect(result).toContain('class');
  });

  it('should accept custom options', () => {
    const input = '<div><custom>Test</custom></div>';
    const result = sanitizeHtml(input, {
      ALLOWED_TAGS: ['div', 'custom']
    });
    expect(result).toContain('<div>');
  });
});

describe('sanitizeText', () => {
  it('should return empty string for null input', () => {
    expect(sanitizeText(null)).toBe('');
  });

  it('should return empty string for undefined input', () => {
    expect(sanitizeText(undefined)).toBe('');
  });

  it('should return empty string for non-string input', () => {
    expect(sanitizeText(123)).toBe('');
  });

  it('should strip all HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeText(input);
    expect(result).toBe('Hello World');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should handle script tags and return safe text', () => {
    const input = 'Safe text<script>malicious()</script>';
    const result = sanitizeText(input);
    expect(result).not.toContain('script');
    expect(result).toContain('Safe text');
  });
});

describe('setSafeInnerHTML', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it('should do nothing if element is null', () => {
    expect(() => setSafeInnerHTML(null, '<p>Test</p>')).not.toThrow();
  });

  it('should do nothing if html is null', () => {
    setSafeInnerHTML(element, null);
    expect(element.innerHTML).toBe('');
  });

  it('should sanitize and set innerHTML', () => {
    setSafeInnerHTML(element, '<p>Safe</p><script>alert("XSS")</script>');
    expect(element.innerHTML).toContain('<p>');
    expect(element.innerHTML).not.toContain('<script>');
  });

  it('should accept custom sanitization options', () => {
    setSafeInnerHTML(element, '<div>Test</div>', {
      ALLOWED_TAGS: ['div']
    });
    expect(element.innerHTML).toContain('<div>');
  });
});
