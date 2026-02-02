document.addEventListener('DOMContentLoaded', function () {
    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength indicator
    const passwordInput = document.getElementById('id_password1');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const password = this.value;
            let strength = 0;
            let text = 'Enter a password';

            if (password.length > 0) {
                strength = calculatePasswordStrength(password);

                if (strength < 2) {
                    text = 'Weak';
                    passwordStrength.className = 'password-strength weak';
                } else if (strength < 3) {
                    text = 'Fair';
                    passwordStrength.className = 'password-strength fair';
                } else if (strength < 4) {
                    text = 'Good';
                    passwordStrength.className = 'password-strength good';
                } else {
                    text = 'Strong';
                    passwordStrength.className = 'password-strength strong';
                }
            } else {
                passwordStrength.className = 'password-strength';
            }

            strengthText.textContent = text;
        });
    }

    function calculatePasswordStrength(password) {
        let strength = 0;

        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Character variety checks
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        return Math.min(strength, 4);
    }

    // Form validation
    const form = document.getElementById('registerForm');
    if (form) {
        const submitButton = form.querySelector('.register-button');

        form.addEventListener('submit', function (e) {
            const termsCheckbox = document.getElementById('termsCheckbox');

            if (!termsCheckbox.checked) {
                e.preventDefault();
                alert('Please agree to the Terms of Service and Privacy Policy');
                termsCheckbox.focus();
                return;
            }

            // Show loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            // You can add AJAX submission here if needed
            // For now, just let the form submit normally
        });

        // Auto-focus first input
        const firstInput = form.querySelector('input[type="text"], input[type="email"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // Input field auto-advance (for better UX)
        const inputs = form.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' && index < inputs.length - 1) {
                    e.preventDefault();
                    inputs[index + 1].focus();
                }
            });
        });
    }

    // Animate form sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });

    // Social button interactions
    document.querySelectorAll('.social-button').forEach(button => {
        button.addEventListener('click', function () {
            const platform = this.classList.contains('google') ? 'Google' :
                this.classList.contains('facebook') ? 'Facebook' : 'Twitter';

            // Add your social login implementation here
            console.log(`Social login with ${platform} clicked`);

            // You would typically redirect to OAuth endpoint here
            // window.location.href = `/auth/${platform.toLowerCase()}/`;
        });
    });

    // Real-time username availability check (example)
    const usernameInput = document.getElementById('id_username');
    if (usernameInput) {
        let timeout;
        usernameInput.addEventListener('input', function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.value.length >= 3) {
                    checkUsernameAvailability(this.value);
                }
            }, 500);
        });
    }

    function checkUsernameAvailability(username) {
        // This is a mock function - implement actual API call
        console.log(`Checking availability for: ${username}`);
        // You would make an AJAX call to your backend here
    }
});
