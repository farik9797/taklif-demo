/* Konstruktor: sayt va Telegram Mini App uchun bitta kod. ES2017. */
(function () {
  'use strict';
  var t = I18N.t;
  var $ = function (sel, r) { return (r || document).querySelector(sel); };
  var $$ = function (sel, r) { return Array.prototype.slice.call((r || document).querySelectorAll(sel)); };

  var tg = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData ? window.Telegram.WebApp : null;
  var cfg = null;
  var inv = { slug: '', key: '', status: 'draft', plan: 'start', data: { event: '', theme: '', lang: 'uz', petals: true, sparkles: true, rsvp: true } };
  var step = 1;
  var frameReady = false;
  var promoCode = '';
  var pollTimer = null;

  // ---------- storage ----------
  function mineLocal() {
    try { return JSON.parse(localStorage.getItem('taklif_mine') || '[]'); } catch (e) { return []; }
  }
  function remember(slug, key) {
    var list = mineLocal().filter(function (x) { return x.slug !== slug; });
    list.unshift({ slug: slug, key: key });
    try { localStorage.setItem('taklif_mine', JSON.stringify(list.slice(0, 50))); } catch (e) { /* ignore */ }
  }
  function lsGet(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }

  // ---------- api ----------
  function api(method, path, body) {
    var headers = { 'content-type': 'application/json' };
    if (inv.key) headers['x-edit-key'] = inv.key;
    if (tg) headers['x-tg-init'] = tg.initData;
    return fetch('/api' + path, { method: method, headers: headers, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok) { var e = new Error(j.error || r.status); e.code = j.error; throw e; }
          return j;
        });
      });
  }

  // ---------- helpers ----------
  function ev() { return cfg.events.filter(function (e) { return e.id === inv.data.event; })[0] || cfg.events[0]; }
  function L() { return I18N.lang; }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  function namesJoined(lang) { return [inv.data.name1, inv.data.name2].filter(Boolean).join(lang === 'ru' ? ' и ' : ' va '); }
  function defaultText(lang) { return ev().text[lang].replace('{names}', namesJoined(lang) || '…'); }
  function liveUrl() { return location.origin + '/i/' + inv.slug; }
  function setStatus(id, text, isError) {
    var n = document.getElementById(id);
    n.textContent = text || '';
    n.classList.toggle('is-error', Boolean(isError));
  }

  // ---------- autosave + preview ----------
  var saveT = null, previewT = null;
  function changed() {
    clearTimeout(previewT);
    previewT = setTimeout(pushPreview, 200);
    if (!inv.slug) return;
    setStatus('saveState', t('saving'));
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      save()
        .then(function () { setStatus('saveState', t('saved')); })
        .catch(function () { setStatus('saveState', t('errGeneric'), true); });
    }, 700);
  }
  function save() {
    return api('PUT', '/invites/' + inv.slug, { data: inv.data }).then(function (r) {
      if (r.slug && r.slug !== inv.slug) {
        var old = inv.slug;
        inv.slug = r.slug;
        var list = mineLocal().filter(function (x) { return x.slug !== old; });
        try { localStorage.setItem('taklif_mine', JSON.stringify(list)); } catch (e) { /* ignore */ }
        remember(inv.slug, inv.key);
        history.replaceState(null, '', (tg ? '/app' : '/create') + '?open=' + inv.slug);
      }
      return r;
    });
  }
  function pushPreview() {
    var f = $('#previewFrame');
    if (frameReady && f.contentWindow) f.contentWindow.postMessage({ type: 'taklif:data', data: inv.data }, location.origin);
  }
  function loadFrame() {
    if (!inv.slug) return;
    frameReady = false;
    $('#previewEmpty').hidden = true;
    $('#previewFrame').src = '/i/' + inv.slug + '?embed=1&k=' + encodeURIComponent(inv.key);
  }
  window.addEventListener('message', function (e) {
    if (e.origin === location.origin && e.data && e.data.type === 'taklif:ready') { frameReady = true; pushPreview(); }
  });

  // ---------- step 1: events ----------
  function renderEvents() {
    var box = $('#events');
    box.textContent = '';
    cfg.events.forEach(function (e) {
      var other = L() === 'ru' ? 'uz' : 'ru';
      var b = el('button', { type: 'button', role: 'radio', 'aria-checked': String(inv.data.event === e.id), class: 'event' });
      var head = el('span');
      head.appendChild(el('span', { class: 'event-name' }, e.title[L()]));
      head.appendChild(el('span', { class: 'event-alt small' }, e.title[other]));
      var sw = el('span', { class: 'event-sw', 'aria-hidden': 'true' });
      e.themes.forEach(function (id) {
        var th = cfg.themes.filter(function (x) { return x.id === id; })[0];
        if (!th) return;
        var dot = el('i');
        dot.style.setProperty('--sw-bg', th.bg);
        dot.style.setProperty('--sw-gold', th.gold);
        sw.appendChild(dot);
      });
      b.appendChild(head);
      b.appendChild(sw);
      b.addEventListener('click', function () { chooseEvent(e.id); });
      box.appendChild(b);
    });
  }
  function chooseEvent(id) {
    var prev = inv.data.event;
    inv.data.event = id;
    if (!inv.data.theme || prev !== id) inv.data.theme = ev().themes[0];
    renderEvents();
    if (!inv.slug) {
      api('POST', '/invites', { data: inv.data, ref: lsGet('taklif_ref'), from: lsGet('taklif_from') }).then(function (r) {
        inv.slug = r.slug; inv.key = r.key;
        remember(r.slug, r.key);
        history.replaceState(null, '', (tg ? '/app' : '/create') + '?open=' + r.slug);
        loadFrame();
        go(2);
      }).catch(function () { alert(t('errGeneric')); });
    } else {
      changed();
      go(2);
    }
  }

  // ---------- step 2: data ----------
  var formData = $('#formData');
  function fillDataForm() {
    var e = ev();
    $('#lblName1').textContent = e.name1[L()];
    $('#fieldName2').hidden = !e.pair;
    if (e.pair) $('#lblName2').textContent = e.name2[L()];
    ['name1', 'name2', 'date', 'time', 'venue', 'address', 'map', 'hosts', 'text_uz', 'text_ru', 'parents1', 'parents2', 'greeting', 'thanks'].forEach(function (k) {
      formData.elements[k].value = inv.data[k] || '';
    });
    $$('input[name="lang"]', formData).forEach(function (r) { r.checked = r.value === (inv.data.lang || 'uz'); });
    $('#lblP1').textContent = e.pair ? t('parents1') : t('parents');
    $('#fieldP2').hidden = !e.pair;
    syncTextFields();
    renderProgram();
  }

  // ---------- small list editors (programme, gift cards, own questions) ----------
  function rowEditor(box, items, fields, onChange) {
    box.textContent = '';
    items.forEach(function (item, i) {
      var row = el('div', { class: 'row-ed' });
      fields.forEach(function (f) {
        var input;
        if (f.options) {
          input = el('select', { 'aria-label': f.label || f.key });
          f.options.forEach(function (o) { var op = el('option', { value: o[0] }, o[1]); input.appendChild(op); });
        } else {
          input = el('input', { type: f.type || 'text', placeholder: f.ph || '', maxlength: String(f.max || 80), 'aria-label': f.label || f.ph || f.key, inputmode: f.inputmode || 'text' });
        }
        input.className = 'ed-' + f.key;
        input.value = item[f.key] || '';
        input.addEventListener('input', function () { item[f.key] = input.value; onChange(); });
        input.addEventListener('change', function () { item[f.key] = input.value; onChange(); });
        row.appendChild(input);
      });
      var rm = el('button', { type: 'button', class: 'row-rm', 'aria-label': t('remove') }, '×');
      rm.addEventListener('click', function () { items.splice(i, 1); rowEditor(box, items, fields, onChange); onChange(); });
      row.appendChild(rm);
      box.appendChild(row);
    });
  }
  function renderProgram() {
    if (!Array.isArray(inv.data.program)) inv.data.program = [];
    rowEditor($('#programList'), inv.data.program, [
      { key: 'time', type: 'time', label: t('time') },
      { key: 'title', ph: t('titlePh'), max: 80 }
    ], changed);
  }
  $('#btnAddProgram').addEventListener('click', function () {
    if (!Array.isArray(inv.data.program)) inv.data.program = [];
    if (inv.data.program.length >= 12) return;
    inv.data.program.push({ time: '', title: '' });
    renderProgram();
    var last = $$('#programList .ed-title').pop(); if (last) last.focus();
  });
  function syncTextFields() {
    var lang = inv.data.lang || 'uz';
    $('#fieldTextUz').hidden = lang === 'ru';
    $('#fieldTextRu').hidden = lang === 'uz';
    formData.elements.text_uz.placeholder = defaultText('uz');
    formData.elements.text_ru.placeholder = defaultText('ru');
  }
  formData.addEventListener('input', function (e) {
    var n = e.target.name;
    if (!n) return;
    inv.data[n] = e.target.value;
    if (n === 'lang' || n === 'name1' || n === 'name2') syncTextFields();
    changed();
  });
  formData.addEventListener('change', function (e) {
    if (e.target.name === 'lang') { inv.data.lang = e.target.value; syncTextFields(); changed(); }
  });
  $('#btnResetText').addEventListener('click', function () {
    inv.data.text_uz = ''; inv.data.text_ru = '';
    formData.elements.text_uz.value = ''; formData.elements.text_ru.value = '';
    changed();
  });

  // ---------- step 3: design ----------
  var formDesign = $('#formDesign');
  // Collections as live mini previews of the client's own event type.
  function renderThemes() {
    var fs = $('#themes');
    $$('.sw, input[name="theme"]', fs).forEach(function (n) { n.remove(); });
    cfg.themes.forEach(function (th) {
      var id = 'th-' + th.id;
      var input = el('input', { type: 'radio', name: 'theme', id: id, value: th.id });
      input.checked = inv.data.theme === th.id;
      var lab = el('label', { for: id, class: 'sw' });
      var frame = el('span', { class: 'sw-prev', 'aria-hidden': 'true' });
      var ifr = el('iframe', { tabindex: '-1', loading: 'lazy', title: th.name[L()], src: '/demo/' + th.id + '?event=' + encodeURIComponent(inv.data.event || 'toy') + '&card=1' });
      frame.appendChild(ifr);
      lab.appendChild(frame);
      lab.appendChild(el('span', { class: 'sw-name' }, th.name[L()]));
      fs.appendChild(input); fs.appendChild(lab);
    });
  }
  function fillDesignForm() {
    renderThemes();
    formDesign.elements.petals.checked = inv.data.petals !== false;
    formDesign.elements.sparkles.checked = inv.data.sparkles !== false;
    formDesign.elements.rsvp.checked = inv.data.rsvp !== false;
    formDesign.elements.wishes.checked = inv.data.wishes !== false;
    showUpload('music', isTrack(inv.data.music) ? '' : inv.data.music);
    renderTracks();
    showUpload('bg', inv.data.bg && inv.data.bg.url);
    renderGallery(); renderQuestions(); renderGifts();
  }
  formDesign.addEventListener('change', function (e) {
    var n = e.target.name;
    if (n === 'theme') inv.data.theme = e.target.value;
    else if (n === 'petals' || n === 'sparkles' || n === 'rsvp' || n === 'wishes') inv.data[n] = e.target.checked;
    else return;
    if (n === 'rsvp') $('#questionBox').hidden = !e.target.checked;
    changed();
  });

  // gallery
  function renderGallery() {
    var box = $('#galleryThumbs'); box.textContent = '';
    (inv.data.gallery || []).forEach(function (src, i) {
      var th = el('div', { class: 'thumb' });
      var im = el('img', { src: src, alt: '' });
      var rm = el('button', { type: 'button', class: 'row-rm', 'aria-label': t('remove') }, '×');
      rm.addEventListener('click', function () { inv.data.gallery.splice(i, 1); renderGallery(); changed(); });
      th.appendChild(im); th.appendChild(rm); box.appendChild(th);
    });
  }
  function uploadFile(file) {
    var fd = new FormData();
    fd.append('file', file);
    var headers = { 'x-edit-key': inv.key };
    if (tg) headers['x-tg-init'] = tg.initData;
    return fetch('/api/invites/' + inv.slug + '/upload', { method: 'POST', headers: headers, body: fd })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error); return j; }); });
  }
  $('#galleryInput').addEventListener('change', function () {
    var input = this;
    var files = Array.prototype.slice.call(input.files || []);
    if (!files.length || !inv.slug) return;
    if (!Array.isArray(inv.data.gallery)) inv.data.gallery = [];
    files = files.slice(0, 30 - inv.data.gallery.length);
    setStatus('uploadStatus', t('uploading'));
    files.reduce(function (p, f) {
      return p.then(function () {
        return uploadFile(f).then(function (j) { if (j.kind === 'image') { inv.data.gallery.push(j.url); renderGallery(); changed(); } });
      });
    }, Promise.resolve())
      .then(function () { setStatus('uploadStatus', ''); })
      .catch(function () { setStatus('uploadStatus', t('uploadErr'), true); })
      .then(function () { input.value = ''; });
  });

  // questions for the RSVP form: ready-made ones plus the couple's own
  function qLang() { return inv.data.lang === 'ru' ? 'ru' : 'uz'; }
  function renderQuestions() {
    if (!Array.isArray(inv.data.questions)) inv.data.questions = [];
    $('#questionBox').hidden = inv.data.rsvp === false;
    var pre = $('#qPresets'); pre.textContent = '';
    cfg.questions.forEach(function (q) {
      var on = inv.data.questions.some(function (x) { return x.id === q.id; });
      var lab = el('label', { class: 'qchip' });
      var cb = el('input', { type: 'checkbox' });
      cb.checked = on;
      cb.addEventListener('change', function () {
        inv.data.questions = inv.data.questions.filter(function (x) { return x.id !== q.id; });
        if (cb.checked) inv.data.questions.unshift({ id: q.id, type: q.type, text: q.text[qLang()] });
        renderQuestions(); changed();
      });
      lab.appendChild(cb); lab.appendChild(el('span', {}, q.text[L()]));
      pre.appendChild(lab);
    });
    var presetIds = cfg.questions.map(function (q) { return q.id; });
    var custom = inv.data.questions.filter(function (x) { return presetIds.indexOf(x.id) < 0; });
    rowEditor($('#qCustom'), custom, [
      { key: 'text', ph: t('questionPh'), max: 120 },
      { key: 'type', options: [['text', t('textAnswer')], ['yesno', t('yesno')]] }
    ], function () {
      inv.data.questions = inv.data.questions.filter(function (x) { return presetIds.indexOf(x.id) >= 0; }).concat(custom);
      changed();
    });
  }
  $('#btnAddQuestion').addEventListener('click', function () {
    if (!Array.isArray(inv.data.questions)) inv.data.questions = [];
    if (inv.data.questions.length >= 5) return;
    inv.data.questions.push({ id: 'c' + Date.now().toString(36).slice(-5), type: 'text', text: '' });
    renderQuestions();
    var last = $$('#qCustom .ed-text').pop(); if (last) last.focus();
  });

  // gift cards
  function renderGifts() {
    if (!Array.isArray(inv.data.gift)) inv.data.gift = [];
    rowEditor($('#giftList'), inv.data.gift, [
      { key: 'label', ph: t('cardLabelPh'), max: 60 },
      { key: 'number', ph: t('cardNumberPh'), max: 30, inputmode: 'numeric' }
    ], changed);
  }
  $('#btnAddGift').addEventListener('click', function () {
    if (!Array.isArray(inv.data.gift)) inv.data.gift = [];
    if (inv.data.gift.length >= 3) return;
    inv.data.gift.push({ label: '', number: '' });
    renderGifts();
  });
  function showUpload(kind, url) {
    $('#' + kind + 'Name').textContent = url ? url.split('/').pop() : '';
    $('[data-clear="' + kind + '"]').hidden = !url;
  }

  // ready music: tracks that suit this event come first, and each can be heard before choosing
  var trackSel = $('#trackSel'), trackPlay = $('#trackPlay'), trackAudio = null;
  function trackUrl(id) { return '/music/' + id + '.mp3'; }
  function isTrack(u) { return cfg.tracks.some(function (tr) { return trackUrl(tr.id) === u; }); }
  function stopPreview() {
    if (trackAudio) { trackAudio.pause(); trackAudio = null; }
    trackPlay.textContent = t('listen');
  }
  function renderTracks() {
    var ev = inv.data.event;
    var fits = cfg.tracks.filter(function (tr) { return tr.events.indexOf(ev) !== -1; });
    var rest = cfg.tracks.filter(function (tr) { return tr.events.indexOf(ev) === -1; });
    trackSel.textContent = '';
    trackSel.setAttribute('aria-label', t('trackPick'));
    trackSel.appendChild(el('option', { value: '' }, t('trackNone')));
    fits.concat(rest).forEach(function (tr) { trackSel.appendChild(el('option', { value: trackUrl(tr.id) }, tr.name[L()])); });
    trackSel.value = isTrack(inv.data.music) ? inv.data.music : '';
    trackPlay.hidden = !trackSel.value;
    stopPreview();
  }
  trackSel.addEventListener('change', function () {
    inv.data.music = trackSel.value;
    showUpload('music', '');
    trackPlay.hidden = !trackSel.value;
    stopPreview();
    changed();
  });
  trackPlay.addEventListener('click', function () {
    if (trackAudio) { stopPreview(); return; }
    trackAudio = new Audio(trackSel.value);
    trackAudio.addEventListener('ended', stopPreview);
    trackAudio.play().catch(stopPreview);
    trackPlay.textContent = t('stopListen');
  });
  $$('[data-upload]').forEach(function (input) {
    input.addEventListener('change', function () {
      var kind = input.getAttribute('data-upload');
      var file = input.files[0];
      if (!file || !inv.slug) return;
      setStatus('uploadStatus', t('uploading'));
      var fd = new FormData();
      fd.append('file', file);
      var headers = { 'x-edit-key': inv.key };
      if (tg) headers['x-tg-init'] = tg.initData;
      fetch('/api/invites/' + inv.slug + '/upload', { method: 'POST', headers: headers, body: fd })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error); return j; }); })
        .then(function (j) {
          if (kind === 'music') {
            if (j.kind !== 'audio') throw new Error('bad_type');
            inv.data.music = j.url;
            renderTracks();
          } else {
            if (j.kind !== 'image' && j.kind !== 'video') throw new Error('bad_type');
            inv.data.bg = { type: j.kind, url: j.url };
          }
          showUpload(kind, j.url);
          setStatus('uploadStatus', '');
          changed();
        })
        .catch(function () { setStatus('uploadStatus', t('uploadErr'), true); })
        .then(function () { input.value = ''; });
    });
  });
  $$('[data-clear]').forEach(function (b) {
    b.addEventListener('click', function () {
      var kind = b.getAttribute('data-clear');
      if (kind === 'music') { inv.data.music = ''; renderTracks(); } else inv.data.bg = null;
      showUpload(kind, '');
      changed();
    });
  });

  // ---------- step 4: pay / published ----------
  function plan() { var c = $('input[name="plan"]:checked'); return c ? c.value : 'premium'; }
  function refreshQuote() {
    $('#priceStart').textContent = I18N.fmt(cfg.prices.start) + ' ' + t('sum');
    $('#pricePremium').textContent = I18N.fmt(cfg.prices.premium) + ' ' + t('sum');
    $('#mediaWarn').hidden = !(plan() === 'start' && inv.data.bg);
    api('POST', '/quote', { plan: plan(), slug: inv.slug, promo: promoCode || lsGet('taklif_ref'), mine: mineLocal() }).then(function (r) {
      $('#total').textContent = I18N.fmt(r.amount) + ' ' + t('sum');
      $('#repeatNote').hidden = !r.repeat;
      if (r.repeat) $('#repeatNote').textContent = t('repeatNote').replace('{p}', r.repeat);
      if (promoCode) setStatus('promoStatus', r.promo ? t('promoOk') + ': −' + r.promo.percent + '%' : t('promoBad'), !r.promo);
    }).catch(function () {});
  }
  $('#plans').addEventListener('change', refreshQuote);
  $('#formPromo').addEventListener('submit', function (e) {
    e.preventDefault();
    promoCode = this.elements.promo.value.trim();
    refreshQuote();
  });

  function renderPayButtons() {
    var box = $('#payBtns');
    box.textContent = '';
    var p = cfg.providers;
    var list = [];
    if (tg && p.telegram) list.push(['telegram', t('payTg')]);
    if (p.payme) list.push(['payme', 'Payme']);
    if (p.click) list.push(['click', 'Click']);
    if (!tg && p.telegram) list.push(['telegram', t('payTg')]);
    if (p.test) list.push(['test', t('payTest')]);
    if (!list.length) { box.appendChild(el('p', { class: 'warn' }, t('noProviders'))); return; }
    list.forEach(function (it, i) {
      var b = el('button', { type: 'button', class: i ? 'btn btn--quiet' : 'btn' }, (i ? '' : t('pay') + ': ') + it[1]);
      b.addEventListener('click', function () { checkout(it[0], b); });
      box.appendChild(b);
    });
  }
  function checkout(provider, btn) {
    if (!inv.data.name1 || !inv.data.date) { setStatus('payStatus', t('need'), true); go(2); return; }
    btn.setAttribute('aria-busy', 'true'); btn.disabled = true;
    clearTimeout(saveT);
    save()
      .then(function () { return api('POST', '/invites/' + inv.slug + '/checkout', { plan: plan(), provider: provider, promo: promoCode || lsGet('taklif_ref'), mine: mineLocal() }); })
      .then(function (r) {
        if (r.done) return reload();
        if (r.redirect) { location.href = r.redirect; return; }
        if (r.invoice) {
          if (tg && tg.openInvoice) {
            tg.openInvoice(r.invoice, function (st) { if (st === 'paid' || st === 'pending') waitPaid(); });
          } else {
            window.open(r.invoice, '_blank', 'noopener');
            waitPaid();
          }
        }
      })
      .catch(function (e) { setStatus('payStatus', e.code === 'incomplete' ? t('need') : t('errGeneric'), true); })
      .then(function () { btn.removeAttribute('aria-busy'); btn.disabled = false; });
  }
  function waitPaid() {
    setStatus('payStatus', t('waiting'));
    clearInterval(pollTimer);
    var n = 0;
    pollTimer = setInterval(function () {
      if (++n > 100) { clearInterval(pollTimer); return; }
      api('GET', '/invites/' + inv.slug).then(function (r) {
        if (r.status === 'published' && (r.plan === plan() || r.plan === 'premium')) { clearInterval(pollTimer); reload(); }
      }).catch(function () {});
    }, 3000);
  }

  // draft → trial (3 days, live, guest cap) → published (paid, forever); expired trial waits for payment
  function fmtWhen(ms) {
    var d = new Date(ms);
    var p2 = function (n) { return String(n).padStart(2, '0'); };
    return p2(d.getDate()) + '.' + p2(d.getMonth() + 1) + ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes());
  }
  function renderDone() {
    var st = inv.status;
    var live = st === 'trial' || st === 'published';
    $('.preview-note').hidden = live;
    var pill = $('#statePill');
    pill.className = 'pill pill--' + st;
    var titles = { draft: 'stDraftT', trial: 'stTrialT', expired: 'stExpiredT', published: 'stLiveT' };
    var texts = { draft: 'stDraftX', trial: 'stTrialX', expired: 'stExpiredX', published: 'stLiveX' };
    pill.textContent = t(titles[st] || 'stDraftT');
    $('#stateTitle').textContent = '';
    $('#stateText').textContent = t(texts[st] || 'stDraftX').replace('{n}', inv.trialGuests || 20).replace('{date}', inv.trialUntil ? fmtWhen(inv.trialUntil) : '');
    var canTrial = st === 'draft' && !inv.trialUntil;
    $('#btnTrial').hidden = !canTrial;
    var meter = $('#trialMeter');
    meter.hidden = st !== 'trial';
    if (st === 'trial') {
      var total = (inv.trialDays || 3) * 864e5;
      var left = Math.max(0, inv.trialUntil - Date.now());
      $('#trialBar').style.width = Math.round(100 * left / total) + '%';
    }
    $('#shareBox').hidden = !live;
    $('#btnGuests').href = '/guests?slug=' + encodeURIComponent(inv.slug);
    if (live) {
      var url = liveUrl();
      var a = $('#liveLink'); a.href = url; a.textContent = url.replace(/^https?:\/\//, '');
      var msg = ev().title[inv.data.lang === 'ru' ? 'ru' : 'uz'] + ': ' + namesJoined(inv.data.lang === 'ru' ? 'ru' : 'uz');
      $('#shareTg').href = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(msg);
      $('#shareWa').href = 'https://wa.me/?text=' + encodeURIComponent(msg + '\n' + url);
      api('GET', '/invites/' + inv.slug + '/guests').then(function (g) {
        var s0 = g.stats;
        $('#guestsSummary').textContent = s0.total
          ? s0.total + ' · ' + s0.yes + ' ' + t('coming') + ' · ' + s0.people + ' ' + t('people')
          : t('manageGuestsHint');
      }).catch(function () {});
    }
    var paidPremium = st === 'published' && inv.plan === 'premium';
    $('#payBox').hidden = paidPremium;
    if (!paidPremium) {
      if (st === 'published') $('#pPremium').checked = true;
      renderPayButtons(); refreshQuote();
    }
  }
  $('#btnTrial').addEventListener('click', function () {
    var b = this;
    if (!inv.data.name1 || !inv.data.date) { setStatus('payStatus', t('need'), true); go(2); return; }
    b.setAttribute('aria-busy', 'true'); b.disabled = true;
    clearTimeout(saveT);
    save().then(function () { return api('POST', '/invites/' + inv.slug + '/trial'); })
      .then(function () { return reload(); })
      .catch(function (e) { setStatus('payStatus', e.code === 'trial_used' ? t('trialUsed') : t('errGeneric'), true); })
      .then(function () { b.removeAttribute('aria-busy'); b.disabled = false; });
  });
  $('#btnCopy').addEventListener('click', function () {
    var b = this;
    copy(liveUrl()).then(function () { b.textContent = t('copied'); setTimeout(function () { b.textContent = t('copy'); }, 1500); });
  });
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    var ta = el('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove();
    return Promise.resolve();
  }

  // ---------- navigation ----------
  function go(n) {
    if (n > 1 && !inv.slug) n = 1;
    if (n > 2 && step === 2 && (!inv.data.name1 || !inv.data.date)) {
      setStatus('saveState', t('need'), true);
      formData.elements[inv.data.name1 ? 'date' : 'name1'].focus();
      return;
    }
    step = n;
    $$('.pane').forEach(function (p) { p.hidden = Number(p.getAttribute('data-pane')) !== n; });
    $$('#steps button').forEach(function (b) {
      var s = Number(b.getAttribute('data-step'));
      if (s === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('done', s < n);
      b.disabled = s > 1 && !inv.slug;
    });
    $('.nav-row').hidden = n === 1;
    $('#btnBack').hidden = n === 1;
    $('#btnNext').hidden = n === 1 || n === 4;
    if (n === 2) fillDataForm();
    if (n === 3) fillDesignForm();
    if (n === 4) renderDone();
    var h = $('.pane[data-pane="' + n + '"] h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }
  $('#steps').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-step]');
    if (b && !b.disabled) go(Number(b.getAttribute('data-step')));
  });
  $('#btnBack').addEventListener('click', function () { go(step - 1); });
  $('#btnNext').addEventListener('click', function () { go(step + 1); });

  // mobile: editor / preview tabs
  function showPreview(on) {
    document.body.classList.toggle('show-preview', on);
    $('#tabEdit').setAttribute('aria-selected', String(!on));
    $('#tabPreview').setAttribute('aria-selected', String(on));
  }
  $('#tabEdit').addEventListener('click', function () { showPreview(false); });
  $('#tabPreview').addEventListener('click', function () { showPreview(true); });

  // ---------- my invitations ----------
  var sheet = $('#mineSheet');
  function openMine() {
    sheet.hidden = false;
    var ul = $('#mineList'); ul.textContent = '';
    api('POST', '/mine', { items: mineLocal() }).then(function (list) {
      if (!list.length) { ul.appendChild(el('li', { class: 'small' }, t('empty'))); return; }
      list.forEach(function (it) {
        var e = cfg.events.filter(function (x) { return x.id === it.data.event; })[0] || cfg.events[0];
        var li = el('li', { class: 'mine-item' });
        var info = el('div');
        info.appendChild(el('strong', {}, [it.data.name1, it.data.name2].filter(Boolean).join(' & ') || '—'));
        info.appendChild(el('span', { class: 'small' }, e.title[L()] + (it.data.date ? ', ' + it.data.date : '')));
        var st = el('span', { class: 'pill pill--' + it.status }, it.status === 'published' ? t('live') : it.status === 'blocked' ? t('blocked') : t('draft'));
        var b = el('button', { type: 'button', class: 'btn btn--quiet' }, t('edit'));
        b.addEventListener('click', function () { remember(it.slug, it.key); sheet.hidden = true; open(it.slug); });
        li.appendChild(info); li.appendChild(st); li.appendChild(b);
        ul.appendChild(li);
      });
    }).catch(function () { ul.appendChild(el('li', { class: 'small' }, t('errGeneric'))); });
  }
  $('#btnMine').addEventListener('click', openMine);
  $('#btnCloseMine').addEventListener('click', function () { sheet.hidden = true; });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') sheet.hidden = true; });
  $('#btnNew').addEventListener('click', function () { location.href = tg ? '/app' : '/create'; });

  // ---------- load ----------
  function open(slug) {
    var found = mineLocal().filter(function (x) { return x.slug === slug; })[0];
    inv.slug = slug; inv.key = found ? found.key : '';
    return api('GET', '/invites/' + slug).then(function (r) {
      inv.key = r.key; inv.status = r.status; inv.plan = r.plan; inv.data = r.data;
      inv.trialUntil = r.trialUntil; inv.trialDays = r.trialDays; inv.trialGuests = r.trialGuests;
      remember(slug, r.key);
      history.replaceState(null, '', (tg ? '/app' : '/create') + '?open=' + slug);
      renderEvents();
      loadFrame();
      go(r.status === 'draft' ? 2 : 4);
    }).catch(function () { inv.slug = ''; inv.key = ''; go(1); });
  }
  function reload() { return open(inv.slug); }

  document.addEventListener('i18n', function () {
    if (!cfg) return;
    renderEvents();
    if (step === 2) fillDataForm();
    if (step === 3) { renderThemes(); renderTracks(); }
    if (step === 4) renderDone();
  });

  if (tg) {
    tg.ready(); tg.expand();
    document.body.classList.add('in-tg');
    var sp = tg.initDataUnsafe && tg.initDataUnsafe.start_param;
    if (sp) try { localStorage.setItem('taklif_ref', sp); } catch (e) { /* ignore */ }
  }

  fetch('/api/config').then(function (r) { return r.json(); }).then(function (c) {
    cfg = c;
    document.querySelector('.wordmark').textContent = c.brand;
    I18N.apply();
    renderEvents();
    var q = new URLSearchParams(location.search);
    var m = location.pathname.match(/^\/edit\/([a-z0-9-]+)/);
    if (m && q.get('k')) { remember(m[1], q.get('k')); open(m[1]); return; }
    if (q.get('open')) { open(q.get('open')); return; }
    $('#previewEmpty').hidden = true;
    $('#previewFrame').src = '/demo/oltin?event=toy';
    // from the designs gallery: /create?event=toy&theme=anor starts with that event and collection
    var qe = q.get('event'), qt = q.get('theme');
    if (cfg.events.some(function (e) { return e.id === qe; })) {
      inv.data.event = qe;
      if (cfg.themes.some(function (x) { return x.id === qt; })) inv.data.theme = qt;
      chooseEvent(qe);
      return;
    }
    go(1);
    if (q.get('mine')) openMine();
  });
})();
