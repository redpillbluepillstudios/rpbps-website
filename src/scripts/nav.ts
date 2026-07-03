/* Nav: transparent over the hero, solid on scroll.
   Only toggles when the nav opted into overlay mode (data-overlay); solid navs
   (pages without a hero) stay solid. */

function setupNav(): void {
  const nav = document.getElementById('site-nav');
  if (!nav || nav.dataset.overlay !== 'true') return;

  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNav);
} else {
  setupNav();
}
