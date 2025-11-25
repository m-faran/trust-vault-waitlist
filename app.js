// --- CONFIGURATION ---
// You must replace these with your actual Google Form IDs.
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfGYxrJU_m2QP0_D3ESmR5bM_N9wtJxEx-lVXzp-hBrA9Jcxg/formResponse'; // USE THE 'formResponse' URL, not 'viewform'
const GOOGLE_ENTRIES = {
  name: 'entry.2005620554',   // Replace with actual entry ID for Name
  email: 'entry.1045781291',  // Replace with actual entry ID for Email
  wallet: 'entry.1065046570'  // Replace with actual entry ID for Wallet
};

// --- NAVIGATION ---
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      if (links.classList.contains('active')) {
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

// --- ANIMATIONS ---
// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 }); // Lowered threshold slightly for better mobile trigger
revealEls.forEach(el => io.observe(el));

// Particles
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function initParticles() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  // Reduced particle count slightly for mobile performance
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

// Hero Key Animation
const vaultSvg = document.querySelector('.vault-svg');
const key = vaultSvg ? document.getElementById('key') : null;
let angle = 0;
function spinKey() {
  angle = (angle + 0.5) % 360;
  if (key) key.setAttribute('transform', `translate(310,80) rotate(${angle} 20 20)`);
  requestAnimationFrame(spinKey);
}
spinKey();

// --- GOOGLE FORM SUBMISSION ---
async function submitToGoogle(data) {
  const formData = new FormData();
  formData.append(GOOGLE_ENTRIES.name, data.name);
  formData.append(GOOGLE_ENTRIES.email, data.email);
  if (data.wallet) formData.append(GOOGLE_ENTRIES.wallet, data.wallet);

  try {
    // Mode 'no-cors' is required for Google Forms. 
    // We won't get a readable response (status 200), but the submission will work.
    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    return true; 
  } catch (error) {
    console.error('Form Error:', error);
    return false; // In 'no-cors', we actually can't detect failures easily, assuming success
  }
}

function handleForm(form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    
    // 1. Validate
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    if (!data.name || !data.email) return;

    // 2. Loading State
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // 3. Submit
    await submitToGoogle(data);

    // 4. Success UI
    form.reset();
    btn.textContent = originalText;
    btn.disabled = false;
    
    const popup = document.getElementById('successPopup');
    if (popup) popup.style.display = 'grid';
  });
}

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