/* ══════════════════════════════════════════════════════════
   HECNERGY — main.js
   Loader, curtain reveal, scroll reveals, hero canvas particles,
   typewriter + gradient title, parallax media, counters, WhatsApp form.
════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA_PHONE = '52871476667';

  /* ── Footer year ─────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Loader + curtain reveal ─────────────────────────────── */
  const loader = document.getElementById('loader');
  const curtain = document.querySelector('.curtain');
  document.body.style.overflow = 'hidden';

  const MIN_LOAD_MS = reduceMotion ? 300 : 2200;
  const start = Date.now();

  function revealSite() {
    const elapsed = Date.now() - start;
    const wait = Math.max(MIN_LOAD_MS - elapsed, 0);
    setTimeout(() => {
      if (loader) loader.classList.add('loader-out');
      requestAnimationFrame(() => {
        if (curtain) curtain.classList.add('curtain-open');
      });
      document.body.style.overflow = '';
      setTimeout(() => {
        if (loader) loader.remove();
        if (curtain) curtain.classList.add('curtain-done');
      }, reduceMotion ? 200 : 1300);
    }, wait);
  }

  if (document.readyState === 'complete') revealSite();
  else window.addEventListener('load', revealSite);

  /* ── Navbar scroll state ─────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ── Mobile menu ─────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');
  function closeMobMenu() {
    hamburger.classList.remove('active');
    mobMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggleMobMenu() {
    const isOpen = mobMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', toggleMobMenu);
    mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobMenu(); });
  }

  /* ── Scroll reveal (IntersectionObserver) ───────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ── Marquee content ─────────────────────────────────────── */
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const items = [
      'Energía Limpia', 'Ahorro Hasta 90%', 'Financiamiento 12 a 96 Meses',
      'Instalación Certificada', 'Garantía en Equipo', 'Mantenimiento Incluido'
    ];
    const build = () => items.map(t => `<span class="marquee-item"><i class="fa-solid fa-sun"></i>${t}</span>`).join('');
    marquee.innerHTML = build() + build();
  }

  /* ── Particle fields (CSS-driven, per section) ──────────── */
  const palette = [
    'rgba(253,194,33,.8)',
    'rgba(63,167,70,.75)',
    'rgba(46,127,199,.7)'
  ];
  document.querySelectorAll('.particles-field').forEach(field => {
    const count = parseInt(field.dataset.count, 10) || 10;
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 2 + Math.random() * 5;
      const left = Math.random() * 100;
      const duration = 10 + Math.random() * 14;
      const delay = Math.random() * -20;
      const drift = (Math.random() * 60 - 30).toFixed(0) + 'px';
      const color = palette[i % palette.length];
      p.style.cssText = `
        left:${left}%; width:${size}px; height:${size}px;
        background:${color}; box-shadow:0 0 ${size * 2}px ${color};
        animation-duration:${duration}s; animation-delay:${delay}s;
        --drift:${drift};
      `;
      field.appendChild(p);
    }
  });

  /* ── Hero canvas particles ───────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let w, h, dpr, orbs = [], raf, running = true;
    const colors = ['253,194,33', '63,167,70', '46,127,199'];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeOrbs() {
      const count = w < 700 ? 16 : 30;
      orbs = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.08 - Math.random() * 0.18,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: 0.25 + Math.random() * 0.5
      }));
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.y < -10) { o.y = h + 10; o.x = Math.random() * w; }
        if (o.x < -10) o.x = w + 10;
        if (o.x > w + 10) o.x = -10;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 6);
        grad.addColorStop(0, `rgba(${o.c},${o.a})`);
        grad.addColorStop(1, `rgba(${o.c},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r * 6, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

    resize();
    makeOrbs();
    tick();
    window.addEventListener('resize', () => { resize(); makeOrbs(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(e => {
          running = e.isIntersecting;
          if (running) { cancelAnimationFrame(raf); tick(); }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ── Hero typewriter + color cycle ──────────────────────── */
  const twEl = document.getElementById('hero-typewriter');
  if (twEl && !reduceMotion) {
    const phrases = ['Tu ahorro.', 'Tu futuro.'];
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = ' ';

    let phraseIndex = 0;
    const TYPE_SPEED = 90, DELETE_SPEED = 55, HOLD_MS = 2200, START_DELAY = 2000;

    function typeText(text, i, cb) {
      twEl.textContent = text.slice(0, i);
      twEl.appendChild(cursor);
      if (i < text.length) setTimeout(() => typeText(text, i + 1, cb), TYPE_SPEED);
      else setTimeout(cb, HOLD_MS);
    }
    function deleteText(text, i, cb) {
      twEl.textContent = text.slice(0, i);
      twEl.appendChild(cursor);
      if (i > 0) setTimeout(() => deleteText(text, i - 1, cb), DELETE_SPEED);
      else setTimeout(cb, 250);
    }
    function loop() {
      const text = phrases[phraseIndex];
      typeText(text, 0, () => {
        deleteText(text, text.length, () => {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          loop();
        });
      });
    }
    setTimeout(loop, START_DELAY);
  }

  /* ── Parallax on background media ───────────────────────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    function updateParallax() {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const rect = el.parentElement.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) * 0.12;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ── Stats counters ──────────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length && 'IntersectionObserver' in window) {
    const countIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = reduceMotion ? 0 : 1500;
        const startTime = performance.now();
        function step(now) {
          const p = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    statNums.forEach(el => countIO.observe(el));
  }

  /* ── Contact form → WhatsApp ─────────────────────────────── */
  const waForm = document.getElementById('wa-form');
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const interest = document.getElementById('f-interest').value;
      const msg = document.getElementById('f-msg').value.trim();

      const text = `Hola HECNERGY, soy ${name}.\nMe interesa: ${interest}.${msg ? '\nDetalle: ' + msg : ''}`;
      const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

})();
