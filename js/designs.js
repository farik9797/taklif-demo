/* Barcha dizaynlar: har bir kolleksiya tanlangan tadbir matni bilan jonli namuna. ES2017. */
(function () {
  'use strict';
  // The static GitHub Pages demo sets TAKLIF_DEMO: samples are files there and the builder is a stub.
  var DEMO = !!window.TAKLIF_DEMO;
  var RU = {
    create: 'Создать приглашение', chip: 'Дизайны', title: 'Все дизайны', eventsLabel: 'Вид события',
    lead: 'Дизайнов: {n}. Выберите событие, и образцы покажут его текст.', view: 'Посмотреть', pick: 'Выбрать', tip: 'Рекомендуем'
  };
  var UZ = { lead: '{n} ta dizayn. Tadbirni tanlang: namunalar o‘sha tadbir matni bilan ko‘rsatiladi.', view: 'Ko‘rish', pick: 'Tanlash', tip: 'Tavsiya' };
  var nodes = document.querySelectorAll('[data-l]');
  Array.prototype.forEach.call(nodes, function (n) { UZ[n.getAttribute('data-l')] = n.textContent; });
  function t(k) { return (I18N.lang === 'ru' ? RU : UZ)[k]; }

  var cfg = null;
  var q = new URLSearchParams(location.search);
  var current = q.get('event') || 'toy';
  var events = document.getElementById('events');
  var grid = document.getElementById('grid');

  function sample(theme, ev, card) {
    if (DEMO) return 'demo/' + theme + '-' + ev + '.html' + (card ? '?card=1' : '');
    return '/demo/' + theme + '?event=' + ev + (card ? '&card=1' : '');
  }
  function createUrl(theme, ev) { return DEMO ? 'create.html' : '/create?event=' + ev + '&theme=' + theme; }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text) n.textContent = text;
    return n;
  }

  // sample frames load only when they come near the screen
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.src = e.target.getAttribute('data-src'); io.unobserve(e.target); } });
  }, { rootMargin: '300px 0px' }) : null;

  function renderEvents() {
    Array.prototype.forEach.call(events.querySelectorAll('button'), function (b) { b.remove(); });
    cfg.events.forEach(function (ev) {
      var b = el('button', { type: 'button', role: 'radio', 'aria-checked': String(ev.id === current) }, ev.title[I18N.lang === 'ru' ? 'ru' : 'uz']);
      b.addEventListener('click', function () {
        if (current === ev.id) return;
        current = ev.id;
        history.replaceState(null, '', location.pathname + '?event=' + ev.id);
        renderEvents();
        renderGrid();
      });
      events.appendChild(b);
    });
  }

  function renderGrid() {
    var ev = cfg.events.filter(function (e) { return e.id === current; })[0] || cfg.events[0];
    // the event's own collections first, then the rest in catalogue order
    var tips = ev.themes;
    var list = cfg.themes.slice().sort(function (a, b) {
      var ia = tips.indexOf(a.id), ib = tips.indexOf(b.id);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    });
    document.getElementById('lead').textContent = t('lead').replace('{n}', cfg.themes.length);
    grid.textContent = '';
    list.forEach(function (th) {
      var name = th.name[I18N.lang === 'ru' ? 'ru' : 'uz'];
      var card = el('article', { class: 'dz' });
      var prev = el('a', { class: 'dz-prev', href: sample(th.id, ev.id), target: '_blank', rel: 'noopener', 'aria-label': name + ': ' + t('view') });
      if (tips.indexOf(th.id) > -1) prev.appendChild(el('span', { class: 'chip' }, t('tip')));
      var ifr = el('iframe', { 'data-src': sample(th.id, ev.id, true), title: name, tabindex: '-1', loading: 'lazy' });
      prev.appendChild(ifr);
      if (io) io.observe(ifr); else ifr.src = ifr.getAttribute('data-src');
      var btns = el('div', { class: 'dz-btns' });
      btns.appendChild(el('a', { class: 'btn btn--quiet btn--sm', href: sample(th.id, ev.id), target: '_blank', rel: 'noopener' }, t('view')));
      btns.appendChild(el('a', { class: 'btn btn--dark btn--sm', href: createUrl(th.id, ev.id) }, t('pick')));
      card.appendChild(prev);
      card.appendChild(el('h2', { class: 'dz-name' }, name));
      card.appendChild(btns);
      grid.appendChild(card);
    });
  }

  function applyText() {
    Array.prototype.forEach.call(nodes, function (n) { var v = t(n.getAttribute('data-l')); if (v) n.textContent = v; });
    document.documentElement.lang = I18N.lang === 'ru' ? 'ru' : 'uz';
    if (cfg) { renderEvents(); renderGrid(); }
  }
  document.addEventListener('i18n', applyText);

  fetch('/api/config').then(function (r) { return r.json(); }).then(function (c) {
    cfg = c;
    if (!cfg.events.some(function (e) { return e.id === current; })) current = cfg.events[0].id;
    Array.prototype.forEach.call(document.querySelectorAll('.wordmark'), function (n) { n.textContent = c.brand; });
    I18N.apply();
  });
})();
