/**
 * Input Validation Utilities
 * Provides comprehensive validation functions for form inputs
 */

/**
 * Email validation using HTML5 spec
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone number validation (international format support)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export function isValidPhone(phone) {
  // Remove all non-digit characters except + at the beginning
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Check for valid formats: +1234567890, 1234567890, etc.
  const phoneRegex = /^(\+?\d{1,3})?[\d\s\-\(\)]{7,}$/;
  return phoneRegex.test(cleaned) && cleaned.replace(/\D/g, '').length >= 7;
}

/**
 * URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL format
 */
export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with score and feedback
 */
export function validatePassword(password) {
  const result = {
    isValid: false,
    score: 0,
    feedback: []
  };

  // Check length
  if (password.length >= 8) {
    result.score += 1;
  } else {
    result.feedback.push('Password must be at least 8 characters long');
  }

  // Check for uppercase
  if (/[A-Z]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Include at least one uppercase letter');
  }

  // Check for lowercase
  if (/[a-z]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Include at least one lowercase letter');
  }

  // Check for numbers
  if (/\d/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Include at least one number');
  }

  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Include at least one special character');
  }

  result.isValid = result.score >= 4;
  return result;
}

/**
 * Credit card number validation (Luhn algorithm)
 * @param {string} cardNumber - Credit card number to validate
 * @returns {boolean} - True if valid credit card number
 */
export function isValidCreditCard(cardNumber) {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Date validation
 * @param {string} dateString - Date string to validate
 * @param {string} format - Expected format (e.g., 'MM/DD/YYYY', 'YYYY-MM-DD')
 * @returns {boolean} - True if valid date
 */
export function isValidDate(dateString, format = 'YYYY-MM-DD') {
  if (!dateString) {
    return false;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }

  // Additional format validation
  if (format === 'MM/DD/YYYY') {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    return regex.test(dateString);
  } else if (format === 'YYYY-MM-DD') {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return regex.test(dateString);
  }

  return true;
}

/**
 * Alphanumeric validation
 * @param {string} value - Value to validate
 * @param {boolean} allowSpaces - Whether to allow spaces
 * @returns {boolean} - True if valid alphanumeric
 */
export function isAlphanumeric(value, allowSpaces = false) {
  const regex = allowSpaces ? /^[a-zA-Z0-9\s]+$/ : /^[a-zA-Z0-9]+$/;
  return regex.test(value);
}

/**
 * Number range validation
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if within range
 */
export function isInRange(value, min, max) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Required field validation
 * @param {any} value - Value to validate
 * @returns {boolean} - True if value is not empty
 */
export function isRequired(value) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
}

/**
 * File type validation
 * @param {File} file - File object to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types or extensions
 * @returns {boolean} - True if valid file type
 */
export function isValidFileType(file, allowedTypes) {
  if (!file || !allowedTypes || allowedTypes.length === 0) {
    return false;
  }

  const fileType = file.type;
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop().toLowerCase();

  return allowedTypes.some(type => {
    // Check MIME type
    if (type.includes('/')) {
      return fileType === type || fileType.startsWith(type.replace('*', ''));
    }
    // Check extension
    return fileExtension === type.toLowerCase().replace('.', '');
  });
}

/**
 * File size validation
 * @param {File} file - File object to validate
 * @param {number} maxSizeInMB - Maximum file size in megabytes
 * @returns {boolean} - True if file size is within limit
 */
export function isValidFileSize(file, maxSizeInMB) {
  if (!file) {
    return false;
  }
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Form validation helper
 * @param {HTMLFormElement} form - Form element to validate
 * @param {Object} rules - Validation rules for each field
 * @returns {Object} - Validation result with errors
 */
export function validateForm(form, rules) {
  const errors = {};
  const formData = new FormData(form);

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = formData.get(fieldName);
    const fieldErrors = [];

    for (const rule of fieldRules) {
      if (rule.type === 'required' && !isRequired(value)) {
        fieldErrors.push(rule.message || `${fieldName} is required`);
      } else if (rule.type === 'email' && value && !isValidEmail(value)) {
        fieldErrors.push(rule.message || 'Invalid email format');
      } else if (rule.type === 'phone' && value && !isValidPhone(value)) {
        fieldErrors.push(rule.message || 'Invalid phone number');
      } else if (rule.type === 'password' && value) {
        const passwordResult = validatePassword(value);
        if (!passwordResult.isValid) {
          fieldErrors.push(rule.message || passwordResult.feedback[0]);
        }
      } else if (rule.type === 'custom' && rule.validator) {
        const isValid = rule.validator(value, formData);
        if (!isValid) {
          fieldErrors.push(rule.message || 'Invalid value');
        }
      }
    }

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Display validation errors on form
 * @param {HTMLFormElement} form - Form element
 * @param {Object} errors - Validation errors object
 */
export function displayValidationErrors(form, errors) {
  // Clear existing errors
  form.querySelectorAll('.is-invalid').forEach(el => {
    el.classList.remove('is-invalid');
  });
  form.querySelectorAll('.invalid-feedback').forEach(el => {
    el.remove();
  });

  // Display new errors
  for (const [fieldName, fieldErrors] of Object.entries(errors)) {
    const field = form.elements[fieldName];
    if (field) {
      field.classList.add('is-invalid');

      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback';
      errorDiv.textContent = fieldErrors[0]; // Show first error

      // Bootstrap 5: Check for both mb-3 (new) and form-group (legacy) classes
      if (field.parentElement.classList.contains('form-group') ||
          field.parentElement.classList.contains('mb-3')) {
        field.parentElement.appendChild(errorDiv);
      } else {
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
      }
    }
  }
}

/**
 * Clear validation errors from form
 * @param {HTMLFormElement} form - Form element
 */
export function clearValidationErrors(form) {
  form.querySelectorAll('.is-invalid').forEach(el => {
    el.classList.remove('is-invalid');
  });
  form.querySelectorAll('.invalid-feedback').forEach(el => {
    el.remove();
  });
}

// Export all functions as default object for easy importing
export default {
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
};
