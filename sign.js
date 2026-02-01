document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const signInButton = document.querySelector('.btn-success');

    signInButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }

        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'danger');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', email);
            
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberMe', 'true');
            }

            showAlert('Sign in successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            showAlert('Invalid email or password', 'danger');
        }
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

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
