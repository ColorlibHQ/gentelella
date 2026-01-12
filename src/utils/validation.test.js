/**
 * Validation Utilities Tests
 * Comprehensive tests for all form validation functions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidURL,
  validatePassword,
  isValidCreditCard,
  isValidDate,
  isAlphanumeric,
  isInRange,
  isRequired,
  isValidFileType,
  isValidFileSize,
  validateForm,
  displayValidationErrors,
  clearValidationErrors
} from './validation.js';

describe('isValidEmail', () => {
  it('should accept valid email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co')).toBe(true);
    expect(isValidEmail('user+tag@example.org')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('no@domain')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
    expect(isValidEmail('spaces in@email.com')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('should accept valid phone numbers', () => {
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('+1 234 567 8901')).toBe(true);
    expect(isValidPhone('(123) 456-7890')).toBe(true);
    expect(isValidPhone('+44 20 7946 0958')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('abcdefghij')).toBe(false);
  });
});

describe('isValidURL', () => {
  it('should accept valid URLs', () => {
    expect(isValidURL('https://example.com')).toBe(true);
    expect(isValidURL('http://localhost:3000')).toBe(true);
    expect(isValidURL('https://example.com/path?query=value')).toBe(true);
    expect(isValidURL('ftp://files.example.com')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isValidURL('')).toBe(false);
    expect(isValidURL('not-a-url')).toBe(false);
    expect(isValidURL('example.com')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should return valid for strong passwords', () => {
    const result = validatePassword('MyPass123!');
    expect(result.isValid).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(4);
    expect(result.feedback).toHaveLength(0);
  });

  it('should return invalid for weak passwords', () => {
    const result = validatePassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.score).toBeLessThan(4);
    expect(result.feedback.length).toBeGreaterThan(0);
  });

  it('should check for minimum length', () => {
    const result = validatePassword('Ab1!');
    expect(result.feedback).toContain('Password must be at least 8 characters long');
  });

  it('should check for uppercase letters', () => {
    const result = validatePassword('lowercase123!');
    expect(result.feedback).toContain('Include at least one uppercase letter');
  });

  it('should check for lowercase letters', () => {
    const result = validatePassword('UPPERCASE123!');
    expect(result.feedback).toContain('Include at least one lowercase letter');
  });

  it('should check for numbers', () => {
    const result = validatePassword('NoNumbers!');
    expect(result.feedback).toContain('Include at least one number');
  });

  it('should check for special characters', () => {
    const result = validatePassword('NoSpecial123');
    expect(result.feedback).toContain('Include at least one special character');
  });
});

describe('isValidCreditCard', () => {
  it('should accept valid credit card numbers (Luhn algorithm)', () => {
    // Test Visa number
    expect(isValidCreditCard('4111111111111111')).toBe(true);
    // Test with spaces
    expect(isValidCreditCard('4111 1111 1111 1111')).toBe(true);
    // Test Mastercard number
    expect(isValidCreditCard('5500000000000004')).toBe(true);
  });

  it('should reject invalid credit card numbers', () => {
    expect(isValidCreditCard('')).toBe(false);
    expect(isValidCreditCard('1234567890123456')).toBe(false);
    expect(isValidCreditCard('123')).toBe(false);
    expect(isValidCreditCard('not-a-number')).toBe(false);
  });
});

describe('isValidDate', () => {
  it('should accept valid dates in YYYY-MM-DD format', () => {
    expect(isValidDate('2024-01-15', 'YYYY-MM-DD')).toBe(true);
    expect(isValidDate('2024-12-31', 'YYYY-MM-DD')).toBe(true);
  });

  it('should accept valid dates in MM/DD/YYYY format', () => {
    expect(isValidDate('01/15/2024', 'MM/DD/YYYY')).toBe(true);
    expect(isValidDate('12/31/2024', 'MM/DD/YYYY')).toBe(true);
  });

  it('should reject invalid dates', () => {
    expect(isValidDate('')).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate('not-a-date')).toBe(false);
    expect(isValidDate('13/45/2024', 'MM/DD/YYYY')).toBe(false);
    expect(isValidDate('2024-13-01', 'YYYY-MM-DD')).toBe(false);
  });
});

describe('isAlphanumeric', () => {
  it('should accept alphanumeric strings', () => {
    expect(isAlphanumeric('abc123')).toBe(true);
    expect(isAlphanumeric('ABC')).toBe(true);
    expect(isAlphanumeric('123')).toBe(true);
  });

  it('should allow spaces when specified', () => {
    expect(isAlphanumeric('hello world', true)).toBe(true);
    expect(isAlphanumeric('hello world', false)).toBe(false);
  });

  it('should reject non-alphanumeric strings', () => {
    expect(isAlphanumeric('hello!')).toBe(false);
    expect(isAlphanumeric('test@email')).toBe(false);
    expect(isAlphanumeric('path/to/file')).toBe(false);
  });
});

describe('isInRange', () => {
  it('should return true for values within range', () => {
    expect(isInRange(5, 1, 10)).toBe(true);
    expect(isInRange(1, 1, 10)).toBe(true);
    expect(isInRange(10, 1, 10)).toBe(true);
    expect(isInRange(5.5, 1, 10)).toBe(true);
  });

  it('should return false for values outside range', () => {
    expect(isInRange(0, 1, 10)).toBe(false);
    expect(isInRange(11, 1, 10)).toBe(false);
    expect(isInRange(-5, 1, 10)).toBe(false);
  });

  it('should handle string numbers', () => {
    expect(isInRange('5', 1, 10)).toBe(true);
    expect(isInRange('15', 1, 10)).toBe(false);
  });

  it('should return false for non-numeric values', () => {
    expect(isInRange('not-a-number', 1, 10)).toBe(false);
  });
});

describe('isRequired', () => {
  it('should return true for non-empty values', () => {
    expect(isRequired('hello')).toBe(true);
    expect(isRequired(['item'])).toBe(true);
    expect(isRequired(0)).toBe(true);
    expect(isRequired(false)).toBe(true);
  });

  it('should return false for empty values', () => {
    expect(isRequired(null)).toBe(false);
    expect(isRequired(undefined)).toBe(false);
    expect(isRequired('')).toBe(false);
    expect(isRequired('   ')).toBe(false);
    expect(isRequired([])).toBe(false);
  });
});

describe('isValidFileType', () => {
  it('should accept valid file types by MIME type', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    expect(isValidFileType(file, ['image/jpeg', 'image/png'])).toBe(true);
  });

  it('should accept valid file types by extension', () => {
    const file = new File([''], 'document.pdf', { type: 'application/pdf' });
    expect(isValidFileType(file, ['pdf', 'doc'])).toBe(true);
  });

  it('should reject invalid file types', () => {
    const file = new File([''], 'script.exe', { type: 'application/x-msdownload' });
    expect(isValidFileType(file, ['image/jpeg', 'image/png'])).toBe(false);
  });

  it('should return false for null/undefined inputs', () => {
    expect(isValidFileType(null, ['image/jpeg'])).toBe(false);
    expect(isValidFileType(undefined, ['image/jpeg'])).toBe(false);
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    expect(isValidFileType(file, null)).toBe(false);
    expect(isValidFileType(file, [])).toBe(false);
  });
});

describe('isValidFileSize', () => {
  it('should accept files within size limit', () => {
    // Create a 1KB file (1024 bytes)
    const content = new Array(1024).fill('a').join('');
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    expect(isValidFileSize(file, 1)).toBe(true);
  });

  it('should reject files exceeding size limit', () => {
    // Create a 2MB file
    const content = new Array(2 * 1024 * 1024).fill('a').join('');
    const file = new File([content], 'large.txt', { type: 'text/plain' });
    expect(isValidFileSize(file, 1)).toBe(false);
  });

  it('should return false for null file', () => {
    expect(isValidFileSize(null, 1)).toBe(false);
  });
});

describe('validateForm', () => {
  let form;

  beforeEach(() => {
    form = document.createElement('form');
    const emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.value = '';
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.name = 'password';
    passwordInput.value = '';
    form.appendChild(passwordInput);
  });

  it('should return valid for empty rules', () => {
    const result = validateForm(form, {});
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should validate required fields', () => {
    const rules = {
      email: [{ type: 'required', message: 'Email is required' }]
    };
    const result = validateForm(form, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toContain('Email is required');
  });

  it('should validate email format', () => {
    form.elements.email.value = 'invalid-email';
    const rules = {
      email: [{ type: 'email', message: 'Invalid email' }]
    };
    const result = validateForm(form, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toContain('Invalid email');
  });

  it('should validate password strength', () => {
    form.elements.password.value = 'weak';
    const rules = {
      password: [{ type: 'password', message: 'Weak password' }]
    };
    const result = validateForm(form, rules);
    expect(result.isValid).toBe(false);
  });

  it('should support custom validators', () => {
    form.elements.email.value = 'test@blocked.com';
    const rules = {
      email: [
        {
          type: 'custom',
          validator: value => !value.includes('blocked.com'),
          message: 'This domain is not allowed'
        }
      ]
    };
    const result = validateForm(form, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toContain('This domain is not allowed');
  });
});

describe('displayValidationErrors', () => {
  let form;

  beforeEach(() => {
    form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'email';
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-3';
    wrapper.appendChild(input);
    form.appendChild(wrapper);
  });

  it('should add is-invalid class to field', () => {
    const errors = { email: ['Invalid email'] };
    displayValidationErrors(form, errors);
    expect(form.elements.email.classList.contains('is-invalid')).toBe(true);
  });

  it('should add invalid-feedback element', () => {
    const errors = { email: ['Invalid email'] };
    displayValidationErrors(form, errors);
    const feedback = form.querySelector('.invalid-feedback');
    expect(feedback).not.toBeNull();
    expect(feedback.textContent).toBe('Invalid email');
  });

  it('should clear previous errors before displaying new ones', () => {
    const errors = { email: ['First error'] };
    displayValidationErrors(form, errors);
    displayValidationErrors(form, { email: ['Second error'] });
    const feedbacks = form.querySelectorAll('.invalid-feedback');
    expect(feedbacks.length).toBe(1);
    expect(feedbacks[0].textContent).toBe('Second error');
  });
});

describe('clearValidationErrors', () => {
  let form;

  beforeEach(() => {
    form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'email';
    input.classList.add('is-invalid');
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = 'Error message';
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    wrapper.appendChild(feedback);
    form.appendChild(wrapper);
  });

  it('should remove is-invalid class', () => {
    clearValidationErrors(form);
    expect(form.elements.email.classList.contains('is-invalid')).toBe(false);
  });

  it('should remove invalid-feedback elements', () => {
    clearValidationErrors(form);
    const feedback = form.querySelector('.invalid-feedback');
    expect(feedback).toBeNull();
  });
});
