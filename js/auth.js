// Authentication module for CyberShield project

/**
 * Set button loading state
 * @param {HTMLElement} button - The button element
 * @param {boolean} isLoading - Whether button is loading
 */
function setButtonLoading(button, isLoading) {
    const originalText = button.dataset.originalText || button.textContent;
    if (isLoading) {
        button.dataset.originalText = originalText;
        button.innerHTML = '<span class="spinner"></span> Loading...';
        button.disabled = true;
        button.classList.add('btn-loading');
    } else {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('btn-loading');
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Handle user signup
 * @param {Event} e - Form submit event
 */
async function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    // Clear previous messages
    clearMessages();
    
    // Validation
    if (!username || !email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    if (username.length < 3) {
        showError('Username must be at least 3 characters');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    // Set loading state
    setButtonLoading(submitBtn, true);
    
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Signup failed. Please try again.');
            setButtonLoading(submitBtn, false);
            return;
        }
        
        // Store token
        localStorage.setItem('cs_token', data.token);
        localStorage.setItem('cs_user', JSON.stringify({ username: data.username, email: data.email }));
        
        showSuccess('Account created successfully! Redirecting...');
        
        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
        
    } catch (error) {
        showError('Network error. Please check your connection and try again.');
        console.error('Signup error:', error);
        setButtonLoading(submitBtn, false);
    }
}

/**
 * Handle user login
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Clear previous messages
    clearMessages();
    
    // Validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Set loading state
    setButtonLoading(submitBtn, true);
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Login failed. Please try again.');
            setButtonLoading(submitBtn, false);
            return;
        }
        
        // Store token
        localStorage.setItem('cs_token', data.token);
        localStorage.setItem('cs_user', JSON.stringify({ username: data.username, email: data.email }));
        
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
        
    } catch (error) {
        showError('Network error. Please check your connection and try again.');
        console.error('Login error:', error);
        setButtonLoading(submitBtn, false);
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    window.location.href = 'login.html';
}

/**
 * Check if user is already logged in on auth pages
 */
function checkAuthPage() {
    const token = getToken();
    const currentPage = window.location.pathname.split('/').pop() || '';
    
    // If user is logged in and on login/signup pages, redirect to home
    if (token && (currentPage === 'login.html' || currentPage === '')) {
        window.location.href = 'index.html';
    }
}

/**
 * Toggle between login and signup forms with smooth animation
 */
function toggleAuthForms() {
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const loginFormContainer = document.querySelector('#loginForm')?.closest('.auth-form');
    const signupFormContainer = document.getElementById('signupFormContainer');
    
    if (showSignupBtn && signupFormContainer && loginFormContainer) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginFormContainer.style.opacity = '0';
            loginFormContainer.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                loginFormContainer.style.display = 'none';
                signupFormContainer.style.display = 'block';
                signupFormContainer.style.opacity = '0';
                signupFormContainer.style.transform = 'translateX(10px)';
                setTimeout(() => {
                    signupFormContainer.style.opacity = '1';
                    signupFormContainer.style.transform = 'translateX(0)';
                }, 10);
            }, 300);
        });
    }
    
    if (showLoginBtn && signupFormContainer && loginFormContainer) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            signupFormContainer.style.opacity = '0';
            signupFormContainer.style.transform = 'translateX(10px)';
            setTimeout(() => {
                signupFormContainer.style.display = 'none';
                loginFormContainer.style.display = 'block';
                loginFormContainer.style.opacity = '0';
                loginFormContainer.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    loginFormContainer.style.opacity = '1';
                    loginFormContainer.style.transform = 'translateX(0)';
                }, 10);
            }, 300);
        });
    }
}

/**
 * Setup form input event listeners for real-time validation feedback
 */
function setupFormValidation() {
    // Signup form validation
    const signupUsername = document.getElementById('signupUsername');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    
    if (signupUsername) {
        signupUsername.addEventListener('blur', function() {
            if (this.value.length > 0 && this.value.length < 3) {
                this.classList.add('input-error');
            } else {
                this.classList.remove('input-error');
            }
        });
    }
    
    if (signupEmail) {
        signupEmail.addEventListener('blur', function() {
            if (this.value.length > 0 && !isValidEmail(this.value)) {
                this.classList.add('input-error');
            } else {
                this.classList.remove('input-error');
            }
        });
    }
    
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 6) {
                this.classList.add('input-error');
            } else {
                this.classList.remove('input-error');
            }
        });
    }
    
    // Login form validation
    const loginEmail = document.getElementById('email');
    if (loginEmail) {
        loginEmail.addEventListener('blur', function() {
            if (this.value.length > 0 && !isValidEmail(this.value)) {
                this.classList.add('input-error');
            } else {
                this.classList.remove('input-error');
            }
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check auth status on page load
    checkAuthPage();
    
    // Add event listeners to forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Setup form validation
    setupFormValidation();
    
    // Toggle between forms
    toggleAuthForms();
    
    // Add logout functionality to logout link
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
});
