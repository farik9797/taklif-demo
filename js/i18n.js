/* Sayt va konstruktor matnlari (uz / ru). ES2017. */
(function () {
  'use strict';
  var T = {
    uz: {
      my: 'Taklifnomalarim', create: 'Taklifnoma yaratish', back: 'Orqaga', next: 'Davom etish', saved: 'Saqlandi', saving: 'Saqlanmoqda…',
      s1: 'Tadbir', s2: 'Ma’lumotlar', s3: 'Dizayn', s4: 'Ulashish',
      h1: 'Qanday tadbirga taklif qilasiz?',
      h2: 'Kim, qachon va qayerda',
      h3: 'Ko‘rinishi',
      h4: 'Ulashish va to‘lov',
      date: 'Sana', time: 'Vaqt', venue: 'To‘yxona yoki joy nomi', address: 'Manzil', map: 'Xarita havolasi (ixtiyoriy)',
      mapHint: 'Yandex yoki Google xaritadan “Ulashish” havolasi. Bo‘sh qolsa, manzil bo‘yicha qidiriladi.',
      hosts: 'Taklif qiluvchilar', hostsPh: 'Masalan: Karimovlar oilasi', lang: 'Taklifnoma tili',
      langUz: 'O‘zbekcha', langRu: 'Русский', langBoth: 'Ikkalasi',
      textUz: 'Taklif matni (o‘zbekcha)', textRu: 'Taklif matni (ruscha)', resetText: 'Standart matnni qaytarish',
      theme: 'Rang', effects: 'Effektlar', petals: 'Yaproqlar to‘kiladi', sparkles: 'Oltin uchqunlar',
      bg: 'Fon: o‘z rasmingiz yoki videongiz', bgHint: 'Vertikal 9:16, rasm yoki 5–15 soniyalik video (mp4). Masalan, SYNTX’da tayyorlangan.',
      music: 'Musiqa', musicHint: 'mp3 yoki m4a, 10 MB gacha. Mehmon taklifnomani ochganda yangraydi.',
      upload: 'Fayl tanlash', remove: 'O‘chirish', uploading: 'Yuklanmoqda…', uploadErr: 'Yuklab bo‘lmadi. Fayl turi yoki hajmini tekshiring.',
      rsvp: 'Mehmonlar javobi (kelaman / kelolmayman)', premiumOnly: 'Premium',
      planStart: 'Oddiy', planPremium: 'Premium',
      fStart: 'Har qanday rang va naqsh, animatsiya, taymer, xarita, musiqa',
      fPremium: 'Yana: o‘z rasm yoki video fon, mehmonlar javoblari ro‘yxati, har bir mehmonga ismli havola',
      promo: 'Promokod', apply: 'Qo‘llash', promoOk: 'Chegirma qo‘llandi', promoBad: 'Bunday promokod yo‘q',
      total: 'Jami', pay: 'To‘lash', payTg: 'Telegram orqali', payTest: 'Test to‘lov (pulsiz)',
      noProviders: 'To‘lov hali ulanmagan. Administrator bilan bog‘laning.',
      mediaWarn: 'Oddiy tarifda o‘z foningiz ko‘rinmaydi, faqat naqshli dizayn.',
      need: 'Avval ism va sanani kiriting.',
      waiting: 'To‘lov kutilmoqda. To‘lagandan keyin bu sahifa o‘zi yangilanadi.',
      published: 'Taklifnoma e’lon qilindi', link: 'Havola', copy: 'Nusxa olish', copied: 'Nusxa olindi',
      shareTg: 'Telegram’da yuborish', shareWa: 'WhatsApp’da yuborish', open: 'Ochish', edit: 'Tahrirlash',
      guestLinks: 'Mehmon uchun ismli havola', guestPh: 'Masalan: Aziz aka', make: 'Havola yasash',
      answers: 'Mehmonlar javoblari', noAnswers: 'Hali javob yo‘q.', coming: 'keladi', notComing: 'kela olmaydi', people: 'kishi',
      upgrade: 'Premium’ga o‘tish', draft: 'Qoralama', live: 'E’lon qilingan', blocked: 'Bloklangan',
      empty: 'Hali taklifnoma yo‘q.', newOne: 'Yangisini yaratish', views: 'ko‘rishlar',
      preview: 'Ko‘rinish', editTab: 'Tahrirlash', previewNote: 'To‘lovgacha “NAMUNA” belgisi bilan ko‘rinadi.',
      sum: 'so‘m', errGeneric: 'Xatolik yuz berdi. Qayta urinib ko‘ring.',
      parents1: 'Kuyovning ota-onasi', parents2: 'Kelinning ota-onasi', parents: 'Ota-onalar', parentsPh: 'Masalan: Karim aka va Nodira opa',
      greeting: 'Konvertdagi murojaat', greetingPh: 'Hurmatli', greetingHint: 'Mehmon ismi oldidan chiqadi: “Hurmatli Aziz aka!”. Har bir mehmonga alohida ham qo‘yish mumkin.',
      program: 'Tadbir dasturi', addRow: '+ Band qo‘shish', timePh: '18:00', titlePh: 'Masalan: Mehmonlarni kutib olish',
      thanks: 'Minnatdorchilik so‘zi', thanksPh: 'Taklifnoma oxirida chiqadi',
      gallery: 'Suratlar', galleryHint: '30 tagacha surat. Mehmon bosganda katta ochiladi.', addPhotos: 'Surat qo‘shish',
      questionsHint: 'Mehmonga qo‘shimcha savollar (javoblar ro‘yxatda ko‘rinadi):', addQuestion: '+ O‘z savolingiz', questionPh: 'Savol matni', yesno: 'Ha / Yo‘q', textAnswer: 'Matn',
      wishesT: 'Tilaklar kitobi (mehmonlar tilak qoldiradi)', giftT: 'Sovg‘a uchun kartalar', giftHint: 'Karta raqami va egasi. Mehmon bir bosishda nusxa oladi.',
      addCard: '+ Karta qo‘shish', cardLabelPh: 'Humo, Bobur K.', cardNumberPh: '9860 0000 0000 0000',
      startTrial: '3 kun bepul boshlash', manageGuests: 'Mehmonlar ro‘yxati', manageGuestsHint: 'Ismli havolalar, javoblar, statistika',
      payTitle: 'Abadiy saqlash uchun to‘lov',
      stDraftT: 'Qoralama', stDraftX: 'Faqat siz ko‘rasiz. 3 kunlik bepul sinovni boshlang: taklifnoma ishlaydi, {n} tagacha mehmon. Yoqsa, to‘lov qiling va u abadiy qoladi.',
      stTrialT: 'Bepul sinov', stTrialX: '{date} gacha ishlaydi, {n} tagacha mehmon. To‘lovdan keyin abadiy va cheklovsiz.',
      stExpiredT: 'Sinov muddati tugadi', stExpiredX: 'Mehmonlar endi taklifnomani ochmaydi. To‘lov qiling, u darhol qayta ishlaydi.',
      stLiveT: 'E’lon qilingan', stLiveX: 'Taklifnoma abadiy ishlaydi.',
      repeatNote: 'Ikkinchi taklifnoma: −{p}% chegirma qo‘llandi', trialUsed: 'Sinov muddati allaqachon ishlatilgan.'
    },
    ru: {
      my: 'Мои приглашения', create: 'Создать приглашение', back: 'Назад', next: 'Дальше', saved: 'Сохранено', saving: 'Сохраняем…',
      s1: 'Событие', s2: 'Данные', s3: 'Дизайн', s4: 'Отправка',
      h1: 'На какое событие приглашаете?',
      h2: 'Кто, когда и где',
      h3: 'Оформление',
      h4: 'Отправка и оплата',
      date: 'Дата', time: 'Время', venue: 'Тойхана или место', address: 'Адрес', map: 'Ссылка на карту (необязательно)',
      mapHint: 'Ссылка «Поделиться» из Яндекс или Google Карт. Если пусто — ищем по адресу.',
      hosts: 'Приглашающие', hostsPh: 'Например: семья Каримовых', lang: 'Язык приглашения',
      langUz: 'O‘zbekcha', langRu: 'Русский', langBoth: 'Оба',
      textUz: 'Текст приглашения (узбекский)', textRu: 'Текст приглашения (русский)', resetText: 'Вернуть стандартный текст',
      theme: 'Цвет', effects: 'Эффекты', petals: 'Падающие лепестки', sparkles: 'Золотые искры',
      bg: 'Фон: своё фото или видео', bgHint: 'Вертикально 9:16, фото или видео 5–15 секунд (mp4). Например, из SYNTX.',
      music: 'Музыка', musicHint: 'mp3 или m4a, до 10 МБ. Играет, когда гость открывает приглашение.',
      upload: 'Выбрать файл', remove: 'Удалить', uploading: 'Загружаем…', uploadErr: 'Не удалось загрузить. Проверьте тип и размер файла.',
      rsvp: 'Ответы гостей (приду / не приду)', premiumOnly: 'Premium',
      planStart: 'Обычный', planPremium: 'Premium',
      fStart: 'Любой цвет и узор, анимация, таймер, карта, музыка',
      fPremium: 'Плюс: свой фон фото или видео, список ответов гостей, именная ссылка каждому гостю',
      promo: 'Промокод', apply: 'Применить', promoOk: 'Скидка применена', promoBad: 'Такого промокода нет',
      total: 'Итого', pay: 'Оплатить', payTg: 'Через Telegram', payTest: 'Тестовая оплата (без денег)',
      noProviders: 'Оплата ещё не подключена. Свяжитесь с администратором.',
      mediaWarn: 'На тарифе «Обычный» свой фон не показывается, только узорный дизайн.',
      need: 'Сначала укажите имя и дату.',
      waiting: 'Ждём оплату. После оплаты страница обновится сама.',
      published: 'Приглашение опубликовано', link: 'Ссылка', copy: 'Копировать', copied: 'Скопировано',
      shareTg: 'Отправить в Telegram', shareWa: 'Отправить в WhatsApp', open: 'Открыть', edit: 'Редактировать',
      guestLinks: 'Именная ссылка для гостя', guestPh: 'Например: Азиз ака', make: 'Сделать ссылку',
      answers: 'Ответы гостей', noAnswers: 'Ответов пока нет.', coming: 'придёт', notComing: 'не сможет', people: 'чел.',
      upgrade: 'Перейти на Premium', draft: 'Черновик', live: 'Опубликовано', blocked: 'Заблокировано',
      empty: 'Приглашений пока нет.', newOne: 'Создать новое', views: 'просмотров',
      preview: 'Просмотр', editTab: 'Редактор', previewNote: 'До оплаты показывается с пометкой «ОБРАЗЕЦ».',
      sum: 'сум', errGeneric: 'Что-то пошло не так. Попробуйте ещё раз.',
      parents1: 'Родители жениха', parents2: 'Родители невесты', parents: 'Родители', parentsPh: 'Например: Карим ака и Нодира опа',
      greeting: 'Обращение на конверте', greetingPh: 'Дорогой', greetingHint: 'Стоит перед именем гостя: «Дорогой Азиз ака!». Можно задать отдельно каждому гостю.',
      program: 'Программа дня', addRow: '+ Добавить пункт', timePh: '18:00', titlePh: 'Например: Встреча гостей',
      thanks: 'Слова благодарности', thanksPh: 'Покажутся в конце приглашения',
      gallery: 'Фотографии', galleryHint: 'До 30 фото. Гость нажимает, и фото открывается на весь экран.', addPhotos: 'Добавить фото',
      questionsHint: 'Дополнительные вопросы гостю (ответы видны в списке):', addQuestion: '+ Свой вопрос', questionPh: 'Текст вопроса', yesno: 'Да / Нет', textAnswer: 'Текст',
      wishesT: 'Книга пожеланий (гости оставляют тёплые слова)', giftT: 'Карты для подарков', giftHint: 'Номер карты и владелец. Гость копирует в одно касание.',
      addCard: '+ Добавить карту', cardLabelPh: 'Humo, Бобур К.', cardNumberPh: '9860 0000 0000 0000',
      startTrial: 'Начать бесплатно на 3 дня', manageGuests: 'Список гостей', manageGuestsHint: 'Именные ссылки, ответы, статистика',
      payTitle: 'Оплата, чтобы приглашение осталось навсегда',
      stDraftT: 'Черновик', stDraftX: 'Видите только вы. Начните бесплатный пробный период на 3 дня: приглашение заработает, до {n} гостей. Понравится — оплатите, и оно останется навсегда.',
      stTrialT: 'Пробный период', stTrialX: 'Работает до {date}, до {n} гостей. После оплаты — навсегда и без ограничений.',
      stExpiredT: 'Пробный период закончился', stExpiredX: 'Гости больше не открывают приглашение. Оплатите, и оно сразу заработает снова.',
      stLiveT: 'Опубликовано', stLiveX: 'Приглашение работает навсегда.',
      repeatNote: 'Второе приглашение: скидка −{p}% применена', trialUsed: 'Пробный период уже был использован.'
    }
  };
  var KEY = 'taklif_ui_lang';
  function get() {
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
    if (v === 'uz' || v === 'ru') return v;
    return /^ru/.test(navigator.language || '') ? 'ru' : 'uz';
  }
  var I18N = {
    lang: get(),
    t: function (k) { return (T[I18N.lang] && T[I18N.lang][k]) || T.uz[k] || k; },
    set: function (l) { I18N.lang = l; try { localStorage.setItem(KEY, l); } catch (e) { /* ignore */ } I18N.apply(); },
    apply: function (rootEl) {
      var r = rootEl || document;
      document.documentElement.lang = I18N.lang;
      Array.prototype.forEach.call(r.querySelectorAll('[data-t]'), function (el) { el.textContent = I18N.t(el.getAttribute('data-t')); });
      Array.prototype.forEach.call(r.querySelectorAll('[data-tph]'), function (el) { el.setAttribute('placeholder', I18N.t(el.getAttribute('data-tph'))); });
      Array.prototype.forEach.call(r.querySelectorAll('[data-lang-btn]'), function (el) { el.setAttribute('aria-pressed', el.getAttribute('data-lang-btn') === I18N.lang ? 'true' : 'false'); });
      Array.prototype.forEach.call(r.querySelectorAll('[data-show-lang]'), function (el) { el.hidden = el.getAttribute('data-show-lang') !== I18N.lang; });
      document.dispatchEvent(new CustomEvent('i18n'));
    },
    extend: function (add) { Object.keys(add).forEach(function (l) { Object.assign(T[l], add[l]); }); },
    fmt: function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang-btn]');
    if (b) I18N.set(b.getAttribute('data-lang-btn'));
  });
  // ?ref= va ?from= ni eslab qolamiz (hamkor kodi va qaysi taklifnomadan kelgani)
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('ref')) localStorage.setItem('taklif_ref', q.get('ref'));
    if (q.get('from')) localStorage.setItem('taklif_from', q.get('from'));
  } catch (e) { /* ignore */ }
  window.I18N = I18N;
})();
