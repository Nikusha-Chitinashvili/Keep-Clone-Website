document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadNotes();
    setupEventListeners();
});

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'sign.html';
    }
}

function setupEventListeners() {
    const saveButton = document.querySelector('.btn-success');
    const searchInput = document.querySelector('input[type="search"]');
    const tagFilters = document.querySelectorAll('.list-group-item');

    saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        saveNote();
    });

    searchInput.addEventListener('input', function() {
        filterNotes(this.value);
    });

    tagFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            tagFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const tag = this.textContent.trim();
            filterByTag(tag === 'All Notes' ? 'all' : tag);
        });
    });
}

function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const body = document.getElementById('noteBody').value.trim();
    const selectedTags = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    if (!title || !body) {
        showAlert('Please enter both title and content', 'warning');
        return;
    }

    const currentUser = localStorage.getItem('currentUser');
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser}`)) || [];

    const newNote = {
        id: Date.now(),
        title: title,
        body: body,
        tags: selectedTags,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);
    localStorage.setItem(`notes_${currentUser}`, JSON.stringify(notes));

    showAlert('Note saved successfully!', 'success');
    
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteBody').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    loadNotes();
}

function loadNotes() {
    const currentUser = localStorage.getItem('currentUser');
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser}`)) || [];
    
    console.log(`Loaded ${notes.length} notes for user ${currentUser}`);
}

function filterNotes(searchTerm) {
    const currentUser = localStorage.getItem('currentUser');
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser}`)) || [];
    
    const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log(`Found ${filtered.length} notes matching "${searchTerm}"`);
}

function filterByTag(tag) {
    const currentUser = localStorage.getItem('currentUser');
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser}`)) || [];
    
    if (tag === 'all') {
        console.log(`Showing all ${notes.length} notes`);
    } else {
        const filtered = notes.filter(note => note.tags.includes(tag.toLowerCase()));
        console.log(`Found ${filtered.length} notes with tag "${tag}"`);
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
