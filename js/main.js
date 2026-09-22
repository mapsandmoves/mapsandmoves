/* ==========================================================================
   Jagriti — site behaviour
   ========================================================================== */

/* ----- EDIT ME: your real links and details -------------------------------
   Every element with data-social="<key>" gets its href from here.
   Every element with data-handle="<key>" gets the handle text.
   ------------------------------------------------------------------------ */
const SITE = {
  email: 'hello@example.com',
  social: {
    instagram: { url: 'https://www.instagram.com/mapsandmoves?stkn=bm1lZGI2Mnp3YWh3', handle: '@mapsandmoves' },
    youtube:   { url: 'https://www.youtube.com/@mapsandmoves',  handle: '@mapsandmoves' },
    facebook:  { url: 'https://www.facebook.com/share/19iMddtNpa/?mibextid=wwXIfr',  handle: '@mapsandmoves' },
  },
};

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ----- Apply SITE config ----- */
  $$('[data-social]').forEach((el) => {
    const s = SITE.social[el.dataset.social];
    if (s) el.href = s.url;
  });
  $$('[data-handle]').forEach((el) => {
    const s = SITE.social[el.dataset.handle];
    if (s) el.textContent = s.handle;
  });
  $$('[data-mail]').forEach((el) => {
    el.href = `mailto:${SITE.email}?subject=${encodeURIComponent(el.dataset.mail)}`;
  });
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ----- Header: shadow on scroll + mobile menu ----- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('.menu-toggle');
  const nav = $('#site-nav');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 881px)').addEventListener('change', () => setMenu(false));

  /* ----- Count-up numbers ----- */
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion || Number.isNaN(target)) { el.textContent = target + suffix; return; }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ----- Scroll reveal ----- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        $$('[data-count]', entry.target).forEach(countUp);
        if (entry.target.matches('[data-count]')) countUp(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
    $$('[data-count]').forEach(countUp);
  }

  /* ----- Reels: arrow buttons scroll the track ----- */
  const track = $('.reel-track');
  $$('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = (track.querySelector('.reel')?.offsetWidth || 240) + 20;
      track.scrollBy({ left: Number(btn.dataset.scroll) * step * 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

})();
