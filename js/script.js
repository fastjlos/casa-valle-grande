const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Nav background on scroll
const nav = document.getElementById('nav');
const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onScrollNav();
window.addEventListener('scroll', onScrollNav, { passive: true });

// Subtle hero parallax
const heroImg = document.getElementById('hero-img');
if (heroImg && !reduceMotion) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 600);
    heroImg.style.transform = `scale(1.06) translateY(${y * 0.12}px)`;
  }, { passive: true });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// Animated counters
const counters = document.querySelectorAll('.stat-num');
const animateCounter = (el) => {
  const target = parseInt(el.dataset.count, 10);
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach((el) => counterObserver.observe(el));

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');
const galleryItems = Array.from(document.querySelectorAll('.g-item'));
let currentIndex = 0;

const showPhoto = (index) => {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  lightboxImg.src = item.dataset.full;
  lightboxImg.alt = item.querySelector('img').alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
};

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    showPhoto(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
};
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showPhoto(currentIndex - 1));
lightboxNext.addEventListener('click', () => showPhoto(currentIndex + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
  if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
});
