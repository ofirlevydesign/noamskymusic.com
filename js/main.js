// Mobile menu toggle
const menuBtn = document.querySelector('.navbar__menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const menuCloseBtn = document.querySelector('.mobile-menu__close');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
}
if (menuCloseBtn && mobileMenu) {
  menuCloseBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  });
}
document.querySelectorAll('.mobile-menu__links a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Highlight active nav link based on current page (and #music anchor on the homepage)
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const onMusicAnchor = currentPage === 'index.html' && window.location.hash === '#music';
document.querySelectorAll('.navbar__links a, .mobile-menu__links a').forEach((link) => {
  const href = link.getAttribute('href');
  const active = onMusicAnchor ? href === 'index.html#music' : href === currentPage;
  link.classList.toggle('is-active', active);
});

// Discography filter (All / Singles / Albums)
const discographyFilter = document.getElementById('discography-filter');
if (discographyFilter) {
  discographyFilter.addEventListener('change', () => {
    const value = discographyFilter.value;
    document.querySelectorAll('#discography-grid .card-release').forEach((card) => {
      const match = value === 'all' || card.dataset.type === value;
      card.style.display = match ? '' : 'none';
    });
  });
}

// Scroll-reveal animation
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}
