/* ═══════════════════════════════════════════════════
   MAISON LUMIÈRE — interactions
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────── Loader ───────── */
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('is-done'), 1400);
  });
  // safety fallback
  setTimeout(() => $('#loader') && $('#loader').classList.add('is-done'), 3500);

  /* ───────── Year ───────── */
  $('#year').textContent = new Date().getFullYear();

  /* ───────── Nav: stuck + mobile ───────── */
  const nav = $('#nav');
  const onScrollNav = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
  onScrollNav();

  const navToggle = $('#navToggle');
  const navLinks  = $('#navLinks');
  const closeMenu = () => {
    navToggle.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  navToggle.addEventListener('click', () => {
    const open = navToggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));

  /* ───────── Scroll progress + hero parallax + parallax els ───────── */
  const progress  = $('#progress');
  const heroSlidesWrap = $('#heroSlides');
  const heroCon   = $('.hero__content');
  const parallaxEls = $$('.parallax');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    // progress
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

    if (!prefersReduced) {
      // hero zoom + fade
      const vh = window.innerHeight;
      if (y < vh) {
        const p = y / vh;
        heroSlidesWrap.style.transform = `scale(${1.05 + p * 0.12})`;
        heroSlidesWrap.style.opacity = String(1 - p * 0.6);
        heroCon.style.transform = `translateY(${p * 60}px)`;
        heroCon.style.opacity = String(1 - p * 1.1);
      }
      // section parallax
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.1;
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          const offset = (rect.top - vh / 2) * -speed;
          el.style.transform = `translateY(${offset}px) scale(1.12)`;
        }
      });
    }
    ticking = false;
  }
  function requestScroll() {
    onScrollNav();
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ───────── Hero slideshow ───────── */
  const heroSlideEls = $$('.hero__slide');
  const heroDots = $('#heroDots');
  let heroIdx = 0, heroTimer = null;
  if (heroSlideEls.length > 1) {
    heroSlideEls.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Слайд ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', () => goHeroSlide(i, true));
      heroDots.appendChild(b);
    });
    const dotEls = $$('button', heroDots);

    function goHeroSlide(n, fromUser) {
      heroSlideEls[heroIdx].classList.remove('is-active');
      if (dotEls[heroIdx]) dotEls[heroIdx].classList.remove('is-active');
      heroIdx = (n + heroSlideEls.length) % heroSlideEls.length;
      heroSlideEls[heroIdx].classList.add('is-active');
      if (dotEls[heroIdx]) dotEls[heroIdx].classList.add('is-active');
      if (fromUser) startHeroTimer();
    }
    function startHeroTimer() {
      clearInterval(heroTimer);
      if (!prefersReduced) heroTimer = setInterval(() => goHeroSlide(heroIdx + 1), 5500);
    }
    startHeroTimer();
  }

  /* ───────── Reveal on scroll ───────── */
  const revealTargets = $$('.reveal, .reveal-line');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const group = $$('.reveal, .reveal-line', e.target.closest('section, header, footer, .about__grid') || document);
          const idx = group.indexOf(e.target);
          e.target.style.transitionDelay = Math.min(idx, 6) * 0.07 + 's';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(t => io.observe(t));
  } else {
    revealTargets.forEach(t => t.classList.add('is-in'));
  }

  // Generic "reveal children when they enter" for injected cards
  function observeCards(nodes) {
    if (!('IntersectionObserver' in window) || prefersReduced) {
      nodes.forEach(n => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = Number(e.target.dataset.idx || 0);
          e.target.style.transitionDelay = Math.min(idx, 5) * 0.08 + 's';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(n => io.observe(n));
  }

  /* ═══════════ MENU DATA ═══════════ */
  const IMG = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

  const MENU = {
    signature: [
      { name: 'Le Grand Voyage', price: '25 900 ₽', photo: 'Le Grand Voyage.jpeg',
        desc: 'Одиссея из девяти блюд сквозь сезон, собранная у стола и выстроенная как симфония.',
        ing: 'Сезонное · с рынка', wine: 'Полный винный сет', chef: true },
      { name: 'Золото осетра', price: '12 700 ₽', photo: 'Золото осетра.jpeg',
        desc: 'Икра осетра, тёплые блины, крем-фреш и лёгкий штрих чесночного масла.',
        ing: 'Осетра · гречка', wine: 'Blanc de Blancs' },
      { name: 'Трюфель и огонь', price: '8 700 ₽', photo: 'Трюфель и огонь.jpeg',
        desc: 'Тальолини ручной работы в масле, обильно присыпанные зимним чёрным трюфелем.',
        ing: 'Трюфель Перигор', wine: 'Выдержанное Бароло', chef: true },
    ],
    starters: [
      { name: 'Тарт с томатами реликтовых сортов', price: '2 900 ₽', img: '1540189549336-e6e99c3679fe',
        desc: 'Спелые на солнце томаты, взбитая рикотта, базиликовое масло на тончайшей галете.',
        ing: 'Реликтовый томат', wine: 'Розе из Прованса' },
      { name: 'Торшон из фуа-гра', price: '4 200 ₽', img: '1432139555190-58524dae6a55',
        desc: 'Шелковистый торшон, тост из бриоши, желе из сотерна и жареный фундук.',
        ing: 'Фуа-гра · сотерн', wine: 'Сотерн', chef: true },
      { name: 'Бурата и хурма', price: '3 100 ₽', img: '1505253716362-afaea1d3d1af',
        desc: 'Сливочная бурата, осенняя хурма, редукция саба и микробазилик.',
        ing: 'Бурата · хурма', wine: 'Soave Classico' },
    ],
    seafood: [
      { name: 'Гребешок дайвера', price: '5 300 ₽', img: '1519708227418-c8fd9a32b7a2',
        desc: 'Обжарен до карамельной корочки, велюте из цветной капусты, ореховое масло и каперсы.',
        ing: 'Гребешок дня', wine: 'Chablis 1er Cru', chef: true },
      { name: 'Лобстер в масле', price: '6 500 ₽', img: '1553247407-23251ce81f59',
        desc: 'Мэнский лобстер, нежно томлённый, ванильный бисквит, фенхель и цитрус.',
        ing: 'Мэнский лобстер', wine: 'Белое Бургундское' },
      { name: 'Тюрбо на кости', price: '6 000 ₽', img: '1544025162-d76694265947',
        desc: 'Запечён на кости, шампанское бёр-блан, морские травы и икра.',
        ing: 'Дикий тюрбо', wine: 'Meursault' },
    ],
    meat: [
      { name: 'Вагю сухой выдержки', price: '10 900 ₽', img: '1546241072-48010ad2862c',
        desc: 'Вагю A5, костный мозг, обугленный лук, соус на красном вине и копчёная соль.',
        ing: 'Вагю A5 · 45 дней', wine: 'Каберне из Напы', chef: true },
      { name: 'Ягнёнок в травяной корке', price: '7 100 ₽', img: '1558030006-450675393462',
        desc: 'Каре ягнёнка, дижонско-травяная корка, рататуй и розмариновый соус.',
        ing: 'Молочный ягнёнок', wine: 'Châteauneuf-du-Pape' },
      { name: 'Утка по-апельсиновому', price: '6 200 ₽', img: '1432139555190-58524dae6a55',
        desc: 'Запечённая утиная грудка, кровавый апельсин, глазированный эндивий и утиный соус.',
        ing: 'Утка барбари', wine: 'Пино Нуар' },
    ],
    vegetarian: [
      { name: 'Сад зимой', price: '4 900 ₽', img: '1512621776951-a57141f2eefd',
        desc: 'Запечённые корнеплоды, пюре из сельдерея, чёрный чеснок и жареные семена.',
        ing: 'Биодинамические корни', wine: 'Grüner Veltliner', chef: true },
      { name: 'Ризотто с лесными грибами', price: '4 200 ₽', img: '1476124369491-e7addf5db371',
        desc: 'Рис карнароли, лесные грибы, выдержанный пармезан и трюфельное масло.',
        ing: 'Лесные грибы', wine: 'Nebbiolo' },
      { name: 'Обугленная цветная капуста', price: '3 400 ₽', img: '1568584711075-3d021a7c3ca3',
        desc: 'Целиком запечённая капуста, тахини, гранат и дукка.',
        ing: 'Наследная капуста', wine: 'Chenin Blanc' },
    ],
    desserts: [
      { name: 'Суфле Grand Cru', price: '2 500 ₽', img: '1551024601-bec78aea704b',
        desc: 'Шоколадное суфле Valrhona, крем англез, поданный у стола.',
        ing: 'Valrhona 70%', wine: 'Винтажный портвейн', chef: true },
      { name: 'Тарт Татен', price: '2 100 ₽', img: '1488477181946-6428a0291777',
        desc: 'Карамелизованное яблоко, сливочное тесто, мороженое из крем-фреша.',
        ing: 'Садовое яблоко', wine: 'Ледяное вино' },
      { name: 'Эклер с золотом', price: '2 000 ₽', img: '1587314168485-3236d6710814',
        desc: 'Ванильный эклер кракелин, пралине из фундука и сусальное золото 24k.',
        ing: 'Таитянская ваниль', wine: 'Moscato d’Asti' },
    ],
    wines: [
      { name: 'Château Margaux', price: '61 000 ₽', img: '1510812431401-41d2bd2722f3', isWine: true,
        desc: 'Бордо первого гро-крю — кассис, фиалка и кедр, легенда в бокале.',
        ing: 'Бордо · 2015', wineTxt: 'Купаж каберне' },
      { name: 'Domaine Leflaive', price: '46 500 ₽', img: '1584916201218-f4242ceb4809', isWine: true,
        desc: 'Пюлиньи-Монраше — кремень, белые цветы и солоноватое послевкусие.',
        ing: 'Бургундия · 2018', wineTxt: 'Шардоне' },
      { name: 'Barolo Riserva', price: '30 500 ₽', img: '1516594915697-87eb3b1c14ea', isWine: true,
        desc: 'Неббиоло большой структуры — роза, дёготь и вяленая вишня.',
        ing: 'Пьемонт · 2013', wineTxt: 'Неббиоло' },
    ],
    champagne: [
      { name: 'Dom Pérignon', price: '37 500 ₽', img: '1550505095-81378a674395', isWine: true,
        desc: 'Винтажная кюве — бриошь, миндаль и тонкий стойкий перляж.',
        ing: 'Шампань · 2013', wineTxt: 'Шардоне · Пино' },
      { name: 'Krug Grande Cuvée', price: '41 000 ₽', img: '1594372685099-8f8f06b32e5a', isWine: true,
        desc: 'Гобелен из резервных вин — мёд, фундук и цитрусовая цедра.',
        ing: 'Мультивинтаж', wineTxt: 'Grande Cuvée' },
      { name: 'Salon Le Mesnil', price: '87 500 ₽', img: '1547595628-c61a29f496f0', isWine: true,
        desc: 'Blanc de Blancs редкой точности — мел, лимонное масло, вечность.',
        ing: 'Гран-крю · 2012', wineTxt: 'Blanc de Blancs', chef: true },
    ],
  };

  const menuGrid = $('#menuGrid');

  function dishCard(d, i) {
    const badge = d.chef ? `<span class="dish__badge">Выбор шефа</span>` : '';
    const secondRow = d.isWine
      ? `<div class="dish__meta-row"><span class="dish__meta-k">Сорт</span><span class="dish__meta-v">${d.wineTxt || ''}</span></div>`
      : `<div class="dish__meta-row"><span class="dish__meta-k">В паре с</span><span class="dish__meta-v">${d.wine || '—'}</span></div>`;
    return `
      <article class="dish ${d.isWine ? 'dish--wine' : ''}" data-idx="${i}">
        <div class="dish__media">
          ${badge}
          <div class="dish__img" style="background-image:url('${encodeURI((d.photo || (d.name + '.jpeg')).normalize('NFC'))}')"></div>
        </div>
        <div class="dish__body">
          <div class="dish__top">
            <h3 class="dish__name">${d.name}</h3>
            <span class="dish__price">${d.price}</span>
          </div>
          <p class="dish__desc">${d.desc}</p>
          <div class="dish__meta">
            <div class="dish__meta-row"><span class="dish__meta-k">${d.isWine ? 'Регион' : 'Сезон'}</span><span class="dish__meta-v">${d.ing}</span></div>
            ${secondRow}
          </div>
        </div>
      </article>`;
  }

  function renderMenu(cat) {
    const items = MENU[cat] || [];
    menuGrid.style.opacity = '0';
    setTimeout(() => {
      menuGrid.innerHTML = items.map(dishCard).join('');
      menuGrid.style.opacity = '1';
      observeCards($$('.dish', menuGrid));
    }, 180);
  }

  $$('.menu__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.menu__tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      renderMenu(tab.dataset.cat);
    });
  });
  menuGrid.style.transition = 'opacity .35s var(--ease)';
  renderMenu('signature');

  /* ═══════════ GALLERY ═══════════ */
  const GALLERY = [
    { id: '1414235077428-338989a2e8c0', cap: 'Обеденный зал' },
    { id: '1546241072-48010ad2862c',    cap: 'Огонь и дым' },
    { id: '1510812431401-41d2bd2722f3', cap: 'Погреб' },
    { id: '1517248135467-4c7edcad34c4', cap: 'При свечах' },
    { id: '1551218808-94e220e084d2',    cap: 'Первая подача' },
    { id: '1424847651672-bf20a4b0982b', cap: 'Барная стойка' },
    { id: '1592861956120-e524fc739696', cap: 'Вечерний сервис' },
    { id: '1414235077428-338989a2e8c0', cap: 'Отражения' },
  ];
  const galleryGrid = $('#galleryGrid');
  const gphoto = (g) => encodeURI((g.photo || (g.cap + '.jpeg')).normalize('NFC'));
  galleryGrid.innerHTML = GALLERY.map((g, i) => `
    <a class="gallery__item" data-idx="${i}" data-full="${gphoto(g)}" href="${gphoto(g)}" aria-label="${g.cap}">
      <img src="${gphoto(g)}" alt="${g.cap}" loading="lazy" />
      <span class="gallery__cap">${g.cap}</span>
    </a>`).join('');
  observeCards($$('.gallery__item', galleryGrid));

  /* ═══════════ LIGHTBOX ═══════════ */
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  let lbList = [], lbIdx = 0;
  function openLb(idx) {
    lbList = $$('.gallery__item').map(a => a.dataset.full);
    lbIdx = idx;
    lbImg.src = lbList[lbIdx];
    lb.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }
  function stepLb(dir) {
    lbIdx = (lbIdx + dir + lbList.length) % lbList.length;
    lbImg.style.opacity = '0';
    setTimeout(() => { lbImg.src = lbList[lbIdx]; lbImg.style.opacity = '1'; }, 180);
  }
  function closeLb() { lb.classList.remove('is-open'); document.body.classList.remove('no-scroll'); }

  galleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery__item');
    if (!item) return;
    e.preventDefault();
    openLb($$('.gallery__item').indexOf(item));
  });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbNext').addEventListener('click', () => stepLb(1));
  $('#lbPrev').addEventListener('click', () => stepLb(-1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  lbImg.style.transition = 'opacity .18s var(--ease)';
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') stepLb(1);
    if (e.key === 'ArrowLeft') stepLb(-1);
  });

  /* ═══════════ TESTIMONIALS ═══════════ */
  const VOICES = [
    { text: 'Один вечер, который переопределил само моё представление об ужине. Безупречно, неспешно, незабываемо.',
      name: 'Ариа Уитмор', role: 'Гид · Критик', ava: '1494790108377-be9c29b29330' },
    { text: 'Каждое блюдо приходило как фраза из прекрасной истории. Сомелье прочитал нас безошибочно.',
      name: 'Джулиан Рейес', role: 'Постоянный гость', ava: '1500648767791-00dcc994a43e' },
    { text: 'Тихая роскошь в чистейшем виде. Ничто не кричит, но всё поражает. Мы обязательно вернёмся.',
      name: 'София Лоран', role: 'Ужин на годовщину', ava: '1438761681033-6461ffad8d80' },
  ];
  const voicesGrid = $('#voicesGrid');
  voicesGrid.innerHTML = VOICES.map((v, i) => `
    <blockquote class="voice" data-idx="${i}">
      <div class="voice__quote">&laquo;</div>
      <div class="voice__stars">★ ★ ★ ★ ★</div>
      <p class="voice__text">${v.text}</p>
      <footer class="voice__by">
        <span class="voice__ava" style="background-image:url('${IMG(v.ava, 160)}')"></span>
        <span>
          <span class="voice__name">${v.name}</span><br />
          <span class="voice__role">${v.role}</span>
        </span>
      </footer>
    </blockquote>`).join('');
  observeCards($$('.voice', voicesGrid));

  /* ═══════════ RESERVATION FORM ═══════════ */
  const form = $('#reserveForm');
  const success = $('#reserveSuccess');
  const dateInput = $('#date');
  // min date = today
  dateInput.min = new Date().toISOString().split('T')[0];

  function validate() {
    let ok = true;
    $$('.field').forEach(f => f.classList.remove('is-err'));
    const required = [
      ['#name', v => v.trim().length > 1],
      ['#email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)],
      ['#date', v => !!v],
      ['#time', v => !!v],
      ['#guests', v => !!v],
    ];
    required.forEach(([sel, test]) => {
      const el = $(sel);
      if (!test(el.value)) { el.closest('.field').classList.add('is-err'); ok = false; }
    });
    return ok;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstErr = $('.field.is-err');
      if (firstErr) firstErr.querySelector('input, select').focus();
      return;
    }
    const name = $('#name').value.trim().split(' ')[0];
    const guests = $('#guests').value;
    const date = new Date($('#date').value + 'T00:00:00')
      .toLocaleDateString('ru-RU', { weekday: 'long', month: 'long', day: 'numeric' });
    $('#successMsg').textContent =
      `Спасибо, ${name}! Стол на ${guests} — ${date}, ${$('#time').value} — забронирован. Письмо с подтверждением уже летит на вашу почту.`;
    success.classList.add('is-shown');
  });

  $('#resetForm').addEventListener('click', () => {
    form.reset();
    success.classList.remove('is-shown');
    $$('.field').forEach(f => f.classList.remove('is-err'));
  });

  // live-clear errors
  form.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('is-err');
  });

  /* ═══════════ NEWSLETTER ═══════════ */
  const newsForm = $('#newsForm'), newsNote = $('#newsNote');
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsForm.querySelector('input');
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      newsNote.textContent = 'Добро пожаловать за наш стол. Ждите письмо.';
      input.value = '';
    } else {
      newsNote.textContent = 'Пожалуйста, введите корректный email.';
    }
  });

})();
