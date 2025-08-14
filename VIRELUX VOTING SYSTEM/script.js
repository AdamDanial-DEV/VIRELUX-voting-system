// script.js
// Initialize data
const candidates = [
    {
        id: 1,
        name: "Ahmad Syafiq",
        class: "5 Science",
        vision: "To create a more inclusive and innovative school environment where every student's voice is heard and valued.",
        votes: 142,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
    },
    {
        id: 2,
        name: "Nurul Iman",
        class: "5 Arts",
        vision: "To promote creativity and cultural activities while improving academic support systems for all students.",
        votes: 118,
        image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
        id: 3,
        name: "Siti Aminah",
        class: "5 Technology",
        vision: "To bridge the gap between technology and education, preparing students for future challenges.",
        votes: 95,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
    }
];

// Check if voting status exists in localStorage
if (!localStorage.getItem('votingStatus')) {
    localStorage.setItem('votingStatus', 'open');
}

// Check if voting password exists in localStorage
if (!localStorage.getItem('votingPassword')) {
    localStorage.setItem('votingPassword', 'SMKDOB');
}

// Check if announcement exists in localStorage
if (!localStorage.getItem('announcement')) {
    localStorage.setItem('announcement', 'Important Announcement: Voting will close on 30th November 2023. Make your vote count!');
}

// Set current date
const now = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);

// Set announcement from localStorage
document.getElementById('announcement-text').innerHTML = `<i class="fas fa-bullhorn"></i> ${localStorage.getItem('announcement')}`;

// Initialize carousel
let currentSlide = 0;
const carousel = document.querySelector('.carousel');
const carouselNav = document.querySelector('.carousel-nav');

// Populate carousel with candidates
candidates.forEach((candidate, index) => {
    // Create slide
    const slide = document.createElement('div');
    slide.className = 'candidate-slide';
    slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('${candidate.image}')`;
    
    slide.innerHTML = `
        <div class="slide-content">
            <h3 class="candidate-name">${candidate.name}</h3>
            <p class="candidate-info">Class: ${candidate.class}<br>Vision: ${candidate.vision}</p>
            <button class="vote-btn" data-id="${candidate.id}"><i class="fas fa-check-circle"></i> Vote Me</button>
        </div>
    `;
    
    carousel.appendChild(slide);
    
    // Create nav dot
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        showSlide(index);
    });
    carouselNav.appendChild(dot);
});

const slides = document.querySelectorAll('.candidate-slide');
const dots = document.querySelectorAll('.nav-dot');
const totalSlides = slides.length;

function showSlide(index) {
    if (index < 0) {
        currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }
    
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Auto rotate slides
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Next/previous buttons
document.querySelector('.next-btn').addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

document.querySelector('.prev-btn').addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
});

// Modal functionality
const voteModal = document.getElementById('vote-modal');
const candidateModal = document.getElementById('candidate-modal');
const votePasswordBtn = document.getElementById('vote-password-btn');

votePasswordBtn.addEventListener('click', () => {
    voteModal.style.display = 'flex';
});

document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === voteModal) voteModal.style.display = 'none';
    if (e.target === candidateModal) candidateModal.style.display = 'none';
});

// Form submissions
document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === 'Admin' && password === 'AdminSMKDOB') {
        // Redirect to admin page
        window.location.href = 'admin.html';
    } else {
        alert('Invalid admin credentials!');
    }
});


const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminSection = document.querySelector('.admin-section');
const closeBtn = document.querySelector('.close-admin-popup');

adminLoginBtn.addEventListener('click', () => {
    adminSection.classList.toggle('show');
});
// Close on clicking the close button
closeBtn.addEventListener('click', () => {
    adminSection.classList.remove('show');
});

document.getElementById('suggestion-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('teacher-password').value;
    
    if (password === 'CIKGU SMKDOB') {
        alert('Candidate suggestion submitted successfully!');
        this.reset();
    } else {
        alert('Invalid teacher password!');
    }
});

document.getElementById('submit-vote-password').addEventListener('click', function() {
    const password = document.getElementById('voting-password').value;
    const storedPassword = localStorage.getItem('votingPassword');
    
    if (password === storedPassword) {
        alert('Voting access granted! You can now vote for candidates.');
        voteModal.style.display = 'none';
        // Here you would enable voting functionality
    } else {
        alert('Incorrect voting password!');
    }
});

// Populate candidate grid
const candidateGrid = document.getElementById('candidate-grid');
candidates.forEach(candidate => {
    const card = document.createElement('div');
    card.className = 'candidate-card';
    card.innerHTML = `
        <div class="candidate-img" style="background-image: url('${candidate.image}')"></div>
        <div class="candidate-details">
            <h3 class="candidate-name">${candidate.name}</h3>
            <div class="candidate-class">${candidate.class}</div>
            <p class="candidate-vision">${candidate.vision}</p>
            <div class="vote-count">
                <i class="fas fa-vote-yea"></i> ${candidate.votes} Votes
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        document.getElementById('candidate-details').innerHTML = `
            <h3 class="candidate-name" style="font-size: 2rem;">${candidate.name}</h3>
            <div class="candidate-class" style="font-size: 1.3rem; margin-bottom: 20px;">${candidate.class}</div>
            <h4 style="color: var(--accent); margin-bottom: 10px;">Vision:</h4>
            <p class="candidate-vision" style="font-size: 1.1rem; line-height: 1.7;">${candidate.vision}</p>
            <div class="vote-count" style="margin-top: 25px; font-size: 1.1rem;">
                <i class="fas fa-vote-yea"></i> ${candidate.votes} Votes
            </div>
        `;
        candidateModal.style.display = 'flex';
    });
    
    candidateGrid.appendChild(card);
});

// Animation on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .candidate-card').forEach(card => {
    observer.observe(card);
});

// Voting functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('vote-btn')) {
        const candidateId = parseInt(e.target.getAttribute('data-id'));
        const votingStatus = localStorage.getItem('votingStatus');
        
        if (votingStatus === 'closed') {
            alert('Voting is currently closed. Please try again later.');
            return;
        }
        
        voteModal.style.display = 'flex';
    }
});