/* ============================================
   Car Maintenance Center — Main JS
   ============================================ */
(function () {
  'use strict';

  /* ---------- Theme Toggle ---------- */
  const html = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) html.setAttribute('data-theme', stored);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });

  /* ---------- Sticky Navbar ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll Animations (IntersectionObserver) ---------- */
  const animEls = document.querySelectorAll('.animate-on-scroll, .animate-fade-left, .animate-fade-right, .animate-scale');
  if (animEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    animEls.forEach(el => io.observe(el));
  }

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- Testimonials Carousel ---------- */
  const track = document.querySelector('.testimonials-track');
  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let index = 0;
    let perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;

    function maxIndex() { return Math.max(cards.length - perView, 0); }
    function slide() {
      const pct = (100 / perView) * index;
      track.style.transform = 'translateX(-' + pct + '%)';
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function next() { index = index >= maxIndex() ? 0 : index + 1; slide(); }
    function prev() { index = index <= 0 ? maxIndex() : index - 1; slide(); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    dots.forEach((d, i) => d.addEventListener('click', () => { index = i; slide(); }));

    let autoplay = setInterval(next, 5000);
    track.closest('.testimonials-wrapper')?.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.closest('.testimonials-wrapper')?.addEventListener('mouseleave', () => { autoplay = setInterval(next, 5000); });

    window.addEventListener('resize', () => {
      perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      index = Math.min(index, maxIndex());
      slide();
    });
    slide();
  }

  /* ---------- Service Category Filter ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const serviceCards = document.querySelectorAll('.service-card-item');
  if (filterTabs.length && serviceCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.category;
        serviceCards.forEach(c => {
          c.style.display = (cat === 'all' || c.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Service Detail Population ---------- */
  const serviceData = {
    engine: { title: 'Engine Repair & Overhaul', desc: 'Complete engine diagnostics, repair, and rebuilding services using state-of-the-art equipment and genuine parts.', benefits: ['Full engine diagnostics', 'Timing belt replacement', 'Head gasket repair', 'Engine rebuilding', 'Performance tuning', 'Turbo repair'] },
    electrical: { title: 'Electrical Systems', desc: 'Advanced electrical system diagnostics and repair including wiring, alternators, starters, and ECU programming.', benefits: ['Battery testing & replacement', 'Alternator repair', 'Starter motor service', 'ECU diagnostics', 'Wiring harness repair', 'Lighting systems'] },
    diagnostics: { title: 'Computer Diagnostics', desc: 'Advanced OBD-II scanning and computer diagnostics to identify and resolve check engine lights and performance issues.', benefits: ['OBD-II scanning', 'Live data analysis', 'Fault code clearing', 'Sensor testing', 'Emission testing', 'Performance monitoring'] },
    oil: { title: 'Oil Change & Fluids', desc: 'Premium oil change service using top-grade synthetic oils and comprehensive fluid inspection and replacement.', benefits: ['Synthetic oil change', 'Oil filter replacement', 'Coolant flush', 'Brake fluid service', 'Transmission fluid', 'Power steering fluid'] },
    tires: { title: 'Tires & Alignment', desc: 'Professional tire service including mounting, balancing, rotation, and precision wheel alignment.', benefits: ['Tire mounting', 'Wheel balancing', 'Tire rotation', 'Wheel alignment', 'Tire pressure monitoring', 'Flat tire repair'] },
    ac: { title: 'AC & Climate Control', desc: 'Complete air conditioning service from recharging to compressor replacement, keeping you comfortable year-round.', benefits: ['AC recharge', 'Compressor repair', 'Condenser service', 'Cabin filter replacement', 'Leak detection', 'Climate control repair'] }
  };

  const params = new URLSearchParams(window.location.search);
  const svc = params.get('service');
  if (svc && serviceData[svc]) {
    const data = serviceData[svc];
    const titleEl = document.getElementById('service-title');
    const descEl = document.getElementById('service-desc');
    const benefitsList = document.getElementById('service-benefits');
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (benefitsList) {
      benefitsList.innerHTML = data.benefits.map(b =>
        '<div class="benefit-item animate-on-scroll"><div class="benefit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span class="benefit-text">' + b + '</span></div>'
      ).join('');
      benefitsList.querySelectorAll('.animate-on-scroll').forEach(el => {
        const io2 = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io2.unobserve(e.target); } }); }, { threshold: 0.15 });
        io2.observe(el);
      });
    }
  }

  /* ---------- Booking Modal ---------- */
  const modalOverlay = document.getElementById('booking-modal');
  if (modalOverlay) {
    const openBtns = document.querySelectorAll('[data-open-booking]');
    const closeBtn = modalOverlay.querySelector('.modal-close');
    const form = modalOverlay.querySelector('#booking-form');
    const formBody = modalOverlay.querySelector('.modal-form-body');
    const successEl = modalOverlay.querySelector('.success-state');

    openBtns.forEach(b => b.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }));

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (formBody) formBody.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
        setTimeout(closeModal, 3000);
        setTimeout(() => { if (formBody) formBody.style.display = ''; if (successEl) successEl.style.display = 'none'; form.reset(); }, 3500);
      });
    }
  }

  /* ---------- Contact Form ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-primary');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Message Sent!';
        btn.style.background = '#22C55E';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; contactForm.reset(); }, 3000);
      }
    });
  }

  /* ---------- Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

})();
