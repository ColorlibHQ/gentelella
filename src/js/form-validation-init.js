/**
 * Form Validation Initialization
 * Demonstrates how to use the validation utilities with Gentelella forms
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Bootstrap 5 form validation
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener(
      'submit',
      event => {
        event.preventDefault();
        event.stopPropagation();

        // Get validation utilities
        const { validateForm, displayValidationErrors, clearValidationErrors } =
          window.ValidationUtils;

        // Define validation rules based on form type
        const rules = getValidationRules(form);

        // Validate form
        const validationResult = validateForm(form, rules);

        if (!validationResult.isValid) {
          displayValidationErrors(form, validationResult.errors);
          form.classList.add('was-validated');
        } else {
          clearValidationErrors(form);
          form.classList.add('was-validated');

          // Form is valid - submit or process
          handleValidForm(form);
        }
      },
      false
    );

    // Clear errors on input change
    form.addEventListener('input', event => {
      if (event.target.classList.contains('is-invalid')) {
        event.target.classList.remove('is-invalid');
        const feedback = event.target.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.remove();
        }
      }
    });
  });

  // Add real-time validation for specific fields
  initializeFieldValidation();
});

/**
 * Get validation rules based on form ID or class
 */
function getValidationRules(form) {
  const formId = form.id;

  // Registration form rules
  if (formId === 'registrationForm' || form.classList.contains('registration-form')) {
    return {
      firstName: [
        { type: 'required', message: 'First name is required' },
        {
          type: 'custom',
          validator: value => value.length >= 2,
          message: 'First name must be at least 2 characters'
        }
      ],
      lastName: [
        { type: 'required', message: 'Last name is required' },
        {
          type: 'custom',
          validator: value => value.length >= 2,
          message: 'Last name must be at least 2 characters'
        }
      ],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ],
      phone: [{ type: 'phone', message: 'Please enter a valid phone number' }],
      password: [
        { type: 'required', message: 'Password is required' },
        {
          type: 'password',
          message: 'Password must include uppercase, lowercase, number, and special character'
        }
      ],
      confirmPassword: [
        { type: 'required', message: 'Please confirm your password' },
        {
          type: 'custom',
          validator: (value, formData) => value === formData.get('password'),
          message: 'Passwords do not match'
        }
      ]
    };
  }

  // Contact form rules
  if (formId === 'contactForm' || form.classList.contains('contact-form')) {
    return {
      name: [{ type: 'required', message: 'Name is required' }],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ],
      subject: [{ type: 'required', message: 'Subject is required' }],
      message: [
        { type: 'required', message: 'Message is required' },
        {
          type: 'custom',
          validator: value => value.length >= 10,
          message: 'Message must be at least 10 characters'
        }
      ]
    };
  }

  // Payment form rules
  if (formId === 'paymentForm' || form.classList.contains('payment-form')) {
    return {
      cardNumber: [
        { type: 'required', message: 'Card number is required' },
        {
          type: 'custom',
          validator: value => window.ValidationUtils.isValidCreditCard(value),
          message: 'Please enter a valid credit card number'
        }
      ],
      cardholderName: [{ type: 'required', message: 'Cardholder name is required' }],
      expiryDate: [
        { type: 'required', message: 'Expiry date is required' },
        {
          type: 'custom',
          validator: value => {
            const [month, year] = value.split('/');
            const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
            return expiry > new Date();
          },
          message: 'Card has expired or invalid date'
        }
      ],
      cvv: [
        { type: 'required', message: 'CVV is required' },
        { type: 'custom', validator: value => /^\d{3,4}$/.test(value), message: 'Invalid CVV' }
      ]
    };
  }

  // Default rules for generic forms
  return {};
}

/**
 * Initialize real-time field validation
 */
function initializeFieldValidation() {
  const { isValidEmail, isValidPhone, validatePassword } = window.ValidationUtils;

  // Email fields
  document.querySelectorAll('input[type="email"]').forEach(emailField => {
    emailField.addEventListener('blur', function () {
      if (this.value && !isValidEmail(this.value)) {
        showFieldError(this, 'Please enter a valid email address');
      } else {
        clearFieldError(this);
      }
    });
  });

  // Phone fields
  document.querySelectorAll('input[type="tel"]').forEach(phoneField => {
    phoneField.addEventListener('blur', function () {
      if (this.value && !isValidPhone(this.value)) {
        showFieldError(this, 'Please enter a valid phone number');
      } else {
        clearFieldError(this);
      }
    });
  });

  // Password fields with strength indicator
  document
    .querySelectorAll('input[type="password"][data-strength-indicator]')
    .forEach(passwordField => {
      const strengthIndicator = document.getElementById(passwordField.dataset.strengthIndicator);

      passwordField.addEventListener('input', function () {
        const result = validatePassword(this.value);
        updatePasswordStrength(strengthIndicator, result);
      });
    });

  // Credit card fields
  document.querySelectorAll('input[data-validate="creditcard"]').forEach(cardField => {
    cardField.addEventListener('input', function () {
      // Format credit card number
      let value = this.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      this.value = formattedValue;
    });
  });
}

/**
 * Show field-specific error
 */
function showFieldError(field, message) {
  field.classList.add('is-invalid');

  // Remove existing error message
  const existingError = field.parentElement.querySelector('.invalid-feedback');
  if (existingError) {
    existingError.remove();
  }

  // Add new error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;
  field.parentElement.appendChild(errorDiv);
}

/**
 * Clear field-specific error
 */
function clearFieldError(field) {
  field.classList.remove('is-invalid');
  const errorDiv = field.parentElement.querySelector('.invalid-feedback');
  if (errorDiv) {
    errorDiv.remove();
  }
}

/**
 * Update password strength indicator
 */
function updatePasswordStrength(indicator, result) {
  if (!indicator) {
    return;
  }

  const strengthLevels = ['weak', 'fair', 'good', 'strong', 'excellent'];
  const strengthColors = ['danger', 'warning', 'info', 'primary', 'success'];
  const strengthLevel = strengthLevels[result.score] || 'weak';
  const strengthColor = strengthColors[result.score] || 'danger';

  indicator.innerHTML = `
    <div class="progress" style="height: 5px;">
      <div class="progress-bar bg-${strengthColor}" role="progressbar" 
           style="width: ${(result.score + 1) * 20}%"></div>
    </div>
    <small class="text-${strengthColor}">Password strength: ${strengthLevel}</small>
  `;

  if (result.feedback.length > 0) {
    indicator.innerHTML += `<small class="d-block text-muted">${result.feedback[0]}</small>`;
  }
}

/**
 * Handle valid form submission
 */
function handleValidForm(form) {
  // Show success message
  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show';
  alert.innerHTML = `
    <strong>Success!</strong> Form validated successfully.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  form.insertBefore(alert, form.firstChild);

  // In a real application, you would submit the form data here
  console.log('Form is valid and ready for submission');

  // Optional: Reset form after successful submission
  setTimeout(() => {
    form.reset();
    form.classList.remove('was-validated');
    alert.remove();
  }, 3000);
}

// Export for use in other modules
export { getValidationRules, initializeFieldValidation };
