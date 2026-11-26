// Admin-specific validation functions
// This file contains validation logic specific to admin forms

class AdminFormValidator extends FormValidator {
    constructor(formId) {
        super(formId);
        this.initAdminValidation();
    }

    initAdminValidation() {
        // Add admin-specific validation rules
        this.addAdminFieldValidation();
    }

    addAdminFieldValidation() {
        // Override or extend field validation for admin-specific fields
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Add custom validation for admin fields
            if (input.id === 'destPrice' || input.name === 'price') {
                input.addEventListener('blur', () => this.validatePrice(input));
            }

            if (input.id === 'destRating' || input.name === 'rating') {
                input.addEventListener('blur', () => this.validateRating(input));
            }

            if (input.type === 'url') {
                input.addEventListener('blur', () => this.validateAdminUrl(input));
            }
        });
    }

    validatePrice(field) {
        const value = field.value.trim();
        if (value && (isNaN(value) || parseFloat(value) <= 0)) {
            this.showFieldError(field, 'Please enter a valid price greater than 0');
            return false;
        }
        return true;
    }

    validateRating(field) {
        const value = field.value.trim();
        const rating = parseFloat(value);
        if (value && (isNaN(rating) || rating < 0 || rating > 5)) {
            this.showFieldError(field, 'Rating must be between 0 and 5');
            return false;
        }
        return true;
    }

    validateAdminUrl(field) {
        const value = field.value.trim();
        if (value) {
            try {
                const url = new URL(value);
                // Allow common social media domains
                const allowedDomains = [
                    'facebook.com', 'twitter.com', 'instagram.com', 'youtube.com',
                    'linkedin.com', 'tiktok.com', 'pinterest.com', 'snapchat.com'
                ];
                const domain = url.hostname.replace('www.', '');

                if (!allowedDomains.some(allowed => domain.includes(allowed))) {
                    this.showFieldError(field, 'Please enter a valid social media URL');
                    return false;
                }
            } catch {
                this.showFieldError(field, 'Please enter a valid URL starting with http:// or https://');
                return false;
            }
        }
        return true;
    }

    // Override the validateField method to include admin-specific validations
    validateField(field) {
        // First run the base validation
        let isValid = super.validateField(field);

        // Then add admin-specific validations
        if (field.id === 'destPrice' || field.name === 'price') {
            if (!this.validatePrice(field)) isValid = false;
        }

        if (field.id === 'destRating' || field.name === 'rating') {
            if (!this.validateRating(field)) isValid = false;
        }

        if (field.type === 'url') {
            if (!this.validateAdminUrl(field)) isValid = false;
        }

        return isValid;
    }
}

// Admin-specific utility functions

// Validate blog post content
function validateBlogContent(content) {
    if (!content || content.trim().length < 100) {
        return { valid: false, message: 'Blog content must be at least 100 characters long' };
    }
    return { valid: true };
}

// Validate destination description
function validateDestinationDescription(description) {
    if (!description || description.trim().length < 50) {
        return { valid: false, message: 'Destination description must be at least 50 characters long' };
    }
    return { valid: true };
}

// Validate admin email (must be from allowed domains)
function validateAdminEmail(email) {
    const allowedDomains = ['admin.com', 'travel.com', 'company.com'];
    const domain = email.split('@')[1];
    if (!allowedDomains.includes(domain)) {
        return { valid: false, message: 'Admin email must be from an authorized domain' };
    }
    return { valid: true };
}

// Initialize admin validation styles (additional to base styles)
function addAdminValidationStyles() {
    if (!document.getElementById('admin-validation-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-validation-styles';
        style.textContent = `
            /* Admin-specific validation styles */
            .admin-form .error {
                border-color: #dc2626 !important;
                background-color: #fef2f2 !important;
            }

            .admin-form .field-error {
                color: #dc2626;
                font-size: 0.75rem;
                font-weight: 500;
            }

            .admin-form .form-group.success input,
            .admin-form .form-group.success textarea,
            .admin-form .form-group.success select {
                border-color: #16a34a !important;
                box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.1) !important;
            }

            .admin-form .form-group.success::after {
                content: '✓';
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: #16a34a;
                font-weight: bold;
            }

            /* Enhanced modal validation */
            .modal .error {
                border-color: #dc2626 !important;
            }

            .modal .field-error {
                margin-top: 0.5rem;
                font-size: 0.75rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize admin validation
document.addEventListener('DOMContentLoaded', function() {
    addAdminValidationStyles();
});
