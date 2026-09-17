(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- DOM READY ----------
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initStickyNav();
    initMobileMenu();
    initScrollReveal();
    initPhilosophyRotator();
    initFAQ();
    initBackToTop();
    initSmoothScroll();
    setActiveNavLink();
  });

  function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initStickyNav() {
    const header = $('#siteHeader');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 2px 20px rgba(75, 56, 40, 0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    if (!hamburger || !mobileMenu) return;

    const toggle = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';

      const bars = $$('.bar', hamburger);
      if (isOpen) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    };

    hamburger.addEventListener('click', () => toggle());

    $$('.mobile-link, .mobile-cta', mobileMenu).forEach((link) => {
      link.addEventListener('click', () => toggle(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggle(false);
      }
    });
  }

  function initScrollReveal() {
    if (prefersReducedMotion) {
      $$('.reveal').forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.reveal').forEach((el) => observer.observe(el));
  }

  function initPhilosophyRotator() {
    const rotator = $('#philosophyRotator');
    if (!rotator) return;

    const phrases = $$('.rotating-phrase', rotator);
    if (phrases.length === 0) return;

    let current = 0;

    if (prefersReducedMotion) {
      phrases[0].classList.add('active');
      return;
    }

    setInterval(() => {
      phrases[current].classList.remove('active');
      current = (current + 1) % phrases.length;
      phrases[current].classList.add('active');
    }, 2800);
  }

  function initFAQ() {
    const questions = $$('.faq-question');
    if (questions.length === 0) return;

    questions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        // Close all others
        questions.forEach((other) => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
          }
        });
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });
  }

  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    const toggle = () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    };

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const offset = 80; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const links = $$('.nav-link');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      } else if (
        (path === '' || path === 'index.html') &&
        href === 'index.html'
      ) {
        link.classList.add('active');
      }
    });
  }
})();
