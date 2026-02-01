document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadTags();
    setupEventListeners();
});

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'sign.html';
    }
}

function setupEventListeners() {
    const saveButton = document.querySelector('.btn-primary');
    const tagInput = document.querySelector('input[type="text"]');

    saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        const tagName = tagInput.value.trim();
        
        if (!tagName) {
            showAlert('Please enter a tag name', 'warning');
            return;
        }

        saveTag(tagName);
        tagInput.value = '';
    });

    setupTagButtons();
}

function saveTag(tagName) {
    const currentUser = localStorage.getItem('currentUser');
    const tags = JSON.parse(localStorage.getItem(`tags_${currentUser}`)) || [];

    if (tags.some(t => t.name.toLowerCase() === tagName.toLowerCase())) {
        showAlert('This tag already exists', 'warning');
        return;
    }

    tags.push({
        id: Date.now(),
        name: tagName,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem(`tags_${currentUser}`, JSON.stringify(tags));
    showAlert('Tag added successfully!', 'success');
    loadTags();
}

function loadTags() {
    const currentUser = localStorage.getItem('currentUser');
    const tags = JSON.parse(localStorage.getItem(`tags_${currentUser}`)) || [];
    
    console.log(`Loaded ${tags.length} tags for user ${currentUser}`);
    
    const tagCards = document.querySelectorAll('.col-md-4');
    tagCards.forEach((card, index) => {
        if (tags[index]) {
            const input = card.querySelector('input[type="text"]');
            if (input) {
                input.value = tags[index].name;
                input.dataset.tagId = tags[index].id;
            }
        }
    });
}

function setupTagButtons() {
    document.querySelectorAll('a.btn-danger').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.card');
            const input = card.querySelector('input[type="text"]');
            const tagId = input.dataset.tagId;
            
            if (tagId) {
                deleteTag(parseInt(tagId));
            }
        });
    });

    document.querySelectorAll('a.btn-secondary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.card');
            const input = card.querySelector('input[type="text"]');
            
            input.removeAttribute('readonly');
            input.focus();
            
            input.addEventListener('blur', function() {
                this.setAttribute('readonly', 'readonly');
                if (this.dataset.tagId) {
                    updateTag(parseInt(this.dataset.tagId), this.value);
                }
            });
        });
    });
}

function deleteTag(tagId) {
    const currentUser = localStorage.getItem('currentUser');
    let tags = JSON.parse(localStorage.getItem(`tags_${currentUser}`)) || [];
    
    tags = tags.filter(t => t.id !== tagId);
    localStorage.setItem(`tags_${currentUser}`, JSON.stringify(tags));
    
    showAlert('Tag deleted successfully!', 'success');
    loadTags();
}

function updateTag(tagId, newName) {
    const currentUser = localStorage.getItem('currentUser');
    const tags = JSON.parse(localStorage.getItem(`tags_${currentUser}`)) || [];
    
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
        tag.name = newName;
        localStorage.setItem(`tags_${currentUser}`, JSON.stringify(tags));
        showAlert('Tag updated successfully!', 'success');
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
    
    const container = document.querySelector('.container-fluid.main');
    container.insertBefore(alert, container.firstChild);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}
