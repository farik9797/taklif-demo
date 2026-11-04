/* Bosh sahifa harakati: GSAP + ScrollTrigger. ES2017.
 * One movement leads (the invitation card); the rest only enters once or follows the scroll.
 * Page works fully without it: html.motion only hides the hero copy until the intro plays,
 * and a fallback in index.html removes the class if GSAP never arrives. */
(function () {
  'use strict';
  var root = document.documentElement;
  function done() { root.classList.remove('motion'); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduce || navigator.webdriver) { done(); return; }
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  // some targets are optional (the proof line shows only with a real PROOF_COUNT)
  gsap.config({ nullTargetWarn: false });
  var mm = gsap.matchMedia();
  var EASE = 'expo.out';

  // ---------- hero: entrance ----------
  // drop the CSS hide first: from() reads its end values from the live styles
  done();
  // the button's CSS transitions on transform/opacity would lag behind the tween; clearProps restores them
  gsap.set('.hero .btn--gold', { transition: 'none' });
  var intro = gsap.timeline({ defaults: { ease: EASE, duration: 1.3, clearProps: 'all' } });
  intro
    .from('.hero-photo', { opacity: 0, scale: 1.08, duration: 2.2, ease: 'power2.out', clearProps: 'opacity' }, 0)
    .from('.hero-card', { opacity: 0, y: 90, rotation: 14, duration: 1.8, clearProps: 'opacity' }, 0.35)
    .from('.hero .chip', { opacity: 0, y: 18 }, 0.15)
    .from('.hero h1 > span', { opacity: 0, y: 46, stagger: 0.14 }, 0.25)
    .from('.hero .lead', { opacity: 0, y: 24 }, 0.55)
    .from('.hero .btn--gold', { opacity: 0, y: 24, scale: 0.96 }, 0.7)
    .from('.hero-cta .more', { opacity: 0, x: -16 }, 0.85)
    .from('.hero .facts li', { opacity: 0, y: 12, stagger: 0.1 }, 0.95)
    .from('.hero .proof:not([hidden])', { opacity: 0, y: 16 }, 0.85)
    .from('.hero .pill', { opacity: 0, y: 24, scale: 0.85, stagger: 0.25, duration: 1.1 }, 1.2);

  // ---------- hero: depth ----------
  // the card floats over the scene; on scroll it lifts faster than the backdrop
  intro.add(function () {
    gsap.to('.hero-card', { y: -12, rotation: 3.6, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });
  gsap.to('.hero-photo', {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-art', {
    y: -70, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  mm.add('(min-width: 900px) and (hover: hover)', function () {
    var hero = document.querySelector('.hero');
    var photo = document.querySelector('.hero-photo');
    var card = document.querySelector('.hero-card');
    gsap.set(card, { transformPerspective: 900 });
    var px = gsap.quickTo(photo, 'x', { duration: 1.2, ease: 'power3.out' });
    var py = gsap.quickTo(photo, 'y', { duration: 1.2, ease: 'power3.out' });
    var cx = gsap.quickTo(card, 'x', { duration: 1, ease: 'power3.out' });
    var tx = gsap.quickTo(card, 'rotationY', { duration: 1, ease: 'power3.out' });
    var ty = gsap.quickTo(card, 'rotationX', { duration: 1, ease: 'power3.out' });
    // the notes sit nearer to the eye than the card, so they move more
    var pills = gsap.utils.toArray('.hero .pill').map(function (p) { return gsap.quickTo(p, 'x', { duration: 1.1, ease: 'power3.out' }); });
    function move(e) {
      var r = hero.getBoundingClientRect();
      var kx = (e.clientX - r.left) / r.width - 0.5, ky = (e.clientY - r.top) / r.height - 0.5;
      px(kx * -18); py(ky * -12);
      cx(kx * 22); tx(kx * 10); ty(ky * -8);
      pills.forEach(function (p, i) { p(kx * (i ? 34 : -28)); });
    }
    hero.addEventListener('mousemove', move);
    return function () { hero.removeEventListener('mousemove', move); };
  });

  // ---------- designs: the cards fan in ----------
  gsap.from('.rail > li', {
    opacity: 0, x: 120, rotate: 4, stagger: 0.09, duration: 1.2, ease: EASE,
    scrollTrigger: { trigger: '.events', start: 'top 75%', once: true }
  });

  // ---------- decor drifts against the scroll ----------
  [
    ['.pr-leaves', '.prices', -60],
    ['.pr-silk', '.prices', 30],
    ['.org-photo', '.org', -36],
    ['.faq-leaves', '.faq', -40],
    ['.cta-flowers', '.cta', -36],
    ['.cta-candles', '.cta', -24]
  ].forEach(function (d) {
    gsap.fromTo(d[0], { y: -d[2] / 2 }, {
      y: d[2] / 2, ease: 'none',
      scrollTrigger: { trigger: d[1], start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // sizes settle once fonts and the sample frames load
  window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
