// Form Handling System
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitButton = this.form?.querySelector('.submit-btn');
        this.successMessage = document.getElementById('form-success');
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        } else {
            // Specific field validation
            switch (fieldName) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long';
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters long';
                    }
                    break;
            }
        }

        this.showError(field, errorMessage);
        return isValid;
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (message) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            field.style.borderColor = '#ef4444';
        } else {
            errorElement.classList.remove('show');
            field.style.borderColor = '';
        }
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        errorElement.classList.remove('show');
        field.style.borderColor = '';
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        try {
            await this.submitForm();
            this.showSuccess();
        } catch (error) {
            this.showError(this.form, 'Failed to send message. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Simulate API call (replace with actual email service)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve(data);
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    setLoading(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
        } else {
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
        }
    }

    showSuccess() {
        this.form.style.display = 'none';
        if (this.successMessage) {
            this.successMessage.classList.add('show');
        }
        
        // Reset form after delay
        setTimeout(() => {
            this.resetForm();
        }, 5000);
    }

    resetForm() {
        this.form.reset();
        this.form.style.display = 'block';
        if (this.successMessage) {
            this.successMessage.classList.remove('show');
        }
        
        // Clear all errors
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => this.clearError(field));
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}
