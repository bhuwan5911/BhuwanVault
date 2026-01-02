const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let hoverX = 0;
let hoverY = 0;
let isGalaxyMode = false;
let projectData = []; // Store projects here
const tooltip = document.getElementById('starTooltip');

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor(project = null) {
        this.project = project;
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 2; // Depth
        this.size = this.project ? 4 : Math.random() * 2; // Projects are bigger
        this.vx = (Math.random() - 0.5) * (this.project ? 0.2 : 0.5);
        this.vy = (Math.random() - 0.5) * (this.project ? 0.2 : 0.5);

        // Colors
        if (this.project) {
            this.color = '#7c3aed'; // Violet for projects
            this.glow = '#34d399'; // Mint glow
        } else {
            const colors = ['#334155', '#475569', '#64748b']; // Subtle background stars
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse avoid/attract
        const dx = this.x - hoverX;
        const dy = this.y - hoverY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
            // Projects attract slightly, background avoids
            const force = this.project ? -0.005 : 0.01;
            this.x += dx * force;
            this.y += dy * force;
        }

        // Wrap
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        const scale = 1 + this.z * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = this.color;

        if (this.project) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.glow;
            ctx.globalAlpha = 1;
        } else {
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 0.4 * scale;
        }

        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// Called from script.js to start galaxy mode
window.initGalaxy = function (projects) {
    projectData = projects;
    resize();
    particles = [];

    // Create particles for each project
    projects.forEach(p => {
        particles.push(new Particle(p));
    });

    // Fill rest with background stars
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(null));
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    let hoveredProject = null;

    particles.forEach((p, i) => {
        p.update();
        p.draw();

        // Interaction Check (only if in Galaxy Mode)
        if (isGalaxyMode && p.project) {
            const dx = p.x - hoverX;
            const dy = p.y - hoverY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 20) {
                hoveredProject = p.project;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                ctx.strokeStyle = '#34d399';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw connecting line to mouse
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(hoverX, hoverY);
                ctx.strokeStyle = 'rgba(124, 58, 237, 0.5)';
                ctx.stroke();
            }
        }

        // Connections (subtle)
        if (!isGalaxyMode) {
            // ... existing connection logic if needed, or skip for cleaner look
        }
    });

    // Handle Tooltip
    if (hoveredProject) {
        tooltip.style.left = hoverX + 'px';
        tooltip.style.top = hoverY + 'px';
        tooltip.innerText = hoveredProject.name.replace(/-/g, ' ');
        tooltip.classList.add('visible');
        document.body.style.cursor = 'pointer';
    } else {
        tooltip.classList.remove('visible');
        document.body.style.cursor = 'default';
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => {
    hoverX = e.clientX;
    hoverY = e.clientY;
});

// Click handler for Galaxy Mode
window.addEventListener('click', e => {
    if (!isGalaxyMode) return;

    particles.forEach(p => {
        if (p.project) {
            const dx = p.x - e.clientX;
            const dy = p.y - e.clientY;
            if (Math.sqrt(dx * dx + dy * dy) < 20) {
                // Open modal via global function (needs to be exposed)
                if (window.openGalaxyProject) {
                    window.openGalaxyProject(p.project);
                }
            }
        }
    });
});

window.setGalaxyMode = function (active) {
    isGalaxyMode = active;
}

// Initial fallback init
resize();
animate();
