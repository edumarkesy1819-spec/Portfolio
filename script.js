/* ════════════════════════════════════════
   Portfolio JS — script.js
   • Typed effect
   • Navbar scroll + mobile menu
   • Language toggle (EN / PT)
   • Portfolio tabs
   • Skill bar animation (IntersectionObserver)
   • Reveal-on-scroll
   • Contact form validation
════════════════════════════════════════ */

'use strict';

/* ── Utility ──────────────────────────────────────────────── */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ════════════════════════════════════════════════════════════
   1. TYPED EFFECT
════════════════════════════════════════════════════════════ */
(function initTyped() {
  const el = qs('#typed-text');
  if (!el) return;

  const strings = {
    pt: [
      'Edição de Vídeo',
      'Videomaking & Filmmaking',
      'Soluções com IA Generativa',
      'Motion Graphics',
      'Conteúdo Corporativo',
    ],
    en: [
      'Video Editing',
      'Videomaking & Filmmaking',
      'Generative AI Solutions',
      'Motion Graphics',
      'Corporate Content',
    ],
  };

  let idx = 0;
  let charIdx = 0;
  let deleting = false;
  let lang = 'pt';
  let timer;

  function getStrings() { return strings[lang] || strings.pt; }

  function tick() {
    const words = getStrings();
    const word = words[idx % words.length];

    if (!deleting) {
      el.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        timer = setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        idx++;
      }
    }
    timer = setTimeout(tick, deleting ? 55 : 95);
  }

  tick();

  /* Allow language toggle to reset strings */
  window._typedSetLang = function (l) {
    lang = l;
    clearTimeout(timer);
    deleting = true;
    tick();
  };
})();


/* ════════════════════════════════════════════════════════════
   2. NAVBAR — Scroll effect + mobile hamburger
════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = qs('#navbar');
  const hamburger = qs('#nav-hamburger');
  const navLinks = qs('#nav-links');

  /* Scroll shrink */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* Mobile menu */
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* Close on nav link click */
  qsa('a', navLinks).forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();


/* ════════════════════════════════════════════════════════════
   3. LANGUAGE TOGGLE
════════════════════════════════════════════════════════════ */
(function initLang() {
  const btn = qs('#lang-btn');
  const label = qs('#lang-label');
  if (!btn) return;

  let current = 'pt';

  /** Translate all [data-pt] / [data-en] elements */
  function applyLang(lang) {
    qsa('[data-pt],[data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) el.textContent = text;
    });

    /* Update placeholders */
    const placeholders = {
      pt: {
        '#f-name': 'Seu nome completo',
        '#f-email': 'seu@email.com',
        '#f-subject': 'Sobre o projeto...',
        '#f-message': 'Conte-me sobre o seu projeto...',
      },
      en: {
        '#f-name': 'Your full name',
        '#f-email': 'your@email.com',
        '#f-subject': 'About the project...',
        '#f-message': 'Tell me about your project...',
      },
    };

    const ph = placeholders[lang] || {};
    Object.entries(ph).forEach(([sel, val]) => {
      const el = qs(sel);
      if (el) el.placeholder = val;
    });

    /* Document lang attr */
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    /* Typed effect */
    if (window._typedSetLang) window._typedSetLang(lang);
  }

  btn.addEventListener('click', () => {
    current = current === 'pt' ? 'en' : 'pt';
    label.textContent = current === 'pt' ? 'EN' : 'PT';
    applyLang(current);
  });
})();


/* ════════════════════════════════════════════════════════════
   4. PORTFOLIO TABS
════════════════════════════════════════════════════════════ */
(function initTabs() {
  const tabBtns = qsa('.tab-btn');
  const panels = qsa('.portfolio-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = qs(`#tab-${target}`);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;
      }
    });
  });
})();


/* ════════════════════════════════════════════════════════════
   5. SKILL BARS — animate on scroll
════════════════════════════════════════════════════════════ */
(function initSkillBars() {
  const fills = qsa('.skill-fill, .lang-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();


/* ════════════════════════════════════════════════════════════
   6. REVEAL ON SCROLL
════════════════════════════════════════════════════════════ */
(function initReveal() {
  /* Add reveal class to key elements */
  const targets = qsa(
    '.service-card, .portfolio-item, .timeline-item, .skill-item, .tool-tag, .info-card, .social-btn, .section-heading'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 8) * 60}ms`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => obs.observe(el));
})();


/* ════════════════════════════════════════════════════════════
   7. CONTACT FORM — validation + Formspree submit
════════════════════════════════════════════════════════════ */
(function initForm() {
  const form = qs('#contact-form');
  const success = qs('#form-success');
  const submit = qs('#btn-submit');
  if (!form) return;

  const fields = {
    name: { el: qs('#f-name'), err: qs('#err-name'), msg: { pt: 'Por favor, insira seu nome.', en: 'Please enter your name.' } },
    email: { el: qs('#f-email'), err: qs('#err-email'), msg: { pt: 'E-mail inválido.', en: 'Invalid email address.' } },
    subject: { el: qs('#f-subject'), err: qs('#err-subject'), msg: { pt: 'Informe o assunto.', en: 'Please provide a subject.' } },
    message: { el: qs('#f-message'), err: qs('#err-message'), msg: { pt: 'Escreva sua mensagem.', en: 'Please write your message.' } },
  };

  function getLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'pt';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(field, show) {
    field.el.classList.toggle('error', show);
    field.err.textContent = show ? field.msg[getLang()] : '';
  }

  function validate() {
    let ok = true;
    const f = fields;

    if (!f.name.el.value.trim()) { showError(f.name, true); ok = false; }
    else showError(f.name, false);

    if (!validateEmail(f.email.el.value.trim())) { showError(f.email, true); ok = false; }
    else showError(f.email, false);

    if (!f.subject.el.value.trim()) { showError(f.subject, true); ok = false; }
    else showError(f.subject, false);

    if (f.message.el.value.trim().length < 10) { showError(f.message, true); ok = false; }
    else showError(f.message, false);

    return ok;
  }

  /* Live validation */
  Object.values(fields).forEach(f => {
    f.el.addEventListener('blur', () => {
      const isEmpty = !f.el.value.trim();
      const isEmail = f.el === fields.email.el;
      if (isEmpty) showError(f, true);
      else if (isEmail && !validateEmail(f.el.value.trim())) showError(f, true);
      else showError(f, false);
    });
    f.el.addEventListener('input', () => { if (f.el.classList.contains('error')) showError(f, false); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    /* Send to Formspree */
    submit.classList.add('loading');
    submit.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      submit.classList.remove('loading');
      submit.disabled = false;

      if (response.ok) {
        form.reset();
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { success.hidden = true; }, 5000);
      } else {
        const lang = getLang();
        const errMsg = lang === 'en'
          ? 'Failed to send. Please try again or email directly.'
          : 'Falha ao enviar. Tente novamente ou envie um e-mail diretamente.';
        alert(errMsg);
      }
    } catch (err) {
      submit.classList.remove('loading');
      submit.disabled = false;
      const lang = getLang();
      const errMsg = lang === 'en'
        ? 'Network error. Please check your connection and try again.'
        : 'Erro de rede. Verifique sua conexão e tente novamente.';
      alert(errMsg);
    }
  });
})();


/* ════════════════════════════════════════════════════════════
   8. SMOOTH ACTIVE NAV LINK on scroll
════════════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = qsa('section[id]');
  const links = qsa('.nav-links a[href^="#"]');
  if (!sections.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = links.find(l => l.getAttribute('href') === `#${entry.target.id}`);
        if (active) active.style.color = 'var(--c-accent)';
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => obs.observe(s));
})();


/* ════════════════════════════════════════════════════════════
   9. CURSOR GLOW (desktop only)
════════════════════════════════════════════════════════════ */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(91,141,239,.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '0',
    transform: 'translate(-50%,-50%)',
    transition: 'left .12s ease, top .12s ease',
    willChange: 'left, top',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
})();


/* ════════════════════════════════════════════════════════════
   10. CV DROPDOWN
════════════════════════════════════════════════════════════ */
(function initCvDropdown() {
  const wrapper = qs('#cv-dropdown');
  const toggle = qs('#btn-cv-toggle');
  if (!wrapper || !toggle) return;

  function open() {
    wrapper.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function close() {
    wrapper.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    wrapper.classList.contains('open') ? close() : open();
  });

  /* Close when clicking outside */
  document.addEventListener('click', () => close());

  /* Close after selecting a version */
  qsa('.cv-dropdown-item').forEach(item => {
    item.addEventListener('click', () => setTimeout(close, 200));
  });
})();
