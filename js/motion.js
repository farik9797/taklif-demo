/* Bosh sahifa harakati: GSAP + ScrollTrigger. ES2017.
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
    gsap.to('.pill--music', { y: -10, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.pill--rsvp', { y: 9, duration: 3.3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
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

  // ---------- prices: the premium plan breathes, stars turn ----------
  mm.add('(min-width: 900px)', function () {
    gsap.to('.plan--premium', { y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });
  gsap.utils.toArray('.star').forEach(function (s) {
    gsap.to(s, { rotate: 90, duration: 10, ease: 'none', repeat: -1 });
  });

  // ---------- gold dust over the hero and the closing band ----------
  function dust(host, count) {
    var box = document.createElement('div');
    box.className = 'dust';
    box.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < count; i++) box.appendChild(document.createElement('i'));
    host.appendChild(box);
    gsap.utils.toArray(box.children).forEach(function (p) {
      gsap.set(p, { left: gsap.utils.random(0, 100) + '%', top: gsap.utils.random(0, 100) + '%', scale: gsap.utils.random(0.4, 1.2) });
      gsap.to(p, {
        y: gsap.utils.random(-90, -30), x: gsap.utils.random(-24, 24), opacity: gsap.utils.random(0.5, 1),
        duration: gsap.utils.random(4, 8), delay: gsap.utils.random(0, 4),
        ease: 'sine.inOut', yoyo: true, repeat: -1
      });
    });
  }
  mm.add('(min-width: 900px)', function () { dust(document.querySelector('.hero'), 22); });
  dust(document.querySelector('.cta'), 16);

  // sizes settle once fonts and the sample frames load
  window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
