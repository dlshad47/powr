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
  // Leads are delivered by FormSubmit (https://formsubmit.co) - no account, no
  // API key. Change the address below and the mail simply goes somewhere else.
  // The very first submission triggers a one-time confirmation e-mail that must
  // be clicked before deliveries start.
  const LEAD_EMAIL = 'dlshad282930@gmail.com';

  document.querySelectorAll('form[data-quote-form]').forEach(form => {
    const successEl = form.parentElement.querySelector('.form-success');
    const errorEl = form.querySelector('.form-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnLabel = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorEl) errorEl.classList.remove('show');

      const data = new FormData(form);
      data.append('_subject', 'Ny tilbudsforespørsel fra powr.no');
      data.append('_template', 'table');
      data.append('_captcha', 'false');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sender ...';
      }

      try {
        const res = await fetch('https://formsubmit.co/ajax/' + LEAD_EMAIL, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        const out = await res.json();
        if (!res.ok || out.success === 'false' || out.success === false) {
          throw new Error(out.message || 'Innsending feilet');
        }

        form.style.display = 'none';
        if (successEl) successEl.classList.add('show');
        form.reset();
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'Beklager, skjemaet kunne ikke sendes. Ring oss på 94 24 80 00 eller send e-post til post@powr.no.';
          errorEl.classList.add('show');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = btnLabel;
        }
      }
    });
  });

});
