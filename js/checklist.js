// Checklist module for CyberShield project

/**
 * Load checklist progress from the backend
 */
async function loadChecklist() {
    try {
        const response = await apiFetch('/api/checklist/get');
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load checklist');
        }
        
        // Mark the completed items
        const completedItems = data.completedItems || [];
        completedItems.forEach(itemId => {
            const checkbox = document.getElementById(`item${itemId}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Update progress bar
        updateProgressBar();
        
    } catch (error) {
        console.error('Error loading checklist:', error);
    }
}

/**
 * Save checklist progress to the backend
 */
async function saveChecklist() {
    // Get all checked items
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
    const completedItems = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    try {
        const response = await apiFetch('/api/checklist/update', {
            method: 'POST',
            body: JSON.stringify({ completedItems })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to save checklist');
        }
        
        showSuccess('Checklist progress saved successfully!');
        
    } catch (error) {
        showError('Failed to save checklist: ' + error.message);
        console.error('Error saving checklist:', error);
    }
}

/**
 * Update the progress bar based on completed items
 */
function updateProgressBar() {
    const totalItems = 15; // Total number of checklist items
    const completedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const percentage = Math.round((completedItems / totalItems) * 100);
    
    document.getElementById('checklistProgress').style.width = `${percentage}%`;
    document.getElementById('progressPercentage').textContent = `${percentage}% Complete`;
}

/**
 * Initialize the practice space components
 */
function initPracticeSpace() {
    // Initialize password strength tester
    initPasswordStrengthTester();
    
    // Initialize phishing email spotter
    initPhishingGame();
}

/**
 * Initialize password strength tester
 */
function initPasswordStrengthTester() {
    const passwordInput = document.getElementById('passwordInput');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = passwordStrength(password);
            
            // Update visual indicator
            let widthPercent = 0;
            let bgColor = '';
            
            if (strength === 'Weak') {
                widthPercent = 33;
                bgColor = '#e74c3c'; // Red
            } else if (strength === 'Medium') {
                widthPercent = 66;
                bgColor = '#f39c12'; // Orange
            } else if (strength === 'Strong') {
                widthPercent = 100;
                bgColor = '#2ecc71'; // Green
            }
            
            strengthFill.style.width = `${widthPercent}%`;
            strengthFill.style.backgroundColor = bgColor;
            strengthText.textContent = strength;
            strengthText.style.color = bgColor;
        });
    }
}

/**
 * Calculate password strength
 * @param {string} password - Password to evaluate
 * @returns {string} Strength level: 'Weak', 'Medium', or 'Strong'
 */
function passwordStrength(password) {
    if (password.length === 0) {
        return 'Enter a password';
    }
    
    let strength = 0;
    let feedback = 'Weak';
    
    // Length contributes to strength
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Check for different character types
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters
    
    if (strength <= 2) feedback = 'Weak';
    else if (strength <= 4) feedback = 'Medium';
    else feedback = 'Strong';
    
    return feedback;
}

/**
 * Initialize phishing email spotter game
 */
function initPhishingGame() {
    const emailCards = document.querySelectorAll('.email-card');
    const feedbackDiv = document.getElementById('phishingFeedback');
    
    emailCards.forEach(card => {
        card.addEventListener('click', function() {
            const isPhishing = this.getAttribute('data-email') === 'phishing';
            
            // Clear previous selections
            emailCards.forEach(c => c.classList.remove('selected'));
            
            // Highlight clicked card
            this.classList.add('selected');
            
            // Show feedback
            if (isPhishing) {
                feedbackDiv.innerHTML = `
                    <div class="feedback correct show">
                        <h4>Correct! This is a phishing email.</h4>
                        <p><strong>Red flags:</strong> Generic greeting, sense of urgency, suspicious sender domain, poor grammar, and a request for sensitive information.</p>
                    </div>
                `;
            } else {
                feedbackDiv.innerHTML = `
                    <div class="feedback incorrect show">
                        <h4>This is likely a safe email.</h4>
                        <p>However, always verify the sender and be cautious with any links or attachments.</p>
                    </div>
                `;
            }
        });
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to save button
    const saveButton = document.getElementById('saveChecklistBtn');
    if (saveButton) {
        saveButton.addEventListener('click', saveChecklist);
    }
    
    // Add event listeners to all checkboxes to update progress
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateProgressBar();
            
            // Auto-save after a short delay to avoid too many requests
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                saveChecklist();
            }, 1000);
        });
    });
    
    // Initialize practice space
    initPracticeSpace();
});