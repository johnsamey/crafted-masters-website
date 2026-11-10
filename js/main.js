/* ============================================================
   CRAFTED MASTERS - site interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Graceful images: fade in real photos, keep placeholder if missing ---- */
  document.querySelectorAll('.media img').forEach(function (img) {
    var reveal = function () { img.classList.add('loaded'); };
    if (img.complete && img.naturalWidth > 0) {
      reveal();
    } else {
      img.addEventListener('load', reveal);
      img.addEventListener('error', function () {
        /* leave the styled placeholder (::after) visible */
        img.classList.remove('loaded');
        img.style.display = 'none';
      });
    }
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Contact form (front-end only; no backend configured) ---- */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Thanks! Your message is ready - connect this form to email or a form service to go live.';
        status.style.color = 'var(--green)';
      }
      form.reset();
    });
  }

  /* ---- Hero slideshow ---- */
  var hs = document.querySelector('.hero-slideshow');
  if (hs) {
    var slides = Array.prototype.slice.call(hs.querySelectorAll('.hs-slide'));
    var dotsWrap = hs.querySelector('.hs-dots');
    var idx = 0, timer = null;
    var INTERVAL = 4200;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dots = [];

    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'hs-dot' + (i === 0 ? ' is-active' : '');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Dish ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(b);
      dots.push(b);
    });

    function go(n) {
      n = (n + slides.length) % slides.length;
      if (n === idx) return;
      slides[idx].classList.remove('is-active');
      dots[idx].classList.remove('is-active');
      idx = n;
      slides[idx].classList.add('is-active');
      dots[idx].classList.add('is-active');
    }
    function next() { go(idx + 1); }
    function start() { if (reduce || timer) return; timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    hs.addEventListener('mouseenter', stop);
    hs.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();
  }

  /* ---- Footer year ---- */
  var y = document.querySelector('#year');
  if (y) { y.textContent = new Date().getFullYear(); }
})();
