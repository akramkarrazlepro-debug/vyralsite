(function () {
  'use strict';

  // ----- Header scroll
  const header = document.getElementById('header');
  if (header) {
    let lastScroll = 0;
    function onScroll() {
      const y = window.scrollY;
      if (y > 60) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
      lastScroll = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navMobile = document.getElementById('navMobile');
  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ----- Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const observerOptions = { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ----- Showreel "Du concept à la création" — expérience scroll
  const showreelSection = document.getElementById('showreel');
  const showreelProgressFill = document.getElementById('showreelProgressFill');
  const showreelVideoWrap = document.getElementById('showreelVideoWrap');
  const showreelWords = document.querySelectorAll('.showreel-word');

  function updateShowreelScroll() {
    if (!showreelSection || !showreelProgressFill) return;

    const rect = showreelSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Progression 0 → 1 : section entre par le bas jusqu'à bien visible
    const progress = Math.max(0, Math.min(1, (viewportHeight * 0.5 - rect.top) / (viewportHeight * 0.6)));
    const progressPercent = progress * 100;

    showreelProgressFill.style.width = progressPercent + '%';

    // Révélation des mots un par un selon la progression
    showreelWords.forEach(function (word, i) {
      const revealAt = (i + 0.5) / showreelWords.length;
      const highlightAt = (i + 0.8) / showreelWords.length;
      if (progress >= revealAt * 0.9) {
        word.classList.add('revealed');
        if (progress >= highlightAt) word.classList.add('highlight');
      } else {
        word.classList.remove('revealed', 'highlight');
      }
    });

    // Vidéo scale-in quand la section est bien visible
    if (showreelVideoWrap) {
      if (rect.top < viewportHeight * 0.8) {
        showreelVideoWrap.classList.add('scroll-in');
      } else {
        showreelVideoWrap.classList.remove('scroll-in');
      }
    }
  }

  if (showreelSection) {
    window.addEventListener('scroll', updateShowreelScroll, { passive: true });
    updateShowreelScroll();
  }

  // ----- Testimonials carousel
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialsDots');

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let index = 0;
    const cardWidth = 100; // 100% per card in our layout

    function goTo(i) {
      index = ((i % total) + total) % total;
      var percent = (index * 100) / total;
      track.style.transform = 'translateX(-' + percent + '%)';
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot' + (i === index ? ' active' : '');
        dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsContainer.appendChild(dot);
      }
    }

    prevBtn.addEventListener('click', function () { goTo(index - 1); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); });

    track.style.display = 'flex';
    track.style.width = total * 100 + '%';
    track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    cards.forEach(function (card) {
      card.style.flex = '0 0 ' + 100 / total + '%';
      card.style.minWidth = 100 / total + '%';
    });

    updateDots();
  }

  // ----- Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
