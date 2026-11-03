/* Taklifnoma sahifasi: mavzu, naqsh, animatsiya, taymer, musiqa, javob (RSVP).
   ES2017: eski telefon brauzerlari uchun ?. va ?? ishlatilmaydi. */
(function () {
  'use strict';
  var BOOT = window.__BOOT__ || {};
  var CAT = BOOT.catalog;
  var root = document.getElementById('root');
  var params = new URLSearchParams(location.search);
  var EMBED = params.get('embed') === '1';
  var CARD = params.get('card') === '1'; // first screen only, for galleries on the landing page
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers = [];
  var audio = null;
  var fx = null;

  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, kids) {
    var el = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { el.appendChild(c); });
    return el;
  }

  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return list[0]; }

  // ---------- suzani naqshlari (SVG) ----------
  function rosette(cx, cy, r, petals) {
    var g = s('g', { transform: 'translate(' + cx + ' ' + cy + ')', class: 'rosette' });
    var inner = s('g', { class: 'rosette-spin' });
    g.appendChild(inner);
    var i, a;
    for (i = 0; i < petals; i++) {
      a = 360 / petals * i;
      inner.appendChild(s('ellipse', { cx: 0, cy: -r * 0.62, rx: r * 0.2, ry: r * 0.38, transform: 'rotate(' + a + ')', class: 'p1' }));
    }
    for (i = 0; i < petals; i++) {
      a = 360 / petals * i + 180 / petals;
      inner.appendChild(s('ellipse', { cx: 0, cy: -r * 0.4, rx: r * 0.1, ry: r * 0.22, transform: 'rotate(' + a + ')', class: 'p2' }));
    }
    inner.appendChild(s('circle', { r: r * 0.24, class: 'c1' }));
    inner.appendChild(s('circle', { r: r * 0.12, class: 'c2' }));
    inner.appendChild(s('circle', { r: r * 0.98, class: 'ring' }));
    for (i = 0; i < petals * 2; i++) {
      a = (Math.PI * 2 / (petals * 2)) * i;
      inner.appendChild(s('circle', { cx: Math.cos(a) * r * 1.1, cy: Math.sin(a) * r * 1.1, r: r * 0.035, class: 'dot' }));
    }
    return g;
  }

  // Ogee arch around the text, plus corner rosettes. viewBox 400x711 (9:16).
  function ornament() {
    var svg = s('svg', { viewBox: '0 0 400 711', preserveAspectRatio: 'xMidYMid slice', class: 'orn', 'aria-hidden': 'true' });
    svg.appendChild(rosette(0, 0, 92, 12));
    svg.appendChild(rosette(400, 0, 92, 12));
    svg.appendChild(rosette(0, 711, 80, 10));
    svg.appendChild(rosette(400, 711, 80, 10));
    svg.appendChild(rosette(200, 92, 26, 8));
    var arch = 'M60 650 L60 250 C60 180 120 150 160 130 C185 118 195 104 200 84 C205 104 215 118 240 130 C280 150 340 180 340 250 L340 650 Z';
    svg.appendChild(s('path', { d: arch, class: 'arch' }));
    svg.appendChild(s('path', { d: arch, class: 'arch2', transform: 'translate(200 367) scale(0.94) translate(-200 -367)' }));
    for (var y = 270; y <= 630; y += 40) {
      svg.appendChild(s('circle', { cx: 60, cy: y, r: 2.4, class: 'dot' }));
      svg.appendChild(s('circle', { cx: 340, cy: y, r: 2.4, class: 'dot' }));
    }
    svg.appendChild(rosette(200, 660, 18, 8));
    return svg;
  }

  function divider() {
    return s('svg', { viewBox: '0 0 240 24', class: 'divider', 'aria-hidden': 'true' }, [
      s('path', { d: 'M0 12 H96', class: 'line' }), s('path', { d: 'M144 12 H240', class: 'line' }),
      s('path', { d: 'M120 2 L130 12 L120 22 L110 12 Z', class: 'gem' }),
      s('circle', { cx: 102, cy: 12, r: 2.5, class: 'dot' }), s('circle', { cx: 138, cy: 12, r: 2.5, class: 'dot' })
    ]);
  }

  // ---------- matnlar ----------
  function labels(lang) { return CAT.labels[lang === 'ru' ? 'ru' : 'uz']; }
  function L(d, key) {
    if (d.lang === 'both') return CAT.labels.uz[key] + ' / ' + CAT.labels.ru[key];
    return labels(d.lang)[key];
  }
  function namesJoined(d, lang) {
    return [d.name1, d.name2].filter(Boolean).join(lang === 'ru' ? ' и ' : ' va ');
  }
  function inviteText(d, ev, lang) {
    var t = d['text_' + lang] || ev.text[lang];
    return t.replace('{names}', namesJoined(d, lang));
  }
  function eventDate(d) {
    if (!d.date) return null;
    return new Date(d.date + 'T' + (d.time || '00:00') + ':00+05:00');
  }
  function fmtDate(d, lang) {
    if (!d.date) return '';
    var p = d.date.split('-').map(Number);
    var wd = new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
    if (lang === 'ru') return p[2] + ' ' + CAT.months.ru[p[1] - 1] + ' ' + p[0] + ', ' + CAT.weekdays.ru[wd];
    return p[2] + '-' + CAT.months.uz[p[1] - 1] + ', ' + p[0] + '-yil, ' + CAT.weekdays.uz[wd];
  }
  function langs(d) { return d.lang === 'both' ? ['uz', 'ru'] : [d.lang === 'ru' ? 'ru' : 'uz']; }

  // ---------- bo'limlar ----------
  function hero(d, ev, theme, guest) {
    var L1 = langs(d)[0];
    var media = null;
    if (d.bg && d.bg.type === 'video') {
      media = h('video', { class: 'bgmedia', src: d.bg.url, autoplay: true, muted: true, loop: true, playsinline: true, 'aria-hidden': 'true' });
      media.muted = true;
    } else if (d.bg && d.bg.type === 'image') {
      media = h('img', { class: 'bgmedia', src: d.bg.url, alt: '' });
    }
    var names;
    if (d.name2) {
      names = h('h1', { class: 'names rv' }, [
        h('span', { text: d.name1 }), h('span', { class: 'amp', text: '&' }), h('span', { text: d.name2 })
      ]);
    } else {
      names = h('h1', { class: 'names rv' }, [h('span', { text: d.name1 || '' })]);
    }
    return h('section', { class: 'hero' + (media ? ' has-media' : '') }, [
      media || h('div', { class: 'bgwash' }),
      media ? h('div', { class: 'scrim' }) : ornament(),
      h('div', { class: 'shimmer', 'aria-hidden': 'true' }),
      h('div', { class: 'hero-in' }, [
        guest ? h('p', { class: 'guest rv', text: guest }) : null,
        h('p', { class: 'kicker rv', text: langs(d).map(function (l) { return ev.title[l]; }).join(' / ') }),
        names,
        h('p', { class: 'hdate rv', text: fmtDate(d, L1) }),
        d.time ? h('p', { class: 'htime rv', text: d.time }) : null,
        d.venue ? h('p', { class: 'hplace rv', text: d.venue }) : null
      ]),
      h('div', { class: 'scroll-hint', 'aria-hidden': 'true' })
    ]);
  }

  function textBlock(d, ev) {
    return h('section', { class: 'block' }, [divider()].concat(langs(d).map(function (l, i) {
      return h('p', { class: i ? 'itext second' : 'itext', text: inviteText(d, ev, l) });
    })));
  }

  function countdown(d) {
    var target = eventDate(d);
    if (!target) return null;
    var lb = labels(d.lang === 'ru' ? 'ru' : 'uz');
    var cells = ['days', 'hours', 'mins', 'secs'].map(function (k) {
      var n = h('span', { class: 'cd-n', text: '0' });
      return { k: k, n: n, el: h('div', { class: 'cd-cell' }, [n, h('span', { class: 'cd-l', text: lb[k] })]) };
    });
    var grid = h('div', { class: 'cd' }, cells.map(function (c) { return c.el; }));
    var done = h('p', { class: 'cd-done', text: lb.started, hidden: true });
    function tick() {
      var ms = target.getTime() - Date.now();
      if (ms <= 0) { grid.hidden = true; done.hidden = false; return; }
      var v = { days: Math.floor(ms / 864e5), hours: Math.floor(ms / 36e5) % 24, mins: Math.floor(ms / 6e4) % 60, secs: Math.floor(ms / 1e3) % 60 };
      cells.forEach(function (c) { c.n.textContent = String(v[c.k]).padStart(c.k === 'days' ? 1 : 2, '0'); });
    }
    tick();
    timers.push(setInterval(tick, 1000));
    return h('section', { class: 'block' }, [
      divider(),
      h('h2', { class: 'bh', text: L(d, 'left') }),
      grid, done,
      h('div', { class: 'facts' }, [
        h('div', {}, [h('span', { class: 'fl', text: L(d, 'date') }), h('span', { class: 'fv', text: fmtDate(d, langs(d)[0]) })]),
        d.time ? h('div', {}, [h('span', { class: 'fl', text: L(d, 'time') }), h('span', { class: 'fv', text: d.time })]) : null
      ]),
      calendarButtons(d, target)
    ]);
  }

  function icsStamp(dt) { return dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function calendarButtons(d, start) {
    var ev = find(CAT.events, d.event);
    var title = ev.title[langs(d)[0]] + ': ' + [d.name1, d.name2].filter(Boolean).join(' & ');
    var end = new Date(start.getTime() + 4 * 36e5);
    var place = [d.venue, d.address].filter(Boolean).join(', ');
    var google = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
      '&dates=' + icsStamp(start) + '/' + icsStamp(end) + '&location=' + encodeURIComponent(place) + '&details=' + encodeURIComponent(location.href.split('?')[0]);
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Taklif//UZ', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@taklif',
      'DTSTAMP:' + icsStamp(new Date()), 'DTSTART:' + icsStamp(start), 'DTEND:' + icsStamp(end),
      'SUMMARY:' + title.replace(/[,;]/g, ' '), 'LOCATION:' + place.replace(/[,;]/g, ' '), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var lb = labels(langs(d)[0]);
    return h('div', { class: 'btns' }, [
      h('a', { class: 'ibtn ghost', href: google, target: '_blank', rel: 'noopener', text: 'Google ' + lb.calendar.toLowerCase() }),
      h('a', { class: 'ibtn ghost', href: 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics), download: 'taklifnoma.ics', text: 'Apple / iPhone' })
    ]);
  }

  function parentsBlock(d) {
    if (!d.parents1 && !d.parents2) return null;
    var ev = find(CAT.events, d.event);
    var rows = ev.pair
      ? [[L(d, 'parents1'), d.parents1], [L(d, 'parents2'), d.parents2]]
      : [[L(d, 'parents'), [d.parents1, d.parents2].filter(Boolean).join(', ')]];
    return h('section', { class: 'block' }, [divider(), h('div', { class: 'parents' }, rows.filter(function (r) { return r[1]; }).map(function (r) {
      return h('div', {}, [h('span', { class: 'fl', text: r[0] }), h('span', { class: 'pv', text: r[1] })]);
    }))]);
  }

  function programBlock(d) {
    if (!d.program || !d.program.length) return null;
    return h('section', { class: 'block' }, [divider(), h('h2', { class: 'bh', text: L(d, 'program') }),
      h('ol', { class: 'timeline' }, d.program.map(function (p) {
        return h('li', {}, [h('span', { class: 'tl-time', text: p.time || '' }), h('span', { class: 'tl-dot', 'aria-hidden': 'true' }), h('span', { class: 'tl-title', text: p.title })]);
      }))]);
  }

  function galleryBlock(d) {
    if (!d.gallery || !d.gallery.length) return null;
    var grid = h('div', { class: 'gallery' }, d.gallery.map(function (src, i) {
      return h('button', { type: 'button', class: 'g-item', 'aria-label': String(i + 1), onclick: function () { lightbox(d.gallery, i); } },
        [h('img', { src: src, alt: '', loading: 'lazy' })]);
    }));
    return h('section', { class: 'block' }, [divider(), h('h2', { class: 'bh', text: L(d, 'gallery') }), grid]);
  }
  function lightbox(list, start) {
    var i = start;
    var img = h('img', { alt: '' });
    var box = h('div', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true' }, [
      img,
      h('button', { type: 'button', class: 'lb-btn lb-prev', 'aria-label': '‹', text: '‹', onclick: function (e) { e.stopPropagation(); show(i - 1); } }),
      h('button', { type: 'button', class: 'lb-btn lb-next', 'aria-label': '›', text: '›', onclick: function (e) { e.stopPropagation(); show(i + 1); } }),
      h('button', { type: 'button', class: 'lb-btn lb-close', 'aria-label': '×', text: '×', onclick: close })
    ]);
    function show(n) { i = (n + list.length) % list.length; img.src = list[i]; }
    function close() { box.remove(); document.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); }
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', key);
    show(i);
    document.body.appendChild(box);
    box.querySelector('.lb-close').focus();
  }

  function giftBlock(d) {
    if (!d.gift || !d.gift.length) return null;
    var lb = labels(langs(d)[0]);
    return h('section', { class: 'block' }, [divider(), h('h2', { class: 'bh', text: L(d, 'gift') }), h('p', { class: 'small-note', text: lb.giftHint }),
      h('div', { class: 'gifts' }, d.gift.map(function (g) {
        var btn = h('button', { type: 'button', class: 'ibtn ghost', text: lb.copy });
        btn.addEventListener('click', function () {
          copyText(g.number.replace(/\s/g, ''));
          btn.textContent = lb.copied;
          setTimeout(function () { btn.textContent = lb.copy; }, 1600);
        });
        return h('div', { class: 'gift' }, [g.label ? h('span', { class: 'fl', text: g.label }) : null, h('span', { class: 'gift-num', text: g.number }), btn]);
      }))]);
  }
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(t).catch(function () {}); return; }
    var ta = h('textarea'); ta.value = t; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove();
  }

  function wishesBlock(d, slug, preview) {
    if (!d.wishes) return null;
    var lb = labels(langs(d)[0]);
    var list = h('ul', { class: 'wishes' });
    var empty = h('p', { class: 'small-note', text: lb.noWishes });
    function load() {
      if (preview || !slug) return;
      fetch('/api/invites/' + encodeURIComponent(slug) + '/wishes').then(function (r) { return r.ok ? r.json() : []; }).then(function (rows) {
        list.textContent = '';
        empty.hidden = rows.length > 0;
        rows.forEach(function (w) { list.appendChild(h('li', {}, [h('p', { class: 'w-text', text: w.text }), h('span', { class: 'fl', text: w.name })])); });
      }).catch(function () {});
    }
    var name = h('input', { class: 'inp', maxlength: '60', required: true, autocomplete: 'name' });
    var text = h('textarea', { class: 'inp ta', maxlength: '500', rows: '3', required: true });
    var status = h('p', { class: 'rsvp-status', role: 'status' });
    var form = h('form', { class: 'rsvp', onsubmit: function (e) {
      e.preventDefault();
      if (!name.value.trim() || !text.value.trim()) return;
      if (preview) { status.textContent = lb.wishThanks; return; }
      var b = form.querySelector('button'); b.disabled = true;
      fetch('/api/invites/' + encodeURIComponent(slug) + '/wishes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: name.value, text: text.value }) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); text.value = ''; status.textContent = lb.wishThanks; load(); })
        .catch(function () { status.textContent = d.lang === 'ru' ? 'Не удалось отправить.' : 'Yuborilmadi.'; })
        .then(function () { b.disabled = false; });
    } }, [
      h('label', {}, [h('span', { class: 'fl', text: lb.wishName }), name]),
      h('label', {}, [h('span', { class: 'fl', text: lb.wishText }), text]),
      h('div', { class: 'btns' }, [h('button', { class: 'ibtn', type: 'submit', text: lb.wishSend })])
    ]);
    load();
    return h('section', { class: 'block' }, [divider(), h('h2', { class: 'bh', text: L(d, 'wishes') }), list, empty, form, status]);
  }

  function thanksBlock(d) {
    if (!d.thanks) return null;
    return h('section', { class: 'block' }, [divider(), h('h2', { class: 'bh', text: L(d, 'thanks') }), h('p', { class: 'itext', text: d.thanks })]);
  }

  function venue(d) {
    if (!d.venue && !d.address) return null;
    var q = encodeURIComponent([d.venue, d.address].filter(Boolean).join(', '));
    var lb = labels(langs(d)[0]);
    var links = d.map
      ? [h('a', { class: 'ibtn', href: d.map, target: '_blank', rel: 'noopener', text: lb.route })]
      : [h('a', { class: 'ibtn', href: 'https://yandex.uz/maps/?text=' + q, target: '_blank', rel: 'noopener', text: 'Yandex Maps' }),
         h('a', { class: 'ibtn ghost', href: 'https://www.google.com/maps/search/?api=1&query=' + q, target: '_blank', rel: 'noopener', text: 'Google Maps' })];
    return h('section', { class: 'block' }, [
      divider(),
      h('h2', { class: 'bh', text: L(d, 'place') }),
      d.venue ? h('p', { class: 'venue', text: d.venue }) : null,
      d.address ? h('p', { class: 'addr', text: d.address }) : null,
      h('div', { class: 'btns' }, links)
    ]);
  }

  function hostsBlock(d) {
    if (!d.hosts) return null;
    return h('section', { class: 'block' }, [
      divider(),
      h('p', { class: 'fl', text: L(d, 'hosts') }),
      h('p', { class: 'hosts', text: d.hosts })
    ]);
  }

  // guest: personal invitation from /i/<slug>?t=<token> (name fixed, seats limited), or null for the shared link.
  function rsvpBlock(d, slug, preview, guest) {
    if (!d.rsvp) return null;
    var lb = labels(langs(d)[0]);
    var status = h('p', { class: 'rsvp-status', role: 'status' });
    var name = guest ? null : h('input', { class: 'inp', name: 'name', required: true, maxlength: '80', autocomplete: 'name' });
    var max = guest ? guest.max : 20;
    var count = h('input', { class: 'inp', name: 'people', type: 'number', min: '1', max: String(max), value: String(guest && guest.people ? guest.people : 1), inputmode: 'numeric' });
    var prev = guest && guest.answers ? guest.answers : {};
    var qs = (d.questions || []).map(function (q) {
      var input;
      if (q.type === 'yesno') {
        input = h('select', { class: 'inp' }, [h('option', { value: '', text: '—' }), h('option', { value: 'yes', text: lb.yesShort }), h('option', { value: 'no', text: lb.noShort })]);
      } else {
        input = h('input', { class: 'inp', maxlength: '200' });
      }
      if (prev[q.id]) input.value = prev[q.id];
      return { q: q, input: input, el: h('label', {}, [h('span', { class: 'fl', text: q.text }), input]) };
    });
    var form;
    var done = h('div', { class: 'rsvp-done', hidden: true }, [
      h('p', { text: lb.answered }),
      h('button', { type: 'button', class: 'ibtn ghost', text: lb.change, onclick: function () { done.hidden = true; form.hidden = false; } })
    ]);
    function send(answer) {
      return function (e) {
        e.preventDefault();
        if (name && !name.value.trim()) { name.focus(); return; }
        var answers = {};
        qs.forEach(function (x) { if (x.input.value) answers[x.q.id] = x.input.value; });
        if (preview) { status.textContent = lb.thanks; return; }
        var btns = form.querySelectorAll('button');
        Array.prototype.forEach.call(btns, function (b) { b.disabled = true; });
        fetch('/api/invites/' + encodeURIComponent(slug) + '/rsvp', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token: guest ? guest.token : '', name: name ? name.value : '', people: count.value, answer: answer, answers: answers })
        }).then(function (r) {
          return r.json().then(function (j) { if (!r.ok) { var er = new Error(j.error); er.code = j.error; throw er; } });
        }).then(function () {
          form.hidden = true;
          status.textContent = lb.thanks;
          if (guest) done.hidden = false;
        }).catch(function (er) {
          status.textContent = er.code === 'trial_limit' ? lb.limit : (d.lang === 'ru' ? 'Не удалось отправить, попробуйте ещё раз.' : 'Yuborilmadi, qayta urinib ko‘ring.');
        }).then(function () {
          Array.prototype.forEach.call(btns, function (b) { b.disabled = false; });
        });
      };
    }
    form = h('form', { class: 'rsvp', onsubmit: send('yes') }, [
      guest ? h('p', { class: 'rsvp-who', text: guest.name }) : h('label', {}, [h('span', { class: 'fl', text: lb.yourName }), name]),
      max > 1 ? h('label', {}, [h('span', { class: 'fl', text: lb.people + (guest ? ' (≤ ' + max + ')' : '') }), count]) : null
    ].concat(qs.map(function (x) { return x.el; })).concat([
      h('div', { class: 'btns' }, [
        h('button', { class: 'ibtn', type: 'submit', text: lb.yes }),
        h('button', { class: 'ibtn ghost', type: 'button', onclick: send('no'), text: lb.no })
      ])
    ]));
    if (guest && guest.answer) { form.hidden = true; done.hidden = false; }
    return h('section', { class: 'block' }, [divider(), h('h2', { class: 'bh', text: L(d, 'rsvpTitle') }), form, done, status]);
  }

  function footer(d) {
    var lb = labels(langs(d)[0]);
    return h('footer', { class: 'ifoot' }, [
      h('a', { href: BOOT.home || '/', target: '_blank', rel: 'noopener' }, [lb.made]),
      h('span', { text: BOOT.brand || '' })
    ]);
  }

  // ---------- effektlar: yaproqlar va uchqunlar ----------
  function startFx(d, theme) {
    if (reduceMotion || (!d.petals && !d.sparkles)) return null;
    var c = h('canvas', { class: 'fx', 'aria-hidden': 'true' });
    var ctx = c.getContext('2d');
    var W, H, dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() { W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; }
    size();
    addEventListener('resize', size);
    function onVis() {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); } else if (!running) { running = true; raf = requestAnimationFrame(frame); }
    }
    var parts = [];
    var i;
    if (d.petals) for (i = 0; i < 10; i++) parts.push(petal(true));
    if (d.sparkles) for (i = 0; i < 22; i++) parts.push(spark(true));
    function petal(init) {
      return { t: 'p', x: Math.random() * W, y: init ? Math.random() * H : -20 * dpr, s: (6 + Math.random() * 7) * dpr,
        vy: (0.25 + Math.random() * 0.45) * dpr, vx: (Math.random() - 0.5) * 0.3 * dpr, a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.03, ph: Math.random() * 6.28 };
    }
    function spark(init) {
      return { t: 's', x: Math.random() * W, y: Math.random() * H, s: (0.8 + Math.random() * 1.8) * dpr, ph: Math.random() * 6.28, vy: -(0.05 + Math.random() * 0.15) * dpr };
    }
    var running = true;
    var raf;
    function frame(ts) {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var k = 0; k < parts.length; k++) {
        var p = parts[k];
        if (p.t === 'p') {
          p.y += p.vy; p.x += p.vx + Math.sin(ts / 1400 + p.ph) * 0.35 * dpr; p.a += p.va;
          if (p.y > H + 30 * dpr) parts[k] = petal(false);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
          ctx.globalAlpha = 0.7; ctx.fillStyle = theme.petal;
          // teardrop petal with a notch, reads as a rose petal rather than a grain
          ctx.beginPath(); ctx.moveTo(0, -p.s);
          ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s);
          ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
          ctx.fill();
          ctx.restore();
        } else {
          p.y += p.vy; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
          ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(ts / 900 + p.ph));
          ctx.fillStyle = theme.gold;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', onVis);
    return {
      el: c,
      stop: function () {
        running = false; cancelAnimationFrame(raf);
        removeEventListener('resize', size); document.removeEventListener('visibilitychange', onVis);
        c.remove();
      }
    };
  }

  function musicButton(d) {
    if (!d.music) return null;
    audio = new Audio(d.music);
    audio.loop = true;
    var btn = h('button', { class: 'music', type: 'button', 'aria-label': labels(langs(d)[0]).music, 'aria-pressed': 'false' }, [
      s('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, [s('path', { d: 'M9 18V5l12-2v13', class: 'mi' }), s('circle', { cx: 6, cy: 18, r: 3, class: 'mi' }), s('circle', { cx: 18, cy: 16, r: 3, class: 'mi' })])
    ]);
    function sync() { btn.setAttribute('aria-pressed', audio.paused ? 'false' : 'true'); }
    btn.addEventListener('click', function () { if (audio.paused) audio.play().catch(function () {}); else audio.pause(); });
    audio.addEventListener('play', sync); audio.addEventListener('pause', sync);
    return btn;
  }

  function watermark(text) {
    var wm = h('div', { class: 'wm', 'aria-hidden': 'true' });
    for (var i = 0; i < 14; i++) wm.appendChild(h('span', { text: text }));
    return wm;
  }

  function intro(d, theme, onOpen, guestLine) {
    var initials = [d.name1, d.name2].filter(Boolean).map(function (n) { return n.trim().charAt(0); }).join(d.name2 ? '&' : '');
    var lb = labels(langs(d)[0]);
    var btn = h('button', { class: 'open-btn', type: 'button', text: lb.open });
    var ov = h('div', { class: 'intro' }, [
      h('div', { class: 'intro-card' }, [
        ornament(),
        guestLine ? h('p', { class: 'env-guest', text: guestLine }) : null,
        h('div', { class: 'seal', 'aria-hidden': 'true' }, [h('span', { text: initials })]),
        btn
      ])
    ]);
    btn.addEventListener('click', function () {
      ov.classList.add('gone');
      setTimeout(function () { ov.remove(); }, 900);
      onOpen();
    });
    setTimeout(function () { btn.focus(); }, 50);
    return ov;
  }

  // ---------- yig'ish ----------
  function render(inv, opts) {
    timers.forEach(clearInterval); timers = [];
    if (audio) { audio.pause(); audio = null; }
    root.textContent = '';
    if (inv.expired) {
      document.body.className = 'missing';
      root.appendChild(h('main', { class: 'missing-box' }, [
        h('p', { text: CAT.labels.uz.expired }), h('p', { text: CAT.labels.ru.expired }),
        h('p', { class: 'small-note', text: CAT.labels.uz.expiredHint })
      ]));
      return;
    }
    if (inv.missing) {
      document.body.className = 'missing';
      root.appendChild(h('main', { class: 'missing-box' }, [
        h('p', { text: CAT.labels.uz.notPublished }), h('p', { text: CAT.labels.ru.notPublished }),
        h('a', { class: 'ibtn', href: '/', text: CAT.labels.uz.made })
      ]));
      return;
    }
    var d = inv.data;
    var ev = find(CAT.events, d.event);
    var theme = find(CAT.themes, d.theme);
    var st = document.documentElement.style;
    st.setProperty('--bg', theme.bg); st.setProperty('--bg2', theme.bg2); st.setProperty('--ink', theme.ink);
    st.setProperty('--gold', theme.gold); st.setProperty('--petal', theme.petal);
    document.body.className = (theme.dark ? 'dark' : 'light') + ' t-' + theme.id + (EMBED ? ' embed' : '');
    document.documentElement.lang = d.lang === 'ru' ? 'ru' : 'uz';
    var lb0 = labels(langs(d)[0]);
    var guestObj = inv.guest || null;
    var guestName = guestObj ? guestObj.name : (inv.guestLinks ? (params.get('g') || '').slice(0, 60) : '');
    var guest = guestName ? ((guestObj && guestObj.greeting) || d.greeting || lb0.dear) + ' ' + guestName + '!' : '';

    if (CARD) {
      document.body.className += ' card opened';
      root.appendChild(h('main', { class: 'inv' }, [hero(d, ev, theme, guest)]));
      return;
    }
    var main = h('main', { class: 'inv' }, [
      hero(d, ev, theme, guest), textBlock(d, ev), parentsBlock(d), countdown(d), programBlock(d), venue(d), galleryBlock(d),
      rsvpBlock(d, inv.slug, inv.preview, guestObj), wishesBlock(d, inv.slug, inv.preview || EMBED), giftBlock(d), thanksBlock(d), hostsBlock(d), footer(d)
    ]);
    root.appendChild(main);
    if (fx) fx.stop();
    fx = startFx(d, theme);
    if (fx) document.body.appendChild(fx.el);
    var mb = musicButton(d);
    if (mb) root.appendChild(mb);
    if (inv.preview) root.appendChild(watermark(labels(langs(d)[0]).draft));

    function play() {
      document.body.classList.add('opened');
      if (audio) audio.play().catch(function () {});
    }
    if (opts && opts.skipIntro) play();
    else root.appendChild(intro(d, theme, play, guest));
  }

  if (!BOOT.invite) return;
  render(BOOT.invite, { skipIntro: EMBED || CARD });

  // Konstruktor ichidagi jonli ko'rinish: ma'lumotni postMessage orqali oladi.
  if (EMBED) {
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !e.data || e.data.type !== 'taklif:data') return;
      var inv = { slug: BOOT.invite.slug, preview: BOOT.invite.preview !== false, guestLinks: true, data: e.data.data };
      render(inv, { skipIntro: true });
    });
    if (window.parent !== window) window.parent.postMessage({ type: 'taklif:ready' }, location.origin);
  }
})();
