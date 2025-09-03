// Security utilities for XSS prevention
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} html - The HTML content to sanitize
 * @param {Object} options - DOMPurify configuration options
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html, options = {}) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const config = {
    ALLOWED_TAGS: [
      'div',
      'span',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'strong',
      'em',
      'br',
      'img',
      'a'
    ],
    ALLOWED_ATTR: ['class', 'id', 'src', 'alt', 'href', 'target', 'title'],
    ALLOW_DATA_ATTR: false,
    ...options
  };

  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitizes text content (removes all HTML tags)
 * @param {string} text - The text to sanitize
 * @returns {string} - Plain text without HTML
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Strip all HTML tags and decode HTML entities
  const div = document.createElement('div');
  div.innerHTML = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  return div.textContent || div.innerText || '';
}

/**
 * Creates a safe innerHTML setter that automatically sanitizes content
 * @param {HTMLElement} element - The element to set innerHTML on
 * @param {string} html - The HTML content to set
 * @param {Object} options - DOMPurify configuration options
 */
export function setSafeInnerHTML(element, html, options = {}) {
  if (!element || !html) {
    return;
  }

  element.innerHTML = sanitizeHtml(html, options);
}

/**
 * Make security utilities available globally for legacy code
 */
if (typeof window !== 'undefined') {
  window.sanitizeHtml = sanitizeHtml;
  window.sanitizeText = sanitizeText;
  window.setSafeInnerHTML = setSafeInnerHTML;
}

export default {
  sanitizeHtml,
  sanitizeText,
  setSafeInnerHTML
};
