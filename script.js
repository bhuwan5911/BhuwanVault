const grid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('searchInput');

let allProjects = [];

// Gradient list for generic icons to vary them up
const gradients = [
    'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
    'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
    'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
];

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        allProjects = await response.json();
        renderProjects(allProjects);
    } catch (error) {
        console.error('Error loading projects:', error);
        grid.innerHTML = '<p style="text-align:center; color:white; grid-column: 1/-1;">Error loading projects. Please ensure projects.json exists.</p>';
    }
}

function getRandomGradient(name) {
    // Deterministic random based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
}

const iconMap = {
    'nav': 'fa-bars',
    'menu': 'fa-bars',
    'calc': 'fa-calculator',
    'math': 'fa-calculator',
    'clock': 'fa-clock',
    'time': 'fa-clock',
    'watch': 'fa-stopwatch',
    'card': 'fa-id-card',
    'profile': 'fa-user',
    'scroll': 'fa-scroll',
    'form': 'fa-pen-to-square',
    'input': 'fa-keyboard',
    'validate': 'fa-check-double',
    'game': 'fa-gamepad',
    'play': 'fa-play',
    'anim': 'fa-film',
    'movie': 'fa-film',
    'video': 'fa-video',
    'slide': 'fa-images',
    'gallery': 'fa-images',
    'image': 'fa-image',
    'pic': 'fa-image',
    'photo': 'fa-camera',
    'text': 'fa-font',
    'font': 'fa-font',
    'color': 'fa-palette',
    'paint': 'fa-paint-brush',
    'draw': 'fa-pencil',
    'drag': 'fa-hand-rock',
    'drop': 'fa-hand-holding',
    'load': 'fa-spinner',
    'spin': 'fa-spinner',
    'progress': 'fa-bars-progress',
    'btn': 'fa-toggle-on',
    'button': 'fa-toggle-on',
    'toggle': 'fa-toggle-on',
    'search': 'fa-magnifying-glass',
    'find': 'fa-magnifying-glass',
    'filter': 'fa-filter',
    'user': 'fa-users',
    'login': 'fa-right-to-bracket',
    'toast': 'fa-bread-slice', // Fun one for 'toast' notification
    'notif': 'fa-bell',
    'weather': 'fa-cloud-sun',
    'dad': 'fa-face-laugh-squint', // Dad jokes
    'joke': 'fa-face-grin-tears',
    'music': 'fa-music',
    'sound': 'fa-volume-high',
    'note': 'fa-sticky-note',
    'todo': 'fa-list-check',
    'list': 'fa-list',
    'shop': 'fa-cart-shopping',
    'store': 'fa-store',
    'map': 'fa-map-location-dot',
    'quiz': 'fa-circle-question',
    'password': 'fa-key',
    'lock': 'fa-lock'
};

const fallbackIcons = [
    'fa-rocket', 'fa-star', 'fa-bolt', 'fa-fire', 'fa-droplet',
    'fa-leaf', 'fa-snowflake', 'fa-sun', 'fa-moon', 'fa-cloud',
    'fa-ghost', 'fa-robot', 'fa-bug', 'fa-puzzle-piece', 'fa-dice',
    'fa-chess-knight', 'fa-headphones', 'fa-crown', 'fa-heart', 'fa-diamond'
];

function getIcon(name) {
    const n = name.toLowerCase();

    // Check specific keywords
    for (const [key, icon] of Object.entries(iconMap)) {
        if (n.includes(key)) return icon;
    }

    // Fallback: deterministic random icon based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fallbackIcons.length;
    return fallbackIcons[index];
}

const categories = {
    'Games': ['game', 'quiz', 'clicker', 'rps', 'toe', 'memory', 'snake'],
    'UI Components': ['nav', 'menu', 'sidebar', 'toast', 'modal', 'card', 'button', 'toggle', 'slider'],
    'Tools': ['calc', 'converter', 'generator', 'clock', 'timer', 'weather', 'search'],
    'Effects': ['anim', 'scroll', 'hover', '3d', 'background', 'clip', 'blur'],
    'Forms': ['form', 'input', 'login', 'signup', 'validate', 'password']
};

function getCategory(name) {
    const n = name.toLowerCase();
    for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(k => n.includes(k))) return cat;
    }
    return 'Other';
}

function getBadges(project) {
    const badges = [];
    const n = project.name.toLowerCase();

    // Tech badges (inferred)
    if (n.includes('api') || n.includes('weather') || n.includes('dad') || n.includes('search')) badges.push({ text: 'API', type: 'tech-js' });
    if (n.includes('game')) badges.push({ text: 'Game Logic', type: 'tech-js' });
    if (n.includes('css') || n.includes('anim') || n.includes('3d')) badges.push({ text: 'CSS3', type: 'tech-css' });

    // Category badge
    const cat = getCategory(project.name);
    badges.push({ text: cat, type: cat === 'Games' ? 'cat-game' : 'cat-tool' });

    return badges;
}

function renderProjects(projects) {
    grid.innerHTML = '';

    if (projects.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color: var(--text-secondary); grid-column: 1/-1;">No projects found.</p>';
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card';

        const gradient = getRandomGradient(project.name);
        const icon = getIcon(project.name);
        const badges = getBadges(project);

        const badgeHtml = badges.map(b => `<span class="badge ${b.type}">${b.text}</span>`).join('');

        card.innerHTML = `
            <div class="card-icon-wrapper" style="background: ${gradient}">
                <i class="fa-solid ${icon}" style="color: white;"></i>
            </div>
            <div class="card-badges">${badgeHtml}</div>
            <h3 class="card-title">${formatName(project.name)}</h3>
            <div class="card-actions">
                <button onclick="openModal('${project.liveUrl}', '${formatName(project.name)}')" class="btn btn-primary">
                    <i class="fa-solid fa-eye"></i> Demo
                </button>
                <a href="viewer.html?project=${project.folder}" class="btn btn-secondary">
                    <i class="fa-solid fa-code"></i> Source Code
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

function formatName(name) {
    return name.replace(/[-_]/g, ' ');
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProjects.filter(p =>
        p.name.toLowerCase().includes(term)
    );
    renderProjects(filtered);
});

// Chips Logic
function renderChips() {
    const chipContainer = document.getElementById('categoryFilters');
    const allCats = ['All', ...Object.keys(categories), 'Other'];

    chipContainer.innerHTML = allCats.map(cat =>
        `<button class="category-chip ${cat === 'All' ? 'active' : ''}" onclick="filterByCategory('${cat}')">${cat}</button>`
    ).join('');
}

function filterByCategory(category) {
    // UI Update
    document.querySelectorAll('.category-chip').forEach(c => {
        c.classList.toggle('active', c.innerText === category);
    });

    if (category === 'All') {
        renderProjects(allProjects);
    } else {
        const filtered = allProjects.filter(p => getCategory(p.name) === category);
        renderProjects(filtered);
    }
}

// Surprise Me
document.getElementById('surpriseBtn').addEventListener('click', () => {
    if (allProjects.length === 0) return;
    const randomProject = allProjects[Math.floor(Math.random() * allProjects.length)];
    openModal(randomProject.liveUrl, formatName(randomProject.name));
});

// Modal Logic
const modal = document.getElementById('previewModal');
const iframe = document.getElementById('previewFrame');
const modalTitle = document.getElementById('modalTitle');
const modalNewTab = document.getElementById('modalNewTab');

function openModal(url, title) {
    modal.classList.add('open');
    iframe.src = url;
    modalTitle.innerText = title;
    modalNewTab.href = url;
    document.body.style.overflow = 'hidden'; // Prevent scrolling bg
}

function closeModal() {
    modal.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
}

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Galaxy Mode Logic
let galaxyMode = false;
const toggleBtn = document.getElementById('viewToggleBtn');

toggleBtn.addEventListener('click', () => {
    galaxyMode = !galaxyMode;
    toggleBtn.innerHTML = galaxyMode ? '<i class="fa-solid fa-th"></i> Grid View' : '<i class="fa-solid fa-rocket"></i> Galaxy Mode';

    const grid = document.getElementById('projectsGrid');
    if (galaxyMode) {
        grid.classList.add('hidden');
        window.setGalaxyMode(true);
        window.initGalaxy(allProjects); // Re-init with project data
    } else {
        grid.classList.remove('hidden');
        window.setGalaxyMode(false);
        // Reset background to simple mode if desired, or keep projects floating
    }
});

// Expose open function to global scope for background.js
window.openGalaxyProject = function (project) {
    openModal(project.liveUrl, formatName(project.name));
}

// Initial Auto-load (kept separate to ensure variables are defined)
renderChips();
loadProjects().then(() => {
    // Optional: init galaxy immediately if we wanted to
    // window.initGalaxy(allProjects);
});
