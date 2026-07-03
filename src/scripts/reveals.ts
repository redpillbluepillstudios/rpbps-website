/* Reveal-on-scroll: fade/rise elements marked .rp-reveal as they enter view. */

function setupReveals(): void {
  const els = document.querySelectorAll<HTMLElement>('.rp-reveal');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('in'));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupReveals);
} else {
  setupReveals();
}
