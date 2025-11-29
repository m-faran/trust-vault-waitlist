// --- CONFIGURATION ---
// PASTE YOUR WEB APP URL HERE (The one ending in /exec)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyKfW36_JzrrtiUqYu8ZbrwGliw46_Twl37hgZdrRq2DP2542AHSpGpX4b5Ee6humv4/exec'; 

// --- NAVIGATION & UI ---

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      const links = document.querySelector('.nav-links');
      if (links && links.classList.contains('active')) {
        links.classList.remove('active');
      }
    }
  });
});

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    links.classList.toggle('active');
  });
}

// Reveal on scroll (This fixes the "invisible" elements)
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

// --- ANIMATIONS ---

// Particle background system
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function initParticles() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    // Optimize count for mobile
    const count = window.innerWidth < 768 ? 40 : 80;
    
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      c: Math.random() > 0.5 ? 'rgba(0,170,255,0.7)' : 'rgba(3,198,184,0.7)'
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', initParticles);
  initParticles();
  drawParticles();
}

// Hero Key Rotation Animation
const vaultSvg = document.querySelector('.vault-svg');
const key = vaultSvg ? document.getElementById('key') : null;
let angle = 0;
function spinKey() {
  angle = (angle + 0.5) % 360;
  if (key) key.setAttribute('transform', `translate(310,80) rotate(${angle} 20 20)`);
  requestAnimationFrame(spinKey);
}
spinKey();


// --- GOOGLE SHEETS FORM SUBMISSION ---

function handleForm(form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.textContent;

    // 1. Loading State
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // 2. Prepare Data
    const formData = new FormData(form);

    // 3. Send to Google Sheets
    fetch(SCRIPT_URL, { 
      method: 'POST', 
      body: formData 
    })
    .then(response => {
      if (response.ok) {
        // Success UI
        form.reset();
        const popup = document.getElementById('successPopup');
        if (popup) popup.style.display = 'grid';
      } else {
        alert('Something went wrong. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert('Error connecting to the server.');
    })
    .finally(() => {
      // Reset button
      btn.textContent = originalText;
      btn.disabled = false;
    });
  });
}

// Initialize forms
const mainForm = document.getElementById('waitlistForm');
const miniForm = document.getElementById('miniWaitlist');
if (mainForm) handleForm(mainForm);
if (miniForm) handleForm(miniForm);

// Close Popup Logic
const closeSuccess = document.getElementById('closeSuccess');
if (closeSuccess) {
  closeSuccess.addEventListener('click', () => {
    document.getElementById('successPopup').style.display = 'none';
  });
}