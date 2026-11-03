/* Mehmonlar ro'yxati: ismli havolalar, javoblar, statistika, qarindoshlar havolasi. ES2017. */
(function () {
  'use strict';
  I18N.extend({
    uz: {
      gBack: 'Konstruktorga', gOpen: 'Taklifnomani ochish', gAdd: 'Mehmon qo‘shish', gOne: 'Bittadan', gList: 'Ro‘yxat bilan',
      gName: 'Ism', gNamePh: 'Aziz aka', gGreeting: 'Murojaat', gGreetingPh: 'Hurmatli', gGroup: 'Guruh', gGroupPh: 'Qarindoshlar, 3-stol…',
      gMax: 'Necha kishi', gAddBtn: 'Qo‘shish', gListLabel: 'Har qatorda bitta mehmon', gListPh: 'Aziz aka; Qarindoshlar; 3\nDilnoza opa; Do‘stlar; 2\nSardor',
      gListHint: 'Format: ism; guruh; necha kishi. Guruh va son ixtiyoriy.', gAddAll: 'Hammasini qo‘shish',
      gFamily: 'Qarindoshlar uchun havola', gFamilyHint: 'Ota-ona yoki qarindoshlarga yuboring: ular o‘z mehmonlarini ro‘yxatdan o‘tmasdan qo‘shadi.',
      gFamilyNew: 'Yangi havola yaratish', gSearch: 'Ism bo‘yicha qidirish', gAll: 'Hammasi', gYes: 'Keladi', gNo: 'Kelmaydi', gWait: 'Kutilmoqda',
      gCsv: 'Excel (CSV)', gSetGroup: 'Guruhga o‘tkazish', gDelete: 'O‘chirish', gEmpty: 'Hali mehmon yo‘q. Yuqorida qo‘shing.',
      gGeneral: 'Umumiy havola orqali javoblar', gNoGroup: 'Guruhsiz', gSelected: 'tanlandi',
      gLinksOff: 'Ismli havolalar Premium tarifda ishlaydi. Taklifnomani Premium’ga o‘tkazing.',
      tTotal: 'Jami mehmon', tResponded: 'Javob berdi', tYes: 'Keladi', tNo: 'Kelmaydi', tWait: 'Kutilmoqda', tOpened: 'Ochib ko‘rdi', tPeople: 'kishi',
      sLink: 'Havola', sCopied: 'Havola nusxalandi', sAdded: 'Qo‘shildi', sSaved: 'Saqlandi', sDeleted: 'O‘chirildi', sLimit: 'Sinov davrida {n} tagacha mehmon. To‘lovdan keyin cheklov yo‘q.',
      sConfirm: 'Tanlangan mehmonlarni o‘chirasizmi?', sNoAccess: 'Bu taklifnoma sizniki emas yoki havola eskirgan.', edit: 'Tahrirlash', save: 'Saqlash', cancel: 'Bekor qilish',
      aPending: 'Javob yo‘q', aYes: 'Keladi', aNo: 'Kelmaydi', unlimited: 'Cheklovsiz', capOf: '{a} / {b} mehmon (sinov)', openedMark: 'ochgan', byFamily: 'qarindoshdan', inviteMsg: '{g} {n}! Sizni taklif qilamiz:'
    },
    ru: {
      gBack: 'В конструктор', gOpen: 'Открыть приглашение', gAdd: 'Добавить гостей', gOne: 'По одному', gList: 'Списком',
      gName: 'Имя', gNamePh: 'Азиз ака', gGreeting: 'Обращение', gGreetingPh: 'Дорогой', gGroup: 'Группа', gGroupPh: 'Родственники, стол 3…',
      gMax: 'Сколько человек', gAddBtn: 'Добавить', gListLabel: 'По одному гостю в строке', gListPh: 'Азиз ака; Родственники; 3\nДилноза опа; Друзья; 2\nСардор',
      gListHint: 'Формат: имя; группа; сколько человек. Группа и число необязательны.', gAddAll: 'Добавить всех',
      gFamily: 'Ссылка для родственников', gFamilyHint: 'Отправьте родителям или родственникам: они добавят своих гостей без входа в систему.',
      gFamilyNew: 'Создать новую ссылку', gSearch: 'Поиск по имени', gAll: 'Все', gYes: 'Придут', gNo: 'Отказались', gWait: 'Ожидание',
      gCsv: 'Excel (CSV)', gSetGroup: 'Перенести в группу', gDelete: 'Удалить', gEmpty: 'Гостей пока нет. Добавьте выше.',
      gGeneral: 'Ответы по общей ссылке', gNoGroup: 'Без группы', gSelected: 'выбрано',
      gLinksOff: 'Именные ссылки работают на тарифе Premium. Переведите приглашение на Premium.',
      tTotal: 'Всего гостей', tResponded: 'Ответили', tYes: 'Придут', tNo: 'Отказались', tWait: 'Ожидание', tOpened: 'Открыли', tPeople: 'чел.',
      sLink: 'Ссылка', sCopied: 'Ссылка скопирована', sAdded: 'Добавлено', sSaved: 'Сохранено', sDeleted: 'Удалено', sLimit: 'В пробный период до {n} гостей. После оплаты без ограничений.',
      sConfirm: 'Удалить выбранных гостей?', sNoAccess: 'Это приглашение не ваше или ссылка устарела.', edit: 'Изменить', save: 'Сохранить', cancel: 'Отмена',
      aPending: 'Нет ответа', aYes: 'Придёт', aNo: 'Не придёт', unlimited: 'Без ограничений', capOf: '{a} / {b} гостей (пробный период)', openedMark: 'открыл', byFamily: 'от семьи', inviteMsg: '{g} {n}! Приглашаем вас:'
    }
  });
  var t = I18N.t;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var tg = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData ? window.Telegram.WebApp : null;
  var q = new URLSearchParams(location.search);
  var slug = q.get('slug') || '';
  var key = '';
  var cfg = null, rep = null;
  var selected = {};
  var filter = 'all', search = '';

  try {
    var mine = JSON.parse(localStorage.getItem('taklif_mine') || '[]');
    mine.forEach(function (x) { if (x.slug === slug) key = x.key; });
  } catch (e) { /* ignore */ }

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null && attrs[k] !== false) n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  function api(method, path, body) {
    var headers = { 'content-type': 'application/json' };
    if (key) headers['x-edit-key'] = key;
    if (tg) headers['x-tg-init'] = tg.initData;
    return fetch('/api' + path, { method: method, headers: headers, body: body ? JSON.stringify(body) : undefined }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || r.status); e.code = j.error; e.data = j; throw e; } return j; });
    });
  }
  var toastT;
  function toast(msg, err) {
    var n = $('#toast'); n.textContent = msg; n.classList.toggle('is-error', Boolean(err)); n.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { n.classList.remove('show'); }, 2200);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    var ta = el('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove(); return Promise.resolve();
  }
  function ev() { return cfg.events.filter(function (e) { return e.id === rep.data.event; })[0] || cfg.events[0]; }
  function lang() { return rep.data.lang === 'ru' ? 'ru' : 'uz'; }
  function inviteMessage(g) {
    var d = rep.data;
    var lb = cfg.labels[lang()];
    var greet = g.greeting || d.greeting || lb.dear;
    return t('inviteMsg').replace('{g}', greet).replace('{n}', g.name) + ' ' + ev().title[lang()] + ', ' +
      [d.name1, d.name2].filter(Boolean).join(lang() === 'ru' ? ' и ' : ' va ') + (d.date ? ', ' + d.date : '') + '\n' + g.link;
  }

  // ---------- render ----------
  function render() {
    var d = rep.data;
    $('#gmHead').hidden = false;
    $('#gmTitle').textContent = [d.name1, d.name2].filter(Boolean).join(' & ') || '—';
    $('#gmSub').textContent = ev().title[I18N.lang] + (d.date ? ', ' + d.date : '') + ' · ' +
      (rep.cap ? t('capOf').replace('{a}', rep.stats.total).replace('{b}', rep.cap) : t('unlimited'));
    var pill = $('#gmPill');
    var names = { draft: 'stDraftT', trial: 'stTrialT', expired: 'stExpiredT', published: 'stLiveT' };
    pill.className = 'pill pill--' + rep.state; pill.textContent = t(names[rep.state] || 'stDraftT');
    $('#gmOpen').href = '/i/' + slug;
    $('#backLink').href = (tg ? '/app' : '/create') + '?open=' + slug;
    $('#gmLinksOff').hidden = rep.guestLinks;
    $('#gmAdd').hidden = false; $('#gmFamily').hidden = false; $('#gmListing').hidden = false;

    var s = rep.stats;
    var pct = s.total ? Math.round(100 * s.responded / s.total) : 0;
    var tiles = [
      [t('tTotal'), s.total, ''], [t('tResponded'), pct + '%', s.responded + ' / ' + s.total],
      [t('tYes'), s.yes, s.people + ' ' + t('tPeople')], [t('tNo'), s.no, ''], [t('tWait'), s.pending, ''], [t('tOpened'), s.opened, '']
    ];
    var box = $('#tiles'); box.textContent = '';
    tiles.forEach(function (x, i) {
      var tile = el('div', { class: 'tile' + (i === 2 ? ' tile--hi' : '') });
      tile.appendChild(el('span', { class: 'small' }, x[0]));
      tile.appendChild(el('b', {}, String(x[1])));
      if (x[2]) tile.appendChild(el('span', { class: 'small' }, x[2]));
      box.appendChild(tile);
    });
    var qs = $('#qstats'); qs.textContent = '';
    rep.questions.forEach(function (qq) {
      if (!qq.answered) return;
      if (qq.type === 'yesno') {
        qs.appendChild(el('p', { class: 'qstat' }, qq.text + ': ' + qq.yes + ' / ' + qq.answered));
      } else {
        var det = el('details', { class: 'qstat' });
        det.appendChild(el('summary', {}, qq.text + ' (' + qq.answered + ')'));
        var ul = el('ul');
        qq.values.forEach(function (v) { ul.appendChild(el('li', {}, v)); });
        det.appendChild(ul); qs.appendChild(det);
      }
    });

    var dl = $('#groupList'); dl.textContent = '';
    groups().forEach(function (g) { if (g) dl.appendChild(el('option', { value: g })); });
    $('#btnFamilyTg').href = 'https://t.me/share/url?url=' + encodeURIComponent(rep.familyLink) + '&text=' + encodeURIComponent(t('gFamily'));
    renderList();
  }
  function groups() {
    var seen = {};
    return rep.guests.map(function (g) { return g.group; }).filter(function (g) { if (seen[g]) return false; seen[g] = 1; return true; });
  }
  function visible(g) {
    if (search && g.name.toLowerCase().indexOf(search) < 0) return false;
    if (filter === 'yes') return g.answer === 'yes';
    if (filter === 'no') return g.answer === 'no';
    if (filter === 'wait') return !g.answer;
    return true;
  }
  function statusPill(g) {
    var cls = g.answer === 'yes' ? 'ok' : g.answer === 'no' ? 'off' : 'wait';
    var txt = g.answer === 'yes' ? t('aYes') + (g.people ? ' · ' + g.people : '') : g.answer === 'no' ? t('aNo') : t('aPending');
    return el('span', { class: 'gpill gpill--' + cls }, txt);
  }
  function answersLine(g) {
    var parts = rep.questions.map(function (qq) {
      var v = g.answers && g.answers[qq.id];
      if (!v) return '';
      return qq.text + ': ' + (qq.type === 'yesno' ? (v === 'yes' ? '✓' : '✗') : v);
    }).filter(Boolean);
    return parts.join(' · ');
  }
  function renderList() {
    var wrap = $('#gmGroups'); wrap.textContent = '';
    var list = rep.guests.filter(visible);
    $('#gmEmpty').hidden = rep.guests.length > 0;
    var byGroup = {};
    list.forEach(function (g) { (byGroup[g.group] = byGroup[g.group] || []).push(g); });
    Object.keys(byGroup).forEach(function (name) {
      var sec = el('section', { class: 'ggroup' });
      var people = byGroup[name].reduce(function (s, g) { return s + (g.answer === 'yes' ? g.people : 0); }, 0);
      sec.appendChild(el('h3', { class: 'ggroup-h' }, (name || t('gNoGroup')) + ' · ' + byGroup[name].length + (people ? ' · ' + people + ' ' + t('tPeople') : '')));
      var ul = el('ul', { class: 'glist' });
      byGroup[name].forEach(function (g) { ul.appendChild(row(g)); });
      sec.appendChild(ul); wrap.appendChild(sec);
    });
    var gen = $('#gmGeneral'); gen.textContent = '';
    $('#gmGeneralBox').hidden = !rep.general.length;
    rep.general.forEach(function (r) {
      var li = el('li', { class: 'grow' });
      var info = el('div', { class: 'ginfo' });
      info.appendChild(el('strong', {}, r.name));
      var al = answersLine(r);
      if (al) info.appendChild(el('span', { class: 'small' }, al));
      li.appendChild(info);
      li.appendChild(statusPill(r));
      var del = el('button', { type: 'button', class: 'row-rm', 'aria-label': t('gDelete') }, '×');
      del.addEventListener('click', function () { api('POST', '/invites/' + slug + '/general/' + r.id + '/delete').then(function (j) { rep = j; render(); toast(t('sDeleted')); }); });
      li.appendChild(del);
      gen.appendChild(li);
    });
    syncBulk();
  }
  function row(g) {
    var li = el('li', { class: 'grow' });
    var cb = el('input', { type: 'checkbox', 'aria-label': g.name });
    cb.checked = Boolean(selected[g.id]);
    cb.addEventListener('change', function () { if (cb.checked) selected[g.id] = 1; else delete selected[g.id]; syncBulk(); });
    var info = el('div', { class: 'ginfo' });
    info.appendChild(el('strong', {}, (g.greeting ? g.greeting + ' ' : '') + g.name));
    var meta = [g.max > 1 ? '≤ ' + g.max + ' ' + t('tPeople') : '', g.opened ? t('openedMark') : '', g.addedBy === 'family' ? t('byFamily') : ''].filter(Boolean).join(' · ');
    var al = answersLine(g);
    if (meta || al) info.appendChild(el('span', { class: 'small' }, [meta, al].filter(Boolean).join(' · ')));
    var acts = el('div', { class: 'gacts' });
    var cp = el('button', { type: 'button', class: 'btn btn--quiet btn--sm' }, t('sLink'));
    cp.addEventListener('click', function () { copy(g.link).then(function () { toast(t('sCopied')); }); });
    var tgA = el('a', { class: 'btn btn--quiet btn--sm', target: '_blank', rel: 'noopener', href: 'https://t.me/share/url?url=' + encodeURIComponent(g.link) + '&text=' + encodeURIComponent(inviteMessage(g).replace('\n' + g.link, '')) }, 'Telegram');
    var wa = el('a', { class: 'btn btn--quiet btn--sm', target: '_blank', rel: 'noopener', href: 'https://wa.me/?text=' + encodeURIComponent(inviteMessage(g)) }, 'WhatsApp');
    var ed = el('button', { type: 'button', class: 'linkbtn' }, t('edit'));
    ed.addEventListener('click', function () { li.replaceWith(editRow(g)); });
    acts.appendChild(cp); acts.appendChild(tgA); acts.appendChild(wa); acts.appendChild(ed);
    li.appendChild(cb); li.appendChild(info); li.appendChild(statusPill(g)); li.appendChild(acts);
    return li;
  }
  function editRow(g) {
    var f = el('form', { class: 'gedit' });
    function field(label, input) { var l = el('label', { class: 'field' }); l.appendChild(el('span', {}, label)); l.appendChild(input); return l; }
    var name = el('input', { maxlength: '80', required: 'required' }); name.value = g.name;
    var greet = el('input', { maxlength: '40', placeholder: t('gGreetingPh') }); greet.value = g.greeting;
    var grp = el('input', { maxlength: '60', list: 'groupList' }); grp.value = g.group;
    var max = el('input', { type: 'number', min: '1', max: '20' }); max.value = g.max;
    var ans = el('select');
    [['', t('aPending')], ['yes', t('aYes')], ['no', t('aNo')]].forEach(function (o) { ans.appendChild(el('option', { value: o[0] }, o[1])); });
    ans.value = g.answer || '';
    var ppl = el('input', { type: 'number', min: '1', max: '20' }); ppl.value = g.people || 1;
    [field(t('gName'), name), field(t('gGreeting'), greet), field(t('gGroup'), grp), field(t('gMax'), max), field(t('tYes'), ans), field(t('tPeople'), ppl)].forEach(function (x) { f.appendChild(x); });
    var bar = el('div', { class: 'up-row' });
    var sv = el('button', { type: 'submit', class: 'btn btn--sm' }, t('save'));
    var cn = el('button', { type: 'button', class: 'linkbtn' }, t('cancel'));
    var del = el('button', { type: 'button', class: 'btn btn--sm gm-danger' }, t('gDelete'));
    cn.addEventListener('click', renderList);
    del.addEventListener('click', function () { bulk('delete', [g.id]); });
    bar.appendChild(sv); bar.appendChild(cn); bar.appendChild(del);
    f.appendChild(bar);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      api('PUT', '/invites/' + slug + '/guests/' + g.id, { name: name.value, greeting: greet.value, group: grp.value, max: max.value, answer: ans.value || null, people: ppl.value })
        .then(function (j) { rep = j; render(); toast(t('sSaved')); }).catch(function () { toast(t('errGeneric'), true); });
    });
    setTimeout(function () { name.focus(); }, 30);
    return f;
  }
  function syncBulk() {
    var ids = Object.keys(selected);
    $('#gmBulk').hidden = !ids.length;
    $('#gmBulkCount').textContent = ids.length + ' ' + t('gSelected');
  }
  function bulk(action, ids, group) {
    if (action === 'delete' && !window.confirm(t('sConfirm'))) return;
    api('POST', '/invites/' + slug + '/guests/bulk', { action: action, ids: ids, group: group }).then(function (j) {
      rep = j; selected = {}; render(); toast(action === 'delete' ? t('sDeleted') : t('sSaved'));
    }).catch(function () { toast(t('errGeneric'), true); });
  }

  // ---------- actions ----------
  function addItems(items, form) {
    if (!items.length) return;
    var b = form.querySelector('button[type="submit"]');
    b.setAttribute('aria-busy', 'true');
    api('POST', '/invites/' + slug + '/guests', { items: items }).then(function (j) {
      rep = j; render(); form.reset(); toast(t('sAdded') + ': ' + items.length);
      var first = form.querySelector('input, textarea'); if (first) first.focus();
    }).catch(function (e) {
      toast(e.code === 'trial_limit' ? t('sLimit').replace('{n}', rep.cap) : t('errGeneric'), true);
    }).then(function () { b.removeAttribute('aria-busy'); });
  }
  $('#formOne').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = this.elements;
    if (!f.name.value.trim()) return;
    addItems([{ name: f.name.value, greeting: f.greeting.value, group: f.group.value, max: f.max.value }], this);
  });
  $('#formList').addEventListener('submit', function (e) {
    e.preventDefault();
    var items = this.elements.list.value.split('\n').map(function (line) {
      var p = line.split(/[;\t]/).map(function (x) { return x.trim(); });
      return { name: p[0], group: p[1] || '', max: p[2] || 1 };
    }).filter(function (x) { return x.name; });
    addItems(items, this);
  });
  $$('input[name="addMode"]').forEach(function (r) {
    r.addEventListener('change', function () { var one = r.value === 'one'; $('#formOne').hidden = !one; $('#formList').hidden = one; });
  });
  $('#gmFilter').addEventListener('change', function (e) { filter = e.target.value; renderList(); });
  $('#gmSearch').addEventListener('input', function () { search = this.value.trim().toLowerCase(); renderList(); });
  $('#btnBulkDel').addEventListener('click', function () { bulk('delete', Object.keys(selected).map(Number)); });
  $('#btnBulkGroup').addEventListener('click', function () { bulk('group', Object.keys(selected).map(Number), $('#gmBulkGroup').value); });
  $('#btnFamilyCopy').addEventListener('click', function () { copy(rep.familyLink).then(function () { toast(t('sCopied')); }); });
  $('#btnFamilyNew').addEventListener('click', function () {
    api('POST', '/invites/' + slug + '/family-key').then(function (j) { rep = j; render(); copy(rep.familyLink); toast(t('sCopied')); });
  });
  $('#btnCsv').addEventListener('click', function () {
    var qs = rep.questions;
    var head = [t('gName'), t('gGreeting'), t('gGroup'), t('gMax'), t('tYes'), t('tPeople')].concat(qs.map(function (x) { return x.text; })).concat([t('sLink')]);
    var rows = rep.guests.map(function (g) {
      return [g.name, g.greeting, g.group, g.max, g.answer === 'yes' ? t('aYes') : g.answer === 'no' ? t('aNo') : t('aPending'), g.people]
        .concat(qs.map(function (x) { return (g.answers || {})[x.id] || ''; })).concat([g.link]);
    }).concat(rep.general.map(function (r) {
      return [r.name, '', '', '', r.answer === 'yes' ? t('aYes') : t('aNo'), r.people].concat(qs.map(function (x) { return (r.answers || {})[x.id] || ''; })).concat(['']);
    }));
    var csv = [head].concat(rows).map(function (r) {
      return r.map(function (v) { var s = String(v == null ? '' : v); return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(';');
    }).join('\r\n');
    var a = el('a', { href: URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })), download: 'mehmonlar-' + slug + '.csv' });
    document.body.appendChild(a); a.click(); a.remove();
  });
  document.addEventListener('i18n', function () { if (rep) render(); });

  // ---------- load ----------
  if (tg) { tg.ready(); tg.expand(); }
  Promise.all([fetch('/api/config').then(function (r) { return r.json(); }), slug ? api('GET', '/invites/' + slug + '/guests') : Promise.reject(new Error('no_slug'))])
    .then(function (res) { cfg = res[0]; rep = res[1]; I18N.apply(); render(); })
    .catch(function () { I18N.apply(); $('#gmStatus').textContent = t('sNoAccess'); });
})();
