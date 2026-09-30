   // Field-level validation
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('registrationForm');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const passwordStrength = document.getElementById('passwordStrength');
            
            // Real-time password strength indicator
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;
                
                // Length check
                if (password.length >= 8) strength += 1;
                // Contains lowercase
                if (/[a-z]/.test(password)) strength += 1;
                // Contains uppercase
                if (/[A-Z]/.test(password)) strength += 1;
                // Contains number
                if (/\d/.test(password)) strength += 1;
                // Contains special char
                if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
                
                // Update strength meter
                const width = strength * 20;
                let color;
                
                if (strength <= 1) color = '#ea4335'; // Weak (red)
                else if (strength <= 3) color = '#fbbc05'; // Medium (yellow)
                else color = '#34a853'; // Strong (green)
                
                passwordStrength.style.width = width + '%';
                passwordStrength.style.backgroundColor = color;
            });
            
            // Confirm password validation
            confirmPasswordInput.addEventListener('input', function() {
                if (this.value !== passwordInput.value) {
                    this.parentElement.classList.add('error');
                    this.nextElementSibling.style.display = 'block';
                } else {
                    this.parentElement.classList.remove('error');
                    this.nextElementSibling.style.display = 'none';
                }
            });
            
            // Field validation on blur
            const fields = form.querySelectorAll('input, select');
            fields.forEach(field => {
                field.addEventListener('blur', function() {
                    validateField(this);
                });
            });
            
            // Form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                fields.forEach(field => {
                    if (!validateField(field)) {
                        isValid = false;
                    }
                });
                
                // Special check for password match
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.parentElement.classList.add('error');
                    confirmPasswordInput.nextElementSibling.style.display = 'block';
                    isValid = false;
                }
                
                if (isValid) {
                    alert('Registration successful!');
                    // form.submit(); // Uncomment to actually submit the form
                } else {
                    // Scroll to first error
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
            
            // Field validation function
            function validateField(field) {
                const errorMessage = field.parentElement.querySelector('.error-message');
                
                // Check required fields
                if (field.required && !field.value.trim()) {
                    field.parentElement.classList.add('error');
                    errorMessage.style.display = 'block';
                    return false;
                }
                
                // Check pattern validation
                if (field.pattern && field.value) {
                    const regex = new RegExp(field.pattern);
                    if (!regex.test(field.value)) {
                        field.parentElement.classList.add('error');
                        errorMessage.style.display = 'block';
                        return false;
                    }
                }
                
                // Check min/max length
                if (field.minLength && field.value.length < field.minLength) {
                    field.parentElement.classList.add('error');
                    errorMessage.style.display = 'block';
                    return false;
                }
                
                // Check max date (for age verification)
                if (field.type === 'date' && field.max && field.value > field.max) {
                    field.parentElement.classList.add('error');
                    errorMessage.style.display = 'block';
                    return false;
                }
                
                // Check email format
                if (field.type === 'email' && field.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        field.parentElement.classList.add('error');
                        errorMessage.style.display = 'block';
                        return false;
                    }
                }
                
                // If all validations pass
                field.parentElement.classList.remove('error');
                errorMessage.style.display = 'none';
                return true;
            }
        });