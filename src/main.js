import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './style.css';

document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

// Animated stat counters
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = (target * eased).toFixed(decimals);
    el.textContent = Number(value).toLocaleString(undefined, { minimumFractionDigits: decimals }) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { animateCount(e.target); countObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

// Bento spotlight
document.querySelectorAll('.bento').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - r.left}px`);
    card.style.setProperty('--y', `${e.clientY - r.top}px`);
  });
});

// Modal
const modal = document.getElementById('modal');
const form = document.getElementById('contact-form');
const formView = document.getElementById('form-view');
const successView = document.getElementById('success-view');
const formError = document.getElementById('form-error');
let lastFocus = null;

const openModal = () => {
  lastFocus = document.activeElement;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modal.classList.add('modal-open'));
  setTimeout(() => form.querySelector('input')?.focus(), 50);
};
const closeModal = () => {
  modal.classList.remove('modal-open');
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.classList.add('hidden');
    formView.classList.remove('hidden');
    successView.classList.add('hidden');
    formError.classList.add('hidden');
    form.reset();
  }, 250);
  lastFocus?.focus();
};

document.querySelectorAll('[data-open-modal]').forEach((b) => b.addEventListener('click', openModal));
modal.addEventListener('click', (e) => { if (e.target.closest('[data-close-modal]')) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const email = (data.get('email') || '').trim();
  if (!data.get('name').trim() || !email || !data.get('message').trim()) {
    formError.textContent = 'Please fill in your name, email, and project details.';
    formError.classList.remove('hidden');
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    formError.textContent = 'Please enter a valid email address.';
    formError.classList.remove('hidden');
    return;
  }
  formError.classList.add('hidden');
  formView.classList.add('hidden');
  successView.classList.remove('hidden');
});
