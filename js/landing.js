/* Bosh sahifa: uz/ru matnlar, namunalar karuseli, sozlamalar. ES2017. */
(function () {
  'use strict';
  // Russian copy follows the client's mockup word for word.
  var RU = {
    navServices: 'Услуги', navEvents: 'Виды событий', navFeatures: 'Возможности', navPrices: 'Цены', create: 'Создать приглашение',
    heroChip: 'Онлайн-сервис', heroH1: 'Живое приглашение на той за', heroH1b: '10 минут', openSample: 'Открыть образец приглашения',
    heroLead: 'Создавайте бесплатно, оплачивайте, если понравилось, и отправьте ссылку гостям.', scroll: 'Прокрутите вниз',
    evChip: 'Дизайны', evH: 'Для любого события', evP: 'Выберите стиль, который подходит именно вам.', allDesigns: 'Все дизайны',
    ftChip: 'Мероприятия', ftH: 'Что видит гость', ftP: 'Красивое приглашение со всей важной информацией и удобными деталями.', more: 'Узнать больше',
    f1h: 'Открывается с музыкой', f1p: 'Гости услышат особую атмосферу вашего события.',
    f2h: 'Обращение по имени', f2p: 'Каждому гостю своё личное обращение.',
    f3h: 'Таймер и маршрут', f3p: 'Счётчик до события и удобный маршрут.',
    f4h: 'Приду или нет', f4p: 'Гости отвечают, а вы видите список.',
    f5h: 'Узбекский и русский', f5p: 'На одном языке или на двух сразу.',
    prChip: 'Тарифы', prH: 'Цена одного события', prP: '3 дня бесплатно, платите, только если понравится. Второе приглашение −50%.',
    planStart: 'Обычный', planStartP: 'Любой цвет и фон, анимация, музыка, таймер, карта.', planStartBtn: 'Создать', sum: 'сум',
    badge: 'Популярный', planPremP: 'Плюс своё фото или видео фоном, отчёты гостей и полный доступ к функциям.', planPremBtn: 'Начать создавать',
    orgChip: 'Для организаторов', orgH: 'Для тех, кто организует', orgP: 'Дайте клиентам свой промокод: им скидка, вам — дополнительные возможности.',
    faqChip: 'Вопросы', faqH: 'Частые вопросы',
    q1: 'Как работает бесплатный период?', a1: 'Создание и редактирование бесплатны. Затем вы запускаете пробный период на 3 дня: приглашение работает полностью, до 20 гостей. Понравится — оплатите, и оно останется навсегда, без ограничений.',
    q2: 'Можно изменить после публикации?', a2: 'Да, сколько угодно. Даже при смене дизайна имена, дата и фото сохраняются, а ссылка остаётся прежней.',
    q3: 'Можно поставить своё видео?', a3: 'На Premium вертикальное фото или видео mp4 станет фоном, например сделанное в SYNTX.',
    ctaH: 'Создайте своё приглашение прямо сейчас', ctaP: 'Быстро. Красиво. Бесплатно.',
    mine: 'Мои приглашения', rights: 'Все права защищены.', dockHint: '3 дня бесплатно', dockFrom: 'от 49 000 сум'
  };
  var UZ = {};
  var nodes = document.querySelectorAll('[data-l]');
  Array.prototype.forEach.call(nodes, function (n) { UZ[n.getAttribute('data-l')] = n.textContent; });
  var evNodes = document.querySelectorAll('[data-ev]');
  Array.prototype.forEach.call(evNodes, function (n) { UZ['ev_' + n.getAttribute('data-ev')] = n.textContent; });

  function apply() {
    var d = I18N.lang === 'ru' ? RU : UZ;
    Array.prototype.forEach.call(nodes, function (n) { var k = n.getAttribute('data-l'); if (d[k]) n.textContent = d[k]; });
    Array.prototype.forEach.call(evNodes, function (n) { var k = 'ev_' + n.getAttribute('data-ev'); if (d[k]) n.textContent = d[k]; });
  }
  document.addEventListener('i18n', apply);
  I18N.apply();

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- menu (telefon) ----------
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); } });

  // ---------- nav soyasi va pastki tugma ----------
  var nav = document.querySelector('.nav');
  var dock = document.getElementById('dock');
  var hero = document.querySelector('.hero');
  var cta = document.querySelector('.cta');
  function onScroll() {
    var y = window.pageYOffset;
    nav.classList.toggle('scrolled', y > 8);
    var pastHero = y > hero.offsetHeight - 120;
    var atCta = cta.getBoundingClientRect().top < window.innerHeight;
    dock.classList.toggle('show', pastHero && !atCta);
  }
  window.addEventListener('scroll', function () { window.requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  // ---------- paydo bo'lish animatsiyasi ----------
  // automated browsers (screenshots, link previews) get the page fully drawn, without waiting for scroll
  if ('IntersectionObserver' in window && !reduce && !navigator.webdriver) {
    document.documentElement.classList.add('js-reveal');
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (n) { ro.observe(n); });
  }

  // ---------- karusel ----------
  var rail = document.getElementById('rail');
  var items = rail.querySelectorAll('li');
  var dots = document.getElementById('dots');
  Array.prototype.forEach.call(items, function () { dots.appendChild(document.createElement('span')); });
  function step() { return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : rail.clientWidth; }
  document.getElementById('prev').addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
  document.getElementById('next').addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  function syncDots() {
    var i = Math.round(rail.scrollLeft / step());
    Array.prototype.forEach.call(dots.children, function (d, k) { d.className = k === i ? 'on' : ''; });
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  }
  rail.addEventListener('scroll', function () { window.requestAnimationFrame(syncDots); }, { passive: true });
  syncDots();
  // load sample frames only when the gallery comes near the screen
  var frames = rail.querySelectorAll('iframe[data-src]');
  function load(f) { if (!f.src) f.src = f.getAttribute('data-src'); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } });
    }, { root: null, rootMargin: '200px 400px' });
    Array.prototype.forEach.call(frames, function (f) { io.observe(f); });
  } else {
    Array.prototype.forEach.call(frames, load);
  }

  // ---------- sozlamalar ----------
  var ICONS = {
    instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M21 4 3 11l6 2 2 6 3-4 5 4z"/><path d="m9 13 8-6"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/></svg>'
  };
  fetch('/api/config').then(function (r) { return r.json(); }).then(function (c) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-brand]'), function (n) { n.textContent = c.brand; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-price]'), function (n) { n.textContent = I18N.fmt(c.prices[n.getAttribute('data-price')]); });
    var from = I18N.fmt(c.prices.start);
    UZ.dockFrom = from + ' so‘mdan'; RU.dockFrom = 'от ' + from + ' сум';
    apply();
    var ref = '';
    try { ref = localStorage.getItem('taklif_ref') || ''; } catch (e) { /* ignore */ }
    var social = c.social || {};
    if (c.bot && !social.telegram) social.telegram = 'https://t.me/' + c.bot + (ref ? '?start=' + encodeURIComponent(ref) : '');
    if (c.proof) {
      var setProof = function () {
        document.getElementById('proofText').textContent = I18N.lang === 'ru'
          ? 'Уже выбрали Taklif — более ' + I18N.fmt(c.proof) + ' пользователей'
          : 'Taklif’ni ' + I18N.fmt(c.proof) + ' dan ortiq foydalanuvchi tanladi';
      };
      setProof();
      document.addEventListener('i18n', setProof);
      document.getElementById('proof').hidden = false;
    }
    var box = document.getElementById('socials');
    ['instagram', 'telegram', 'facebook', 'youtube'].forEach(function (k) {
      if (!social[k]) return;
      var a = document.createElement('a');
      a.href = social[k]; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', k);
      a.innerHTML = ICONS[k];
      box.appendChild(a);
    });
    if (c.contact) { var p = document.getElementById('partnerLink'); p.href = c.contact; p.target = '_blank'; p.rel = 'noopener'; }
  }).catch(function () {});
})();
