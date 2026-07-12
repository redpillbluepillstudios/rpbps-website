/* Nav behavior:
   1. Transparent over the hero, solid on scroll (only when opted into overlay).
   2. Mobile hamburger → full-screen menu (open/close, Escape, link click, resize). */

function setupNavScroll(): void {
  const nav = document.getElementById('site-nav');
  if (!nav || nav.dataset.overlay !== 'true') return;

  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupMobileMenu(): void {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('nav-close');
  if (!toggle || !menu) return;

  const isOpen = () => menu.classList.contains('is-open');

  const open = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // lock background scroll
    closeBtn?.focus();
  };

  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  // Tapping any menu link navigates (anchor/mailto) — close the menu with it.
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close();
  });

  // If the viewport grows back to desktop while the menu is open, close it.
  // Matches the 820px CSS breakpoint where the hamburger disappears.
  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > 820 && isOpen()) close();
    },
    { passive: true },
  );
}

function setup(): void {
  setupNavScroll();
  setupMobileMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
