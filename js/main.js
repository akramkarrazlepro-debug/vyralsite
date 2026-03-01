(function () {
  'use strict';

  // ----- Parallax léger sur le hero (profondeur)
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg-gradient');
  if (hero && heroBg) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      const rate = y * 0.15;
      heroBg.style.transform = 'translate3d(0, ' + rate + 'px, 0)';
    }, { passive: true });
  }

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

  // ----- Workflow "Travailler avec nous, c'est simple" — animation défilement (4 étapes)
  const workflowSection = document.getElementById('workflow');
  const workflowProgressFill = document.getElementById('workflowProgressFill');
  const workflowWords = document.querySelectorAll('.workflow-word');
  const workflowSteps = document.querySelectorAll('.workflow-step');
  const workflowVideoCta = document.getElementById('workflowVideoCta');

  function updateWorkflowScroll() {
    if (!workflowSection || !workflowProgressFill) return;

    const rect = workflowSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Progression 0 → 1 au fur et à mesure du défilement dans la section
    const progress = Math.max(0, Math.min(1, (viewportHeight * 0.5 - rect.top) / (viewportHeight * 0.65)));
    const progressPercent = progress * 100;

    workflowProgressFill.style.width = progressPercent + '%';

    // Révélation des mots du titre "Travailler avec nous, c'est simple."
    workflowWords.forEach(function (word, i) {
      const revealAt = (i + 0.5) / workflowWords.length;
      const highlightAt = (i + 0.8) / workflowWords.length;
      if (progress >= revealAt * 0.9) {
        word.classList.add('revealed');
        if (progress >= highlightAt) word.classList.add('highlight');
      } else {
        word.classList.remove('revealed', 'highlight');
      }
    });

    // Révélation des 4 étapes une par une au défilement
    workflowSteps.forEach(function (step, i) {
      const stepRevealAt = 0.1 + i * 0.2;
      if (progress >= stepRevealAt) {
        step.classList.add('revealed');
      } else {
        step.classList.remove('revealed');
      }
    });

    // CTA "Découvrir nos services" en fin de section
    if (workflowVideoCta) {
      if (progress >= 0.85) {
        workflowVideoCta.classList.add('revealed');
      } else {
        workflowVideoCta.classList.remove('revealed');
      }
    }
  }

  if (workflowSection) {
    window.addEventListener('scroll', updateWorkflowScroll, { passive: true });
    updateWorkflowScroll();
  }

  // ----- Timeline : au clic sur une étape, afficher l'image
  const workflowPreview = document.getElementById('workflowTimelinePreview');
  const workflowPreviewImg = document.getElementById('workflowTimelinePreviewImg');
  document.querySelectorAll('.workflow-step[data-workflow-image]').forEach(function (step) {
    step.addEventListener('click', function () {
      var imgUrl = this.getAttribute('data-workflow-image');
      if (!workflowPreview || !workflowPreviewImg) return;
      workflowSteps.forEach(function (s) { s.classList.remove('is-active'); });
      this.classList.add('is-active');
      if (imgUrl) {
        workflowPreviewImg.src = imgUrl;
        workflowPreviewImg.alt = this.querySelector('h3') ? this.querySelector('h3').textContent : '';
        workflowPreviewImg.removeAttribute('hidden');
        workflowPreview.classList.add('has-image');
      } else {
        workflowPreview.classList.remove('has-image');
        workflowPreviewImg.setAttribute('hidden', '');
        workflowPreviewImg.removeAttribute('src');
      }
    });
  });

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

  // ----- Blocs services : clic = afficher description, masquer image
  document.querySelectorAll('[data-service-block]').forEach(function (block) {
    block.addEventListener('click', function () {
      this.classList.toggle('is-open');
    });
    block.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.classList.toggle('is-open');
      }
    });
  });
})();
