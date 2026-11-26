// Validation utility functions for forms

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            // Add real-time validation
            const inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    handleSubmit(e) {
        this.clearAllErrors();
        if (!this.validateForm()) {
            e.preventDefault();
            this.showFirstError();
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${this.getFieldLabel(field)} is required`;
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Password validation
        else if (field.type === 'password' && value) {
            if (value.length < 8) {
                errorMessage = 'Password must be at least 8 characters long';
                isValid = false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                errorMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                isValid = false;
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }
        // URL validation
        else if (field.type === 'url' && value) {
            try {
                new URL(value);
            } catch {
                errorMessage = 'Please enter a valid URL (include http:// or https://)';
                isValid = false;
            }
        }
        // Date validation (for birth date)
        else if (field.type === 'date' && value) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18 || age > 120) {
                errorMessage = 'You must be at least 18 years old';
                isValid = false;
            }
        }
        // Name validation
        else if (field.type === 'name' && value) {
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    getFieldLabel(field) {
        // Try to get label from associated label element
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        // Try to get from placeholder
        if (field.placeholder) {
            return field.placeholder;
        }
        // Try to get from name/id
        return field.name || field.id || 'This field';
    }

    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        // Add error class to field
        field.classList.add('error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        // Insert error message after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.field-error');
        errorElements.forEach(el => el.remove());
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    showFirstError() {
        const firstErrorField = this.form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Password confirmation validation
function validatePasswordConfirmation(passwordField, confirmField) {
    const password = passwordField.value;
    const confirm = confirmField.value;

    if (password && confirm && password !== confirm) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = 'Passwords do not match';

        // Remove existing error
        const existingError = confirmField.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();

        confirmField.classList.add('error');
        confirmField.parentNode.insertBefore(errorElement, confirmField.nextSibling);
        return false;
    } else {
        confirmField.classList.remove('error');
        const existingError = confirmField.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        return true;
    }
}

// Utility function to add CSS for validation styles
function addValidationStyles() {
    if (!document.getElementById('validation-styles')) {
        const style = document.createElement('style');
        style.id = 'validation-styles';
        style.textContent = `
            .error {
                border-color: #ef4444 !important;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
            }

            .field-error {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-input, .form-textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                font-size: 1rem;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }

            .form-input:focus, .form-textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize validation styles
addValidationStyles();
