/* Bosh sahifa: uz/ru matnlar, namunalar karuseli, sozlamalar. ES2017. */
(function () {
  'use strict';
  // Russian copy mirrors the Uzbek in index.html, which the page reads as its own dictionary.
  var RU = {
    navTemplates: 'Шаблоны', navFeatures: 'Возможности', navPrices: 'Тарифы', navPartners: 'Партнёрам', navContacts: 'Контакты',
    langCode: 'RU', create: 'Создать приглашение', seeExamples: 'Посмотреть примеры', openSample: 'Открыть образец приглашения', scroll: 'Прокрутите вниз',
    heroChip: 'Цифровые приглашения нового поколения', heroH1: 'Ваш особенный день начинается', heroH1b: 'с красивого', heroH1c: 'приглашения',
    heroLead: 'Создайте уникальное онлайн-приглашение на свадьбу, той, день рождения или другое важное событие всего за несколько минут.',
    tplKicker: 'Наша коллекция', tplH: 'Для каждого события — свой стиль', tplP: 'От изысканной свадебной классики до современных минималистичных решений.', allTemplates: 'Смотреть все шаблоны',
    tToy: 'Свадебные приглашения', tBirthday: 'День рождения', tQiz: 'Киз базми', tFotiha: 'Фотиха туйи', tSunnat: 'Суннат туй', tBeshik: 'Бешик туй', tKorp: 'Корпоратив',
    ftChip: 'Больше, чем просто приглашение', ftH: 'Всё, что нужно вашим гостям, в одном месте', ftP: 'Ваше приглашение становится полноценной страницей события, где каждая деталь продумана.', more: 'Узнать больше',
    f1h: 'Музыка и атмосфера', f1p: 'Добавьте любимую мелодию', f2h: 'Персональное обращение', f2p: 'Обращение по имени', f3h: 'Обратный отсчёт', f3p: 'Красивый таймер',
    f4h: 'Место проведения', f4p: 'Добавьте адрес и карту', f5h: 'Подтверждение участия', f5p: 'Узнайте, кто придёт', f6h: 'Два языка', f6p: 'Русский и узбекский',
    stChip: 'Ваша история', stH: 'Моменты, которыми хочется делиться', stP: 'Добавьте фотографии и видео, расскажите свою историю и создайте особенное настроение.', seeGallery: 'Посмотреть галерею',
    howChip: 'Как это работает', howH: 'Создать приглашение легко и быстро', s1: 'Выберите шаблон', s2: 'Заполните информацию', s3: 'Отправьте гостям',
    prChip: 'Простой выбор. Понятная цена.', prH: 'Выберите свой формат приглашения', prP: 'Никаких сложных тарифов и лишних расходов. Только необходимые возможности.',
    planStart: 'Обычный', planStartD: 'Для тех, кто хочет красиво пригласить гостей.', ps1: 'Премиальный шаблон', ps2: 'Музыкальное сопровождение', ps3: 'Таймер и карта', planStartBtn: 'Выбрать обычный',
    badge: 'Популярный', planPremD: 'Максимальная персонализация для особенного события.', pp1: 'Все возможности', pp2: 'Собственные фотографии', pp3: 'Персональное видео', planPremBtn: 'Создать Premium', sum: 'сум',
    bizH: 'Ваш бизнес заслуживает современных решений', bizP: 'Предлагайте клиентам цифровые приглашения и получайте новые возможности для развития.', partner: 'Стать партнёром',
    rvK: 'Ваши истории — наша гордость', rvH: 'Нас рекомендуют за впечатления', rv1: 'Taklif сделал наш праздник ещё более особенным! Спасибо!',
    rv2: 'Гости отвечали прямо по ссылке — список гостей собрался сам. Очень удобно.', rv3: 'Сделали приглашение на суннат-той за один вечер, родственники хвалили дизайн.',
    faqH: 'Остались вопросы?', faqP: 'Найдите ответы на популярные вопросы или свяжитесь с нами.', faqAll: 'Перейти к FAQ',
    q2: 'Можно ли изменить приглашение после публикации?', a2: 'Да, сколько угодно. Даже при смене дизайна имена, дата и фото сохраняются, а ссылка остаётся прежней.',
    q3: 'Можно добавить свои фотографии и видео?', a3: 'Да, на Premium: фотогалерея, а фоном — вертикальное фото или видео mp4.',
    q5: 'Как отправить приглашение гостям?', a5: 'Одной ссылкой: в Telegram, WhatsApp, Instagram или по SMS. На Premium каждому гостю — своя именная ссылка.',
    q1: 'Как работает бесплатный период?', a1: 'Создание и редактирование бесплатны. Затем вы запускаете пробный период на 3 дня: приглашение работает полностью, до 20 гостей. Понравится — оплатите, и оно останется навсегда, без ограничений.',
    q4: 'Нужна регистрация?', a4: 'Нет. Начинаете сразу на сайте или в Telegram, черновик сохраняется в этом браузере или в вашем Telegram-аккаунте.',
    q6: 'Что будет, если не оплатить через 3 дня?', a6: 'Гости увидят надпись «срок истёк». Всё сохранится: после оплаты приглашение сразу откроется снова.',
    ctaH: 'Ваш особенный день заслуживает особенного приглашения', ctaP: 'Создайте красивую страницу события и начните праздновать ещё до встречи.', ctaNote: 'Создание занимает около 10 минут',
    tagline: 'Искусство приглашать красиво.', mine: 'Мои приглашения', rights: 'Все права защищены.', dockHint: '3 дня бесплатно', dockFrom: 'от 49 000 сум'
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
  var cta = document.querySelector('.final');
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

  // ---------- savollar: first three, the button opens the rest ----------
  var faqAll = document.getElementById('faqAll');
  faqAll.addEventListener('click', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.more-q'), function (d) { d.hidden = false; });
    faqAll.hidden = true;
  });
  // ---------- sharhlar: one at a time, the dots switch, a slow auto turn ----------
  var revs = document.querySelectorAll('#revList .rev');
  var dots = document.querySelectorAll('#revDots button');
  var revAt = 0;
  function showRev(i) {
    revAt = i;
    Array.prototype.forEach.call(revs, function (r, k) { r.classList.toggle('on', k === i); });
    Array.prototype.forEach.call(dots, function (d, k) { d.setAttribute('aria-pressed', String(k === i)); });
  }
  var revTimer = reduce ? 0 : setInterval(function () { showRev((revAt + 1) % revs.length); }, 6000);
  Array.prototype.forEach.call(dots, function (d, k) {
    d.addEventListener('click', function () { clearInterval(revTimer); showRev(k); });
  });

  // the language menu closes once a language is picked
  var langMenu = document.querySelector('.lang');
  langMenu.addEventListener('click', function (e) { if (e.target.closest('button')) langMenu.open = false; });

  // ---------- sozlamalar ----------
  // Lucide 0.469: instagram, send, facebook, youtube
  var ICONS = {
    instagram: '<svg viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>'
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
    if (c.contact) { var p = document.getElementById('partnerLink'); p.href = c.contact; p.target = '_blank'; p.rel = 'noopener'; p.hidden = false; }
  }).catch(function () {});
})();
