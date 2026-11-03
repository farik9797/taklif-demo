/* Admin panel. ES2017. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var pw = '';
  try { pw = sessionStorage.getItem('taklif_admin') || ''; } catch (e) { /* ignore */ }
  var STATUS = { draft: 'черновик', trial: 'пробный период', published: 'опубликовано', blocked: 'заблокировано', created: 'создан', paid: 'оплачен', cancelled: 'отменён' };
  var fmt = function (n) { return String(n || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
  var date = function (ms) { return ms ? new Date(ms).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : ''; };

  function api(method, path, body) {
    return fetch('/api/admin' + path, {
      method: method, headers: { 'content-type': 'application/json', authorization: 'Bearer ' + pw },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (r.status === 401) { logout(); throw new Error('401'); }
      return r.json();
    });
  }
  function td(text, cls) { var c = document.createElement('td'); c.textContent = text == null ? '' : text; if (cls) c.className = cls; return c; }
  function table(el, heads, rows) {
    el.textContent = '';
    var tr = document.createElement('tr');
    heads.forEach(function (h) { var th = document.createElement('th'); th.textContent = h; tr.appendChild(th); });
    var thead = document.createElement('thead'); thead.appendChild(tr); el.appendChild(thead);
    var tb = document.createElement('tbody');
    rows.forEach(function (cells) { var r = document.createElement('tr'); cells.forEach(function (c) { r.appendChild(c); }); tb.appendChild(r); });
    el.appendChild(tb);
  }
  function btn(text, fn) { var b = document.createElement('button'); b.type = 'button'; b.className = 'linkbtn'; b.textContent = text; b.addEventListener('click', fn); return b; }

  function loadStats() {
    api('GET', '/stats').then(function (s) {
      var k = $('#kpis'); k.textContent = '';
      var conv = s.invites.total ? Math.round(100 * (s.invites.published || 0) / s.invites.total) : 0;
      [['Выручка всего, сум', fmt(s.revenue.total)], ['Выручка 30 дней, сум', fmt(s.revenue.last30)], ['Оплат', s.revenue.count],
       ['Создано приглашений', s.invites.total], ['В пробном периоде', s.invites.trials || 0], ['Оплачено', (s.invites.published || 0) + ' (' + conv + '%)'], ['Новых за 30 дней', s.invites.last30 || 0],
       ['Пришли по подписи в чужом приглашении', (s.viral.created || 0) + ', оплатили ' + (s.viral.published || 0)],
       ['Premium / Обычный', s.byPlan.map(function (p) { return p.n; }).join(' / ') || '0']
      ].forEach(function (x) {
        var d = document.createElement('div'); d.className = 'kpi';
        var sp = document.createElement('span'); sp.className = 'small'; sp.textContent = x[0];
        var b = document.createElement('b'); b.textContent = x[1];
        d.appendChild(sp); d.appendChild(b); k.appendChild(d);
      });
      table($('#byEvent'), ['Событие', 'Создано', 'Опубликовано'], s.byEvent.map(function (e) { return [td(e.event_type), td(e.n, 'num'), td(e.published || 0, 'num')]; }));
      $('#partnerHint').textContent = 'Комиссия партнёру: ' + s.commissionPercent + '% от оплат по его коду (PARTNER_COMMISSION). Ссылка для партнёра: ' + location.origin + '/?ref=КОД';
      table($('#promos'), ['Код', 'Скидка', 'Партнёр', 'Приглашений', 'Использований', 'Выручка', 'Комиссия', 'Активен', ''], s.partners.map(function (p) {
        var a = document.createElement('td');
        a.appendChild(btn(p.active ? 'выключить' : 'включить', function () { api('POST', '/promos/' + encodeURIComponent(p.code) + '/toggle').then(loadStats); }));
        return [td(p.code), td(p.percent + '%', 'num'), td(p.partner || '—'), td(p.invites, 'num'), td(p.uses, 'num'), td(fmt(p.revenue), 'num'), td(fmt(p.commission), 'num'), td(p.active ? 'да' : 'нет'), a];
      }));
    }).catch(function () {});
  }

  function loadInvites(q) {
    api('GET', '/invites?q=' + encodeURIComponent(q || '')).then(function (rows) {
      table($('#invites'), ['Создано', 'Имена', 'Событие', 'Дата', 'Статус', 'Тариф', 'Оплачено', 'Просм.', 'Ответы', 'Код / откуда', 'Владелец TG', ''], rows.map(function (r) {
        var link = document.createElement('td');
        var a = document.createElement('a'); a.href = '/i/' + r.slug; a.target = '_blank'; a.rel = 'noopener'; a.textContent = [r.name1, r.name2].filter(Boolean).join(' & ') || r.slug;
        link.appendChild(a);
        var acts = document.createElement('td'); var box = document.createElement('div'); box.className = 'acts'; acts.appendChild(box);
        if (r.status !== 'published') box.appendChild(btn('опубликовать вручную', function () {
          var plan = confirm('Premium? (Отмена = Обычный)') ? 'premium' : 'start';
          var amount = prompt('Сумма, полученная вручную (сум), 0 если бесплатно', '0');
          if (amount === null) return;
          api('POST', '/invites/' + r.slug + '/publish', { plan: plan, amount: amount }).then(function () { loadInvites(q); });
        }));
        box.appendChild(btn(r.status === 'blocked' ? 'разблокировать' : 'заблокировать', function () {
          api('POST', '/invites/' + r.slug + '/status', { status: r.status === 'blocked' ? (r.paid ? 'published' : 'draft') : 'blocked' }).then(function () { loadInvites(q); });
        }));
        return [td(date(r.created_at)), link, td(r.event_type), td(r.date), td(STATUS[r.status] || r.status), td(r.plan), td(fmt(r.paid), 'num'), td(r.views, 'num'), td(r.rsvps, 'num'),
          td([r.ref_code, r.from_slug ? 'из ' + r.from_slug : ''].filter(Boolean).join(', ')), td(r.owner_tg_name), acts];
      }));
    }).catch(function () {});
  }

  function loadPayments() {
    api('GET', '/payments').then(function (rows) {
      table($('#payments'), ['№', 'Создан', 'Оплачен', 'Приглашение', 'Тариф', 'Способ', 'Сумма', 'Промокод', 'Статус', 'ID платёжки'], rows.map(function (p) {
        return [td(p.id, 'num'), td(date(p.created_at)), td(date(p.paid_at)), td(p.slug), td(p.plan), td(p.provider), td(fmt(p.amount), 'num'), td(p.promo_code), td(STATUS[p.status] || p.status), td(p.ext_id)];
      }));
    }).catch(function () {});
  }

  function show(tab) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (s) { s.hidden = s.getAttribute('data-tab') !== tab; });
    if (tab === 'stats' || tab === 'promos') loadStats();
    if (tab === 'invites') loadInvites($('#search').elements.q.value);
    if (tab === 'payments') loadPayments();
  }
  function enter() { $('#login').hidden = true; $('#panel').hidden = false; show('stats'); }
  function logout() { pw = ''; try { sessionStorage.removeItem('taklif_admin'); } catch (e) { /* ignore */ } $('#login').hidden = false; $('#panel').hidden = true; }

  $('#login').addEventListener('submit', function (e) {
    e.preventDefault();
    pw = this.elements.pw.value;
    api('GET', '/stats').then(function () {
      try { sessionStorage.setItem('taklif_admin', pw); } catch (er) { /* ignore */ }
      enter();
    }).catch(function () { $('#loginErr').textContent = 'Неверный пароль или ADMIN_PASSWORD не задан на сервере.'; });
  });
  $('#panel').addEventListener('change', function (e) { if (e.target.name === 'tab') show(e.target.value); });
  $('#search').addEventListener('submit', function (e) { e.preventDefault(); loadInvites(this.elements.q.value); });
  $('#promoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = this.elements;
    api('POST', '/promos', { code: f.code.value, percent: f.percent.value, partner: f.partner.value, max_uses: f.max_uses.value }).then(function () { f.code.value = ''; f.partner.value = ''; loadStats(); });
  });
  if (pw) enter();
})();
