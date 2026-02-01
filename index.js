// Index page - Landing page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
        });
    });

    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Show option to go directly to home
        console.log('User already logged in:', currentUser);
    }
});
