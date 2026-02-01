document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
        });
    });

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        console.log('User already logged in:', currentUser);
    }
});
