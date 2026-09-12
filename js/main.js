/* ==========================================================================
   Powr AS, Global Scripts
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky / blurred nav on scroll ---------- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile hamburger tray ---------- */
  const hamburger = document.querySelector('.hamburger');
  const tray = document.querySelector('.mobile-tray');
  const overlay = document.querySelector('.nav-overlay');

  function openTray() {
    hamburger.classList.add('active');
    tray.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('tray-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeTray() {
    hamburger.classList.remove('active');
    tray.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('tray-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      tray.classList.contains('active') ? closeTray() : openTray();
    });
  }
  if (overlay) overlay.addEventListener('click', closeTray);
  document.querySelectorAll('.mobile-tray .nav-links a, .mobile-tray-footer a').forEach(link => {
    link.addEventListener('click', closeTray);
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTray(); });

  /* ---------- Active nav link highlighting (homepage sections) ---------- */
  const navAnchors = document.querySelectorAll('.nav-links a[href*="#"]');
  const sections = [];
  navAnchors.forEach(a => {
    const hash = a.getAttribute('href').split('#')[1];
    if (hash) {
      const el = document.getElementById(hash);
      if (el) sections.push({ el, link: a });
    }
  });
  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const match = sections.find(s => s.el === entry.target);
        if (!match) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          document.querySelectorAll(`a[href*="#${entry.target.id}"]`).forEach(a => a.classList.add('active'));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s.el));
  }

  /* ---------- Reveal-on-scroll (and on-load for hero) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  // Force hero content to animate immediately on page load
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach(el => el.classList.add('is-visible'));
  });

  /* ---------- Portfolio filter (portfolio page) ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.p-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Contact / hero forms ---------- */
  document.querySelectorAll('form[data-quote-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successEl = form.parentElement.querySelector('.form-success');
      form.style.display = 'none';
      if (successEl) successEl.classList.add('show');
      form.reset();
    });
  });

});
