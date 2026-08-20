/* BARRA DE PROGRESSO DE LEITURA */
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  progressBar.style.width = `${scrolled}%`;
});

/* CONTADOR DE LIKES COM LOCALSTORAGE */
const likeBtn = document.getElementById('like-btn');
const likeCountDisplay = document.getElementById('like-count');
const likeMsg = document.getElementById('like-msg');

const STORAGE_KEY = 'blogtech_raymond_likes';
const USER_LIKED_KEY = 'blogtech_raymond_has_liked';

let currentLikes = parseInt(localStorage.getItem(STORAGE_KEY)) || 42;
let userHasLiked = localStorage.getItem(USER_LIKED_KEY) === 'true';

likeCountDisplay.textContent = currentLikes;
if (userHasLiked) {
  likeBtn.style.background = 'var(--neon-green)';
  likeBtn.style.color = '#000';
  likeMsg.textContent = 'Você já curtiu este artigo!';
}

likeBtn.addEventListener('click', () => {
  if (!userHasLiked) {
    currentLikes++;
    userHasLiked = true;
    
    localStorage.setItem(STORAGE_KEY, currentLikes);
    localStorage.setItem(USER_LIKED_KEY, 'true');

    likeCountDisplay.textContent = currentLikes;
    likeBtn.style.background = 'var(--neon-green)';
    likeBtn.style.color = '#000';
    likeMsg.textContent = 'Obrigado pelo seu apoio!';
  } else {
    currentLikes--;
    userHasLiked = false;

    localStorage.setItem(STORAGE_KEY, currentLikes);
    localStorage.setItem(USER_LIKED_KEY, 'false');

    likeCountDisplay.textContent = currentLikes;
    likeBtn.style.background = 'transparent';
    likeBtn.style.color = 'var(--neon-green)';
    likeMsg.textContent = 'Deixe seu apoio ao artigo!';
  }
});

/* BOTÃO VOLTAR AO TOPO */
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* EFEITO DE PARTÍCULAS INTERATIVAS (CANVAS) */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 1.2;
    this.speedY = (Math.random() - 0.5) * 1.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * 2;
        this.y -= Math.sin(angle) * 2;
      }
    }
  }

  draw() {
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const opacity = 1 - (distance / 100);
        ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}

initParticles();
animate();
