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

  /* ---- Contact form (sends via Web3Forms to the company inbox) ---- */
  var form = document.querySelector('#contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var btnLabel = submitBtn ? submitBtn.textContent : 'Send Enquiry';

    var setStatus = function (msg, color) {
      if (!status) return;
      status.textContent = msg;
      status.style.color = color;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Basic required-field check (name + email) */
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
      setStatus('Sending your enquiry...', 'var(--ink)');

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (r) {
          if (r.ok && r.data.success) {
            form.reset();
            setStatus('Thanks! Your enquiry has been sent - our team will be in touch shortly.', 'var(--green)');
          } else {
            setStatus((r.data && r.data.message) ? r.data.message : 'Something went wrong. Please email us directly at info@masters-foods.com.', '#c0392b');
          }
        })
        .catch(function () {
          setStatus('Network error. Please check your connection or email us at info@masters-foods.com.', '#c0392b');
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = btnLabel; }
        });
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

    /* Swipe left/right on touch screens (vertical scrolling is left alone) */
    var touchX = null, touchY = null;
    hs.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
    }, { passive: true });
    hs.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      touchX = touchY = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        go(idx + (dx < 0 ? 1 : -1));
        restart();
      }
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();
  }

  /* ---- Footer year ---- */
  var y = document.querySelector('#year');
  if (y) { y.textContent = new Date().getFullYear(); }
})();
