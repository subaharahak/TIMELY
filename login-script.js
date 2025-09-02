// Timely Login Page - Interactive JavaScript with Premium Animations

class TimelyLogin {
    constructor() {
        this.isLoading = false;
        this.stats = {
            totalStudents: 2847,
            totalClasses: 156,
            attendanceRate: 94.2,
            timeSaved: 1247
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateStats();
        this.startBackgroundAnimations();
        this.setupFormValidation();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Password toggle
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordInput = document.getElementById('password');
        
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }

        // Social login buttons
        const googleBtn = document.querySelector('.google-btn');
        const microsoftBtn = document.querySelector('.microsoft-btn');
        
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialLogin('google');
            });
        }
        
        if (microsoftBtn) {
            microsoftBtn.addEventListener('click', () => {
                this.handleSocialLogin('microsoft');
            });
        }

        // Input focus effects
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.animateInputFocus(input);
            });
            
            input.addEventListener('blur', () => {
                this.animateInputBlur(input);
            });
        });

        // Remember me checkbox
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe) {
            rememberMe.addEventListener('change', () => {
                this.handleRememberMe();
            });
        }

        // Forgot password link
        const forgotPassword = document.querySelector('.forgot-password');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    }

    setupFormValidation() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.validateEmail(emailInput);
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.validatePassword(passwordInput);
            });
        }
    }

    validateEmail(input) {
        const email = input.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        this.updateInputValidation(input, isValid);
        return isValid;
    }

    validatePassword(input) {
        const password = input.value;
        const isValid = password.length >= 6;
        
        this.updateInputValidation(input, isValid);
        return isValid;
    }

    updateInputValidation(input, isValid) {
        const container = input.closest('.input-container');
        if (!container) return;
        
        if (isValid) {
            container.classList.add('valid');
            container.classList.remove('invalid');
        } else if (input.value.length > 0) {
            container.classList.add('invalid');
            container.classList.remove('valid');
        } else {
            container.classList.remove('valid', 'invalid');
        }
    }

    animateInputFocus(input) {
        const container = input.closest('.input-container');
        if (container) {
            container.classList.add('focused');
        }
    }

    animateInputBlur(input) {
        const container = input.closest('.input-container');
        if (container) {
            container.classList.remove('focused');
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('passwordToggle');
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
        
        // Add animation effect
        toggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            toggleBtn.style.transform = 'scale(1)';
        }, 150);
    }

    handleRememberMe() {
        const rememberMe = document.getElementById('rememberMe');
        const isChecked = rememberMe.checked;
        
        // Add visual feedback
        const checkmark = document.querySelector('.checkmark');
        if (checkmark) {
            checkmark.style.transform = isChecked ? 'scale(1.1)' : 'scale(1)';
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Store preference
        localStorage.setItem('timely_remember_me', isChecked);
    }

    handleForgotPassword() {
        this.showNotification('Password reset link sent to your email!', 'info');
        
        // Add animation to the link
        const forgotLink = document.querySelector('.forgot-password');
        forgotLink.style.transform = 'scale(0.95)';
        setTimeout(() => {
            forgotLink.style.transform = 'scale(1)';
        }, 150);
    }

    async handleLogin() {
        if (this.isLoading) return;
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!this.validateEmail(document.getElementById('email'))) {
            this.showError('Please enter a valid email address');
            return;
        }
        
        if (!this.validatePassword(document.getElementById('password'))) {
            this.showError('Password must be at least 6 characters long');
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Simulate API call
            await this.simulateLogin(email, password);
            
            // Show success animation
            this.showSuccessModal();
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            this.showError('Invalid credentials. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async simulateLogin(email, password) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock authentication (replace with real API call)
        const validCredentials = {
            'teacher@timely.com': 'password123',
            'admin@timely.com': 'admin123',
            'demo@timely.com': 'demo123'
        };
        
        if (validCredentials[email] && validCredentials[email] === password) {
            // Store login session
            localStorage.setItem('timely_user', JSON.stringify({
                email: email,
                loginTime: new Date().toISOString(),
                role: 'teacher'
            }));
            return true;
        } else {
            throw new Error('Invalid credentials');
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');
        
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('show');
            
            // Add confetti effect
            this.createConfetti();
        }
    }

    showError(message) {
        const toast = document.getElementById('errorToast');
        const messageEl = toast.querySelector('.toast-message');
        
        if (messageEl) {
            messageEl.textContent = message;
        }
        
        toast.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    showNotification(message, type = 'info') {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-glow);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            transform: translateX(400px);
            transition: var(--transition-smooth);
            z-index: 3000;
            max-width: 400px;
            border: 1px solid var(--border-glass);
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    handleSocialLogin(provider) {
        this.showNotification(`Redirecting to ${provider} login...`, 'info');
        
        // Add button animation
        const btn = document.querySelector(`.${provider}-btn`);
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Simulate social login (replace with real OAuth)
        setTimeout(() => {
            this.showNotification(`${provider} login not implemented yet`, 'warning');
        }, 1000);
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((statEl, index) => {
            const finalValue = statEl.textContent;
            const isPercentage = finalValue.includes('%');
            const isNumber = !isNaN(parseFloat(finalValue.replace(/[^\d.]/g, '')));
            
            if (isNumber) {
                const targetValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
                this.animateNumber(statEl, 0, targetValue, 2000, isPercentage, index * 200);
            }
        });
    }

    animateNumber(element, start, end, duration, isPercentage = false, delay = 0) {
        setTimeout(() => {
            const startTime = performance.now();
            const suffix = isPercentage ? '%' : '';
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentValue = start + (end - start) * easeOutCubic;
                
                element.textContent = Math.round(currentValue) + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }, delay);
    }

    startBackgroundAnimations() {
        // Animate floating shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = `${index * 2}s`;
        });
        
        // Animate particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            particle.style.animationDelay = `${index * 0.5}s`;
        });
        
        // Animate orbs
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            orb.style.animationDelay = `${index * 3}s`;
        });
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.stat-item, .feature-item, .form-group');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 20);
        }
    }

    createConfettiPiece(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            top: -10px;
            left: ${Math.random() * 100}%;
            z-index: 3000;
            pointer-events: none;
            border-radius: 2px;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            { 
                transform: 'translateY(0px) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`,
                opacity: 0
            }
        ], {
            duration: 3000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the login system when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Timely Login System...');
    window.timelyLogin = new TimelyLogin();
    console.log('Timely Login System initialized successfully');
});

// Add some additional CSS for validation states
const additionalStyles = `
    .input-container.valid input {
        border-color: #10b981;
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    }
    
    .input-container.invalid input {
        border-color: #ef4444;
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }
    
    .input-container.focused input {
        transform: translateY(-2px);
    }
    
    .stat-item.animate {
        animation: statSlideIn 0.6s ease-out;
    }
    
    .feature-item.animate {
        animation: featureSlideIn 0.6s ease-out;
    }
    
    .form-group.animate {
        animation: formSlideIn 0.6s ease-out;
    }
    
    @keyframes statSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes featureSlideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes formSlideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
