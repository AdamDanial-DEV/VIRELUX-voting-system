// admin.js
// Initialize data
let candidates = JSON.parse(localStorage.getItem('candidates')) || [
    {
        id: 1,
        name: "Ahmad Syafiq",
        class: "4 EMERALD",
        vision: "To create a more inclusive and innovative school environment where every student's voice is heard and valued.",
        votes: 0,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
    },
    {
        id: 2,
        name: "Siti Aisyah",
        class: "5 AMBER",
        vision: "To promote creativity and cultural activities while improving academic support systems for all students.",
        votes: 0,
        image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
        id: 3,
        name: "Siti Aminah",
        class: "5 DIAMOND",
        vision: "To bridge the gap between technology and education, preparing students for future challenges.",
        votes: 0,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
    }
];

// Initialize voting status
let votingStatus = localStorage.getItem('votingStatus') || 'open';
document.getElementById('voting-status').textContent = votingStatus.toUpperCase();

// Update voting status display
if (votingStatus === 'open') {
    document.getElementById('open-voting').classList.add('active');
    document.getElementById('close-voting').classList.remove('active');
} else {
    document.getElementById('close-voting').classList.add('active');
    document.getElementById('open-voting').classList.remove('active');
}

// Set announcement text
document.getElementById('announcement-text').value = localStorage.getItem('announcement') || '';

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
});

// Voting status controls
document.getElementById('open-voting').addEventListener('click', function() {
    votingStatus = 'open';
    localStorage.setItem('votingStatus', votingStatus);
    document.getElementById('voting-status').textContent = votingStatus.toUpperCase();
    this.classList.add('active');
    document.getElementById('close-voting').classList.remove('active');
    alert('Voting is now open!');
});

document.getElementById('close-voting').addEventListener('click', function() {
    votingStatus = 'closed';
    localStorage.setItem('votingStatus', votingStatus);
    document.getElementById('voting-status').textContent = votingStatus.toUpperCase();
    this.classList.add('active');
    document.getElementById('open-voting').classList.remove('active');
    alert('Voting is now closed!');
});

// Update announcement
document.getElementById('update-announcement').addEventListener('click', function() {
    const announcement = document.getElementById('announcement-text').value;
    localStorage.setItem('announcement', announcement);
    alert('Announcement published successfully!');
});

// Update password
document.getElementById('update-password').addEventListener('click', function() {
    const newPassword = document.getElementById('new-password').value;
    if (newPassword) {
        localStorage.setItem('votingPassword', newPassword);
        alert('Voting password updated successfully!');
        document.getElementById('new-password').value = '';
    } else {
        alert('Please enter a new password');
    }
});

// Reset votes
document.getElementById('reset-votes').addEventListener('click', function() {
    const superPassword = document.getElementById('super-password').value;
    if (superPassword === 'DATUK ONN') {
        // Reset votes for all candidates
        candidates.forEach(candidate => {
            candidate.votes = 0;
        });
        localStorage.setItem('candidates', JSON.stringify(candidates));
        renderCandidates();
        renderResults();
        alert('All votes have been reset!');
        document.getElementById('super-password').value = '';
    } else {
        alert('Incorrect super password!');
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Add candidate
document.getElementById('add-candidate').addEventListener('click', function() {
    const name = document.getElementById('new-candidate-name').value;
    const candidateClass = document.getElementById('new-candidate-class').value;
    const vision = document.getElementById('new-candidate-vision').value;
    const image = document.getElementById('new-candidate-image').value;
    
    if (name && candidateClass && vision) {
        const newCandidate = {
            id: candidates.length + 1,
            name,
            class: candidateClass,
            vision,
            votes: 0,
            image: image || 'https://via.placeholder.com/300x200?text=Candidate+Image'
        };
        
        candidates.push(newCandidate);
        localStorage.setItem('candidates', JSON.stringify(candidates));
        
        renderCandidates();
        renderResults();
        
        // Reset form
        document.getElementById('new-candidate-name').value = '';
        document.getElementById('new-candidate-class').value = '';
        document.getElementById('new-candidate-vision').value = '';
        document.getElementById('new-candidate-image').value = '';
        
        alert('Candidate added successfully!');
    } else {
        alert('Please fill in all required fields');
    }
});

// Render candidates
function renderCandidates() {
    const candidatesList = document.getElementById('candidates-list');
    candidatesList.innerHTML = '';
    
    candidates.forEach(candidate => {
        const candidateItem = document.createElement('div');
        candidateItem.className = 'candidate-item';
        candidateItem.innerHTML = `
            <div class="candidate-avatar" style="background-image: url('${candidate.image}')"></div>
            <div class="candidate-details">
                <div class="candidate-item-name">${candidate.name}</div>
                <div class="candidate-item-class">${candidate.class}</div>
                <div class="candidate-item-votes">${candidate.votes} votes</div>
            </div>
            <button class="delete-candidate" data-id="${candidate.id}"><i class="fas fa-trash"></i></button>
        `;
        
        candidatesList.appendChild(candidateItem);
    });
    
    // Add delete event listeners
    document.querySelectorAll('.delete-candidate').forEach(button => {
        button.addEventListener('click', function() {
            const candidateId = parseInt(this.getAttribute('data-id'));
            deleteCandidate(candidateId);
        });
    });
}

// Delete candidate
function deleteCandidate(id) {
    if (confirm('Are you sure you want to delete this candidate?')) {
        candidates = candidates.filter(candidate => candidate.id !== id);
        localStorage.setItem('candidates', JSON.stringify(candidates));
        renderCandidates();
        renderResults();
    }
}

// Render results
function renderResults() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    
    // Sort candidates by votes
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
    
    // Find max votes for percentage calculation
    const maxVotes = Math.max(...sortedCandidates.map(c => c.votes), 1);
    
    sortedCandidates.forEach(candidate => {
        const percentage = (candidate.votes / maxVotes) * 100;
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-header">
                <div class="candidate-name">${candidate.name}</div>
                <div class="vote-count">${candidate.votes} votes</div>
            </div>
            <div class="result-bar-container">
                <div class="result-bar" style="width: ${percentage}%"></div>
            </div>
        `;
        
        resultsContainer.appendChild(resultItem);
    });
}

// Initial rendering
renderCandidates();
renderResults();