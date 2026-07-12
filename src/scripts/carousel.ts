/* Hero featured-app carousel: autoplay, prev/next, dots, pause-on-hover.
   Respects prefers-reduced-motion (no autoplay). Ported from the prototype. */

const AUTOPLAY_MS = 6000;

function setupCarousel(): void {
  const track = document.getElementById('hero-track');
  if (!track) return;

  const slides = track.querySelectorAll<HTMLElement>('.hero-slide');
  if (slides.length < 2) return; // nothing to rotate

  const dotsWrap = document.getElementById('hero-dots');
  const prevBtn = document.querySelector<HTMLButtonElement>('.hero-prev');
  const nextBtn = document.querySelector<HTMLButtonElement>('.hero-next');
  const hero = track.closest('header');

  let i = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  const dots: HTMLButtonElement[] = [];

  if (dotsWrap) {
    slides.forEach((_, idx) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'hero-dot' + (idx === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Show slide ${idx + 1}`);
      d.addEventListener('click', () => {
        go(idx);
        restart();
      });
      dotsWrap.appendChild(d);
      dots.push(d);
    });
  }

  function go(n: number): void {
    i = (n + slides.length) % slides.length;
    track!.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  }
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function restart(): void {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (!reduce) timer = setInterval(next, AUTOPLAY_MS);
  }

  prevBtn?.addEventListener('click', () => {
    prev();
    restart();
  });
  nextBtn?.addEventListener('click', () => {
    next();
    restart();
  });

  if (hero) {
    hero.addEventListener('mouseenter', () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    hero.addEventListener('mouseleave', restart);
  }

  // Touch swipe (mobile): a mostly-horizontal drag past the threshold advances the
  // carousel. Listeners are passive (no preventDefault) so vertical page scrolling
  // is never blocked; we only act on touchend once the gesture's direction is known.
  const SWIPE_THRESHOLD = 40;
  let touchX = 0;
  let touchY = 0;
  const swipeTarget = hero ?? track;
  swipeTarget.addEventListener(
    'touchstart',
    (e) => {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    },
    { passive: true },
  );
  swipeTarget.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
        restart();
      }
    },
    { passive: true },
  );

  restart();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCarousel);
} else {
  setupCarousel();
}
