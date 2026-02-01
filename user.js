document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    setupEventListeners();
});

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'sign.html';
    }
}

function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    const emailInput = document.getElementById('userEmail');
    
    if (emailInput && currentUser) {
        emailInput.value = currentUser;
    }
}

function setupEventListeners() {
    const updateButton = document.querySelector('.btn-success');
    const searchInput = document.querySelector('input[type="search"]');
    const tagFilters = document.querySelectorAll('.list-group-item');

    updateButton.addEventListener('click', function(e) {
        e.preventDefault();
        updateProfile();
    });

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            console.log('Searching:', this.value);
        });
    }

    tagFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            tagFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function updateProfile() {
    const emailInput = document.getElementById('userEmail');
    const passwordInput = document.getElementById('userPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (password || confirmPassword) {
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'danger');
            return;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long', 'danger');
            return;
        }

        const currentUser = localStorage.getItem('currentUser');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser);

        if (userIndex !== -1) {
            users[userIndex].password = password;
            localStorage.setItem('users', JSON.stringify(users));
            showAlert('Password updated successfully!', 'success');
            
            passwordInput.value = '';
            confirmPasswordInput.value = '';
        }
    } else {
        showAlert('No changes to save', 'info');
    }
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const cardBody = document.querySelector('.col-md-9 .card-body');
    cardBody.insertBefore(alert, cardBody.firstChild);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}
