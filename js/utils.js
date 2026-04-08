// Utility functions for CyberShield project

/**
 * Get JWT token from localStorage
 * @returns {string|null} The JWT token or null if not found
 */
function getToken() {
    return localStorage.getItem('cs_token');
}

/**
 * Check if user is authenticated and redirect to login if not
 */
function authGuard() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
    }
}

/**
 * Clear all messages from the UI
 */
function clearMessages() {
    const errorEl = document.getElementById('errorMessage');
    const successEl = document.getElementById('successMessage');
    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';
}

/**
 * Show error message in the UI with animation
 * @param {string} msg - Error message to display
 * @param {number} duration - Duration to show message in milliseconds (0 = no auto-hide)
 */
function showError(msg, duration = 5000) {
    // Create or update error message element
    let errorEl = document.getElementById('errorMessage');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = 'errorMessage';
        errorEl.className = 'error-message';
        // Insert at the top of the main content area
        const main = document.querySelector('main') || document.body;
        main.insertBefore(errorEl, main.firstChild);
    }
    
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    errorEl.style.animation = 'slideDown 0.3s ease-out';
    
    // Hide after specified duration
    if (duration > 0) {
        setTimeout(() => {
            if (errorEl) {
                errorEl.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => {
                    errorEl.style.display = 'none';
                }, 300);
            }
        }, duration);
    }
}

/**
 * Show success message in the UI with animation
 * @param {string} msg - Success message to display
 * @param {number} duration - Duration to show message in milliseconds (0 = no auto-hide)
 */
function showSuccess(msg, duration = 3000) {
    // Create or update success message element
    let successEl = document.getElementById('successMessage');
    if (!successEl) {
        successEl = document.createElement('div');
        successEl.id = 'successMessage';
        successEl.className = 'success-message';
        // Insert at the top of the main content area
        const main = document.querySelector('main') || document.body;
        main.insertBefore(successEl, main.firstChild);
    }
    
    successEl.textContent = msg;
    successEl.style.display = 'block';
    successEl.style.animation = 'slideDown 0.3s ease-out';
    
    // Hide after specified duration
    if (duration > 0) {
        setTimeout(() => {
            if (successEl) {
                successEl.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => {
                    successEl.style.display = 'none';
                }, 300);
            }
        }, duration);
    }
}

/**
 * Wrapper around fetch() that auto-adds Authorization header
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options object
 * @returns {Promise} - Fetch promise
 */
async function apiFetch(url, options = {}) {
    const token = getToken();
    
    // Set up headers
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };
    
    // Merge provided options with our defaults
    const fetchOptions = {
        ...options,
        headers
    };
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Check if response is OK (status 200-299)
    if (!response.ok) {
        let errorText;
        try {
            const errorData = await response.json();
            errorText = errorData.error || JSON.stringify(errorData);
        } catch {
            errorText = await response.text() || response.statusText;
        }
        console.error(`API Error [${response.status}]:`, errorText);
        const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
        error.response = response;
        error.responseText = errorText;
        throw error;
    }
    
    return response;
}

/**
 * Logout function - clears token and redirects to login
 */
function handleLogout() {
    localStorage.removeItem('cs_token');
    window.location.href = 'login.html';
}

// Add logout listener to logout link if it exists
document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
});
