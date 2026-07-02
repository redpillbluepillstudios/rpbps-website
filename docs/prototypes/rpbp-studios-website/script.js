/* Red Pill Blue Pill Studios — home page behaviors:
   scroll reveals, the hero featured-game carousel, and the contact form. */

(function () {
  'use strict';

  /* ---------- Scroll reveals ---------- */
  function setupReveals() {
    var els = document.querySelectorAll('.rp-reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- Hero carousel ---------- */
  var AUTOPLAY_MS = 6000;

  function setupCarousel() {
    var track = document.getElementById('hero-track');
    if (!track) return;
    var slides = track.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;                     // nothing to rotate
    var dotsWrap = document.getElementById('hero-dots');
    var prevBtn = document.querySelector('.hero-prev');
    var nextBtn = document.querySelector('.hero-next');
    var hero = track.closest('header');
    var i = 0, timer = null, dots = [];

    // Build dots
    if (dotsWrap) {
      for (var s = 0; s < slides.length; s++) {
        (function (idx) {
          var d = document.createElement('button');
          d.type = 'button';
          d.className = 'hero-dot' + (idx === 0 ? ' active' : '');
          d.setAttribute('aria-label', 'Show game ' + (idx + 1));
          d.addEventListener('click', function () { go(idx); restart(); });
          dotsWrap.appendChild(d);
          dots.push(d);
        })(s);
      }
    }

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (i * 100) + '%)';
      dots.forEach(function (d, k) { d.classList.toggle('active', k === i); });
    }
    function next() { go(i + 1); }
    function prev() { go(i - 1); }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function restart() {
      if (timer) { clearInterval(timer); timer = null; }
      if (!reduce) timer = setInterval(next, AUTOPLAY_MS);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    if (hero) {
      hero.addEventListener('mouseenter', function () { if (timer) { clearInterval(timer); timer = null; } });
      hero.addEventListener('mouseleave', restart);
    }
    restart();
  }

  /* ---------- Nav: transparent over hero, solid on scroll ---------- */
  function setupNav() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Boot ---------- */
  function init() {
    setupNav();
    setupReveals();
    setupCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
