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
  const heroImg   = $('#heroImg');
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
        heroImg.style.transform = `scale(${1.05 + p * 0.12})`;
        heroImg.style.opacity = String(1 - p * 0.6);
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
      { name: 'Le Grand Voyage', price: '$285', img: '1600891964599-f61ba0e24092',
        desc: 'A nine-course odyssey through the season, composed tableside and paced like a symphony.',
        ing: 'Seasonal · daily market', wine: 'Full pairing flight', chef: true },
      { name: 'Golden Osetra Service', price: '$140', img: '1607301405390-d831c242f59b',
        desc: 'Oscietra caviar, warm blini, crème fraîche and a whisper of chive oil.',
        ing: 'Oscietra · buckwheat', wine: 'Blanc de Blancs' },
      { name: 'Truffle & Fire', price: '$96', img: '1476124369491-e7addf5db371',
        desc: 'Hand-rolled tagliolini bathed in butter, showered with winter black truffle.',
        ing: 'Périgord truffle', wine: 'Aged Barolo', chef: true },
    ],
    starters: [
      { name: 'Heirloom Tomato Tart', price: '$32', img: '1540189549336-e6e99c3679fe',
        desc: 'Sun-ripened tomatoes, whipped ricotta, basil oil on a paper-thin galette.',
        ing: 'Heirloom tomato', wine: 'Provence Rosé' },
      { name: 'Foie Gras Torchon', price: '$46', img: '1432139555190-58524dae6a55',
        desc: 'Silken torchon, brioche toast, Sauternes gelée and toasted hazelnut.',
        ing: 'Foie gras · Sauternes', wine: 'Sauternes', chef: true },
      { name: 'Burrata & Persimmon', price: '$34', img: '1505253716362-afaea1d3d1af',
        desc: 'Creamy burrata, autumn persimmon, saba reduction and micro basil.',
        ing: 'Burrata · persimmon', wine: 'Soave Classico' },
    ],
    seafood: [
      { name: 'Diver Scallop', price: '$58', img: '1519708227418-c8fd9a32b7a2',
        desc: 'Seared to a caramel edge, cauliflower velouté, brown butter and capers.',
        ing: 'Day-boat scallop', wine: 'Chablis 1er Cru', chef: true },
      { name: 'Butter-Poached Lobster', price: '$72', img: '1553247407-23251ce81f59',
        desc: 'Maine lobster gently poached, vanilla bisque, fennel and citrus.',
        ing: 'Maine lobster', wine: 'White Burgundy' },
      { name: 'Line-Caught Turbot', price: '$66', img: '1544025162-d76694265947',
        desc: 'Roasted on the bone, champagne beurre blanc, sea herbs and caviar.',
        ing: 'Wild turbot', wine: 'Meursault' },
    ],
    meat: [
      { name: 'Dry-Aged Wagyu', price: '$120', img: '1546241072-48010ad2862c',
        desc: 'A5 Wagyu, bone marrow, charred allium, red wine jus and smoked salt.',
        ing: 'A5 Wagyu · 45-day', wine: 'Napa Cabernet', chef: true },
      { name: 'Herb-Crusted Lamb', price: '$78', img: '1558030006-450675393462',
        desc: 'Rack of lamb, Dijon-herb crust, ratatouille and rosemary jus.',
        ing: 'Milk-fed lamb', wine: 'Châteauneuf-du-Pape' },
      { name: 'Duck à l’Orange', price: '$68', img: '1432139555190-58524dae6a55',
        desc: 'Roasted duck breast, blood orange, glazed endive and duck reduction.',
        ing: 'Barbary duck', wine: 'Pinot Noir' },
    ],
    vegetarian: [
      { name: 'Garden in Winter', price: '$54', img: '1512621776951-a57141f2eefd',
        desc: 'Roasted roots, celeriac purée, black garlic and toasted seeds.',
        ing: 'Biodynamic roots', wine: 'Grüner Veltliner', chef: true },
      { name: 'Wild Mushroom Risotto', price: '$46', img: '1476124369491-e7addf5db371',
        desc: 'Carnaroli rice, forest mushrooms, aged parmesan and truffle oil.',
        ing: 'Forest mushroom', wine: 'Nebbiolo' },
      { name: 'Charred Cauliflower', price: '$38', img: '1568584711075-3d021a7c3ca3',
        desc: 'Whole-roasted cauliflower, tahini, pomegranate and dukkah.',
        ing: 'Heritage cauliflower', wine: 'Chenin Blanc' },
    ],
    desserts: [
      { name: 'Grand Cru Soufflé', price: '$28', img: '1551024601-bec78aea704b',
        desc: 'Valrhona chocolate soufflé, crème anglaise poured tableside.',
        ing: 'Valrhona 70%', wine: 'Vintage Port', chef: true },
      { name: 'Tarte Tatin', price: '$24', img: '1488477181946-6428a0291777',
        desc: 'Caramelised apple, buttery pastry, crème fraîche ice cream.',
        ing: 'Orchard apple', wine: 'Ice Wine' },
      { name: 'Gold Leaf Éclair', price: '$22', img: '1587314168485-3236d6710814',
        desc: 'Vanilla craquelin éclair, hazelnut praline and 24k gold leaf.',
        ing: 'Tahitian vanilla', wine: 'Moscato d’Asti' },
    ],
    wines: [
      { name: 'Château Margaux', price: '$680', img: '1510812431401-41d2bd2722f3', isWine: true,
        desc: 'First-growth Bordeaux — cassis, violet and cedar, a legend in the glass.',
        ing: 'Bordeaux · 2015', wineTxt: 'Cabernet blend' },
      { name: 'Domaine Leflaive', price: '$520', img: '1584916201218-f4242ceb4809', isWine: true,
        desc: 'Puligny-Montrachet — flint, white flowers and a saline finish.',
        ing: 'Burgundy · 2018', wineTxt: 'Chardonnay' },
      { name: 'Barolo Riserva', price: '$340', img: '1516594915697-87eb3b1c14ea', isWine: true,
        desc: 'Nebbiolo of great structure — rose, tar and dried cherry.',
        ing: 'Piedmont · 2013', wineTxt: 'Nebbiolo' },
    ],
    champagne: [
      { name: 'Dom Pérignon', price: '$420', img: '1550505095-81378a674395', isWine: true,
        desc: 'Vintage cuvée — brioche, almond and a fine, persistent bead.',
        ing: 'Champagne · 2013', wineTxt: 'Chardonnay · Pinot' },
      { name: 'Krug Grande Cuvée', price: '$460', img: '1594372685099-8f8f06b32e5a', isWine: true,
        desc: 'A tapestry of reserve wines — honey, hazelnut and citrus zest.',
        ing: 'Multi-vintage', wineTxt: 'Grande Cuvée' },
      { name: 'Salon Le Mesnil', price: '$980', img: '1547595628-c61a29f496f0', isWine: true,
        desc: 'Blanc de Blancs of rare precision — chalk, lemon oil, eternity.',
        ing: 'Grand Cru · 2012', wineTxt: 'Blanc de Blancs', chef: true },
    ],
  };

  const menuGrid = $('#menuGrid');

  function dishCard(d, i) {
    const badge = d.chef ? `<span class="dish__badge">Chef's Recommendation</span>` : '';
    const secondRow = d.isWine
      ? `<div class="dish__meta-row"><span class="dish__meta-k">Grape</span><span class="dish__meta-v">${d.wineTxt || ''}</span></div>`
      : `<div class="dish__meta-row"><span class="dish__meta-k">Pairing</span><span class="dish__meta-v">${d.wine || '—'}</span></div>`;
    return `
      <article class="dish ${d.isWine ? 'dish--wine' : ''}" data-idx="${i}">
        <div class="dish__media">
          ${badge}
          <div class="dish__img" style="background-image:url('${IMG(d.img)}')"></div>
        </div>
        <div class="dish__body">
          <div class="dish__top">
            <h3 class="dish__name">${d.name}</h3>
            <span class="dish__price">${d.price}</span>
          </div>
          <p class="dish__desc">${d.desc}</p>
          <div class="dish__meta">
            <div class="dish__meta-row"><span class="dish__meta-k">${d.isWine ? 'Region' : 'Season'}</span><span class="dish__meta-v">${d.ing}</span></div>
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
    { id: '1414235077428-338989a2e8c0', cap: 'The dining room' },
    { id: '1600891964092-4316c288032e', cap: 'On the pass' },
    { id: '1546241072-48010ad2862c',    cap: 'Fire & smoke' },
    { id: '1510812431401-41d2bd2722f3', cap: 'The cellar' },
    { id: '1517248135467-4c7edcad34c4', cap: 'Candlelight' },
    { id: '1551218808-94e220e084d2',    cap: 'First course' },
    { id: '1424847651672-bf20a4b0982b', cap: 'The bar' },
    { id: '1592861956120-e524fc739696', cap: 'Evening service' },
    { id: '1414235077428-338989a2e8c0', cap: 'Reflections' },
  ];
  const galleryGrid = $('#galleryGrid');
  galleryGrid.innerHTML = GALLERY.map((g, i) => `
    <a class="gallery__item" data-idx="${i}" data-full="${IMG(g.id, 1400)}" href="${IMG(g.id, 1400)}" aria-label="${g.cap}">
      <img src="${IMG(g.id, 700)}" alt="${g.cap}" loading="lazy" />
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
    { text: 'A single evening that reset my definition of what dinner could be. Flawless, unhurried, unforgettable.',
      name: 'Aria Whitmore', role: 'Le Guide · Critic', ava: '1494790108377-be9c29b29330' },
    { text: 'Every plate arrived like a sentence in a beautiful story. The sommelier read us perfectly.',
      name: 'Julian Reyes', role: 'Regular guest', ava: '1500648767791-00dcc994a43e' },
    { text: 'Quiet luxury in its truest form. Nothing shouts, yet everything astonishes. We will return.',
      name: 'Sofia Laurent', role: 'Anniversary dinner', ava: '1438761681033-6461ffad8d80' },
  ];
  const voicesGrid = $('#voicesGrid');
  voicesGrid.innerHTML = VOICES.map((v, i) => `
    <blockquote class="voice" data-idx="${i}">
      <div class="voice__quote">&ldquo;</div>
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
      .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    $('#successMsg').textContent =
      `Thank you, ${name}. A table for ${guests.toLowerCase()} on ${date} at ${$('#time').value} is confirmed. A note is on its way to your inbox.`;
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
      newsNote.textContent = 'Welcome to the table. Watch your inbox.';
      input.value = '';
    } else {
      newsNote.textContent = 'Please enter a valid email.';
    }
  });

})();
