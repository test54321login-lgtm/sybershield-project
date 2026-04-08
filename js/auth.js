// Authentication module for CyberShield project

/**
 * Handle user signup
 * @param {Event} e - Form submit event
 */
async function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Basic validation
    if (!username || !email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    try {
        const response = await apiFetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        if (!response.ok) {
            const data = await response.json();
            showError(data.error || 'Signup failed');
            return;
        }
        
        const data = await response.json();
        
        // Store token and redirect
        localStorage.setItem('cs_token', data.token);
        showSuccess('Account created successfully!');
        
        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Signup error:', error);
    }
}

/**
 * Handle user login
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    try {
        const response = await apiFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const data = await response.json();
            showError(data.error || 'Login failed');
            return;
        }
        
        const data = await response.json();
        
        // Store token and redirect
        localStorage.setItem('cs_token', data.token);
        showSuccess('Login successful!');
        
        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Login error:', error);
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    localStorage.removeItem('cs_token');
    window.location.href = 'login.html';
}

/**
 * Check if user is already logged in on auth pages
 */
function checkAuthPage() {
    const token = getToken();
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is logged in and on login page, redirect to home
    if (token && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'index.html';
    }
    
    // If user is not logged in and on protected page, redirect to login
    if (!token && currentPage !== 'login.html' && currentPage !== 'index.html' && currentPage !== 'feed.html' && currentPage !== 'encyclopedia' && currentPage.includes('encyclopedia')) {
        // Allow access to encyclopedia pages without login
        if (currentPage !== 'index.html' && currentPage !== 'feed.html' && !currentPage.includes('encyclopedia')) {
            window.location.href = 'login.html';
        }
    }
}

/**
 * Toggle between login and signup forms
 */
function toggleAuthForms() {
    const loginForm = document.querySelector('#loginForm').closest('.auth-form');
    const signupForm = document.getElementById('signupFormContainer');
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
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