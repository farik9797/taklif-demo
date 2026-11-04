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
  gsap.set('.hero-cta .btn', { transition: 'none' });
  var intro = gsap.timeline({ defaults: { ease: EASE, duration: 1.3, clearProps: 'all' } });
  intro
    .from('.hero-bg', { opacity: 0, scale: 1.06, duration: 2.2, ease: 'power2.out', clearProps: 'opacity' }, 0)
    .from('.hero-art', { opacity: 0, y: 90, rotation: 7, duration: 1.8, clearProps: 'opacity' }, 0.35)
    .from('.hero .chip', { opacity: 0, y: 18 }, 0.15)
    .from('.hero h1 > *', { opacity: 0, y: 46, stagger: 0.14 }, 0.25)
    .from('.hero .lead', { opacity: 0, y: 24 }, 0.6)
    .from('.hero-cta .btn', { opacity: 0, y: 24, stagger: 0.12 }, 0.75)
    .from('.hero .proof:not([hidden])', { opacity: 0, y: 16 }, 0.95)
    .from('.hero .scroll', { opacity: 0 }, 1.2);

  // ---------- hero: depth ----------
  // the card floats over the scene; on scroll it lifts faster than the backdrop
  intro.add(function () {
    gsap.to('.hero-card', { y: -12, rotation: 9, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });
  gsap.to('.hero-bg', {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-art', {
    y: -70, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  mm.add('(min-width: 900px) and (hover: hover)', function () {
    var hero = document.querySelector('.hero');
    var photo = document.querySelector('.hero-bg');
    var card = document.querySelector('.hero-card');
    gsap.set(card, { transformPerspective: 900 });
    var px = gsap.quickTo(photo, 'x', { duration: 1.2, ease: 'power3.out' });
    var py = gsap.quickTo(photo, 'y', { duration: 1.2, ease: 'power3.out' });
    var cx = gsap.quickTo(card, 'x', { duration: 1, ease: 'power3.out' });
    var tx = gsap.quickTo(card, 'rotationY', { duration: 1, ease: 'power3.out' });
    var ty = gsap.quickTo(card, 'rotationX', { duration: 1, ease: 'power3.out' });
    function move(e) {
      var r = hero.getBoundingClientRect();
      var kx = (e.clientX - r.left) / r.width - 0.5, ky = (e.clientY - r.top) / r.height - 0.5;
      px(kx * -18); py(ky * -12);
      cx(kx * 22); tx(kx * 10); ty(ky * -8);
    }
    hero.addEventListener('mousemove', move);
    return function () { hero.removeEventListener('mousemove', move); };
  });

  // ---------- templates: the cards rise one after another ----------
  gsap.from('.tpl-grid > li', {
    opacity: 0, y: 70, stagger: 0.08, duration: 1.2, ease: EASE, clearProps: 'all',
    scrollTrigger: { trigger: '.tpl', start: 'top 75%', once: true }
  });

  // ---------- decor drifts against the scroll ----------
  [
    ['.ft-flowers', '.features', -50],
    ['.st-flowers', '.story', -50],
    ['.how-photo', '.how', -30],
    ['.pr-flowers', '.prices', -50],
    ['.biz-photo', '.duo', -30],
    ['.fn-flowers', '.final', -50]
  ].forEach(function (d) {
    gsap.fromTo(d[0], { y: -d[2] / 2 }, {
      y: d[2] / 2, ease: 'none',
      scrollTrigger: { trigger: d[1], start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // sizes settle once fonts and the sample frames load
  window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
