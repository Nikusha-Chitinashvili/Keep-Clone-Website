// Registration page functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const createAccountButton = document.querySelector('.btn-success');

    // Handle registration
    createAccountButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validate inputs
        if (!email || !password || !confirmPassword) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }

        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'danger');
            return;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long', 'danger');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'danger');
            return;
        }

        // Get existing users or initialize empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            showAlert('An account with this email already exists', 'danger');
            return;
        }

        // Add new user
        users.push({
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        });

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', email);

        showAlert('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    });

    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Show alert message
    function showAlert(message, type) {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const cardBody = document.querySelector('.card-body');
        cardBody.insertBefore(alert, cardBody.firstChild);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
});
