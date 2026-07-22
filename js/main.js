// Sound wave strip: decorative multi-layer AM/compound waveform, purely
// visual. Each layer is rendered once as a static tile (one seamless period
// of a compound sine wave, teal/purple gradient), turned into a background
// image, and scrolled with `background-position` + `background-repeat:
// repeat-x`. That combination is the one part of CSS the spec *guarantees*
// tiles pixel-perfectly with no seam -- it's the same mechanism behind every
// infinitely-scrolling background pattern on the web, so there's no custom
// transform/viewBox math left to get subtly wrong.
const waveStripEl = document.getElementById('wave-strip');
if (waveStripEl) {
  const TILE = 1000; // one period, in the SVG's own user units
  const HEIGHT = 50;
  const CENTER = HEIGHT / 2;
  const TILE_PX = 420; // rendered width of one tile once tiled on-screen

  function rand(min, max) { return min + Math.random() * (max - min); }

  // Sample one period, plus a few extra points just past each end (the
  // formula is simply evaluated at x<0 / x>TILE, which is mathematically
  // fine). Those extra points are never drawn -- they exist purely so the
  // curve's tangent at x=0 and x=TILE is calculated from real neighboring
  // data instead of a duplicated fallback point, which is what previously
  // produced a visible kink right at the tile seam.
  function sampleWave(freq, modFreq, amp, phase, modPhase, step) {
    const pad = step * 3;
    const pts = [];
    for (let x = -pad; x <= TILE + pad; x += step) {
      const carrier = Math.sin((2 * Math.PI * freq * x) / TILE + phase);
      const envelope = 0.55 + 0.45 * Math.sin((2 * Math.PI * modFreq * x) / TILE + modPhase);
      pts.push([x, CENTER - amp * carrier * envelope]);
    }
    return pts;
  }

  // Catmull-Rom -> cubic Bezier through the sample points, so the line is
  // one continuous smooth curve rather than a faceted polyline. Only
  // segments landing inside [0, TILE] are emitted.
  function smoothPath(pts) {
    let d = '';
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
      if (p1[0] < 0 || p1[0] > TILE) continue;
      if (!d) d = `M ${p1[0]},${p1[1].toFixed(2)}`;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0]},${p2[1].toFixed(2)}`;
      if (p2[0] >= TILE) break;
    }
    return d;
  }

  // Baked-in hex values: this SVG is serialized into a data URI and loaded
  // as an external background image, which does not inherit the page's CSS
  // custom properties, so var(--accent-teal) etc. would not resolve here.
  const TEAL = '#5EEAD4';
  const PURPLE = '#7C5CFF';

  const layerDefs = [
    { freq: 6, modFreq: 1, amp: 23.4, strokeWidth: 2.2, opacity: 0.20, baseDuration: 24, reverse: false,
      stops: [[0, TEAL], [50, PURPLE], [100, TEAL]] },
    { freq: 9, modFreq: 2, amp: 22.46, strokeWidth: 1.8, opacity: 0.16, baseDuration: 16, reverse: true,
      stops: [[0, PURPLE], [50, TEAL], [100, PURPLE]] },
    { freq: 13, modFreq: 3, amp: 14.98, strokeWidth: 1.4, opacity: 0.24, baseDuration: 10, reverse: false,
      stops: [[0, TEAL], [35, PURPLE], [70, TEAL], [100, TEAL]] },
    { freq: 18, modFreq: 4, amp: 11.23, strokeWidth: 1.2, opacity: 0.16, baseDuration: 7, reverse: true,
      stops: [[0, PURPLE], [50, TEAL], [100, PURPLE]] },
  ];

  layerDefs.forEach(({ freq, modFreq, amp, strokeWidth, opacity, baseDuration, reverse, stops }, idx) => {
    // Randomized per page load: wave phase (shape), speed, and starting
    // point in the loop -- so the drift/interference pattern never repeats
    // the same way twice and the layers don't all start in lockstep.
    const phase = rand(0, Math.PI * 2);
    const modPhase = rand(0, Math.PI * 2);
    const duration = Math.max(4, baseDuration + rand(-3, 3));
    const delay = -rand(0, duration);

    const d = smoothPath(sampleWave(freq, modFreq, amp, phase, modPhase, 8));
    const gradId = `wave-grad-${idx}`;
    const stopsMarkup = stops.map(([offset, color]) => `<stop offset="${offset}%" stop-color="${color}"/>`).join('');
    const svgMarkup =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE} ${HEIGHT}">` +
      `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="${TILE}" y2="0" gradientUnits="userSpaceOnUse">${stopsMarkup}</linearGradient></defs>` +
      `<path d="${d}" fill="none" stroke="url(#${gradId})" stroke-width="${strokeWidth}" stroke-linecap="butt" stroke-linejoin="round"/>` +
      `</svg>`;
    const dataUri = 'data:image/svg+xml,' + encodeURIComponent(svgMarkup);

    const layer = document.createElement('div');
    layer.className = 'wave-strip__layer';
    layer.style.backgroundImage = `url("${dataUri}")`;
    layer.style.backgroundSize = `${TILE_PX}px ${HEIGHT}px`;
    layer.style.opacity = String(opacity);
    layer.style.animationDuration = `${duration}s`;
    layer.style.animationDelay = `${delay}s`;
    layer.style.animationDirection = reverse ? 'reverse' : 'normal';

    waveStripEl.appendChild(layer);
  });
}

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

// Highlight active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar__links a, .mobile-menu__links a').forEach((link) => {
  link.classList.toggle('is-active', link.getAttribute('href') === currentPage);
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
