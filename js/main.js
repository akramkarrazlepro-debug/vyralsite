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

  // ----- Effet de défilement accueil → 2e section = Services (desktop uniquement)
  const heroContent = document.querySelector('.hero-content');
  const secondSection = document.querySelector('.services-wipe-section');
  if (heroContent && secondSection) {
    function updateScrollTransition() {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      if (!isDesktop) {
        heroContent.style.transform = '';
        heroContent.style.opacity = '';
        heroContent.style.transition = '';
        secondSection.style.transform = '';
        secondSection.style.opacity = '';
        secondSection.style.transition = '';
        return;
      }
      const scrollY = window.scrollY;
      const heroH = hero ? hero.offsetHeight : window.innerHeight;
      const progress = Math.min(scrollY / heroH, 1);
      const progress2 = Math.max(0, Math.min(1, (scrollY - heroH * 0.2) / (heroH * 0.6)));
      heroContent.style.transform = 'scale(' + (1 - progress * 0.12) + ') translateY(' + (-progress * 50) + 'px)';
      heroContent.style.opacity = String(1 - progress * 0.65);
      heroContent.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
      secondSection.style.transform = 'translateY(' + (80 * (1 - progress2)) + 'px)';
      secondSection.style.opacity = String(0.3 + 0.7 * progress2);
      secondSection.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s ease-out';
    }
    window.addEventListener('scroll', updateScrollTransition, { passive: true });
    window.addEventListener('resize', updateScrollTransition);
    updateScrollTransition();
  }

  // ----- Hero : effet typewriter (écriture au clavier) pour les mots
  var heroRotatingWord = document.getElementById('heroRotatingWord');
  if (heroRotatingWord) {
    var heroWords = ['restaurants', 'opticiens', 'galeries d\'art', 'commerces', 'boutiques', 'café', 'artistes', 'entreprises'];
    var heroWordIndex = 0;
    var typeSpeed = 90;
    var eraseSpeed = 50;
    var pauseAfterWord = 1400;

    function typeWord(word, done) {
      var i = 0;
      heroRotatingWord.textContent = '';
      heroRotatingWord.setAttribute('aria-label', word);
      function addLetter() {
        if (i < word.length) {
          heroRotatingWord.textContent += word[i];
          i++;
          setTimeout(addLetter, typeSpeed);
        } else {
          setTimeout(done, pauseAfterWord);
        }
      }
      addLetter();
    }

    function eraseWord(done) {
      var text = heroRotatingWord.textContent;
      if (text.length === 0) return done();
      function removeLetter() {
        text = heroRotatingWord.textContent;
        if (text.length > 0) {
          heroRotatingWord.textContent = text.slice(0, -1);
          setTimeout(removeLetter, eraseSpeed);
        } else {
          done();
        }
      }
      removeLetter();
    }

    function nextWord() {
      heroWordIndex = (heroWordIndex + 1) % heroWords.length;
      typeWord(heroWords[heroWordIndex], function () {
        eraseWord(function () {
          nextWord();
        });
      });
    }

    typeWord(heroWords[0], function () {
      eraseWord(function () {
        nextWord();
      });
    });
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

  // ----- GSAP : Services Wipe Reveal (wrapper 500vh + sticky viewport, clip-path + fade texte)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    var panels = gsap.utils.toArray('.service-panel');
    var wrapper = document.querySelector('.services-wrapper');
    var isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (wrapper && panels.length > 0 && isDesktop) {
      // Wrapper 600vh : 5 tranches de 100vh pour les panels + 100vh marge en fin (voir Drone en entier)
      panels.forEach(function (panel, i) {
        if (i === 0) return;

        var pctStart = (i / 6) * 100;
        var pctEnd = ((i + 1) / 6) * 100;
        var pctMid = pctStart + (pctEnd - pctStart) * 0.5;

        gsap.fromTo(panel,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: pctStart + '% top',
              end: pctEnd + '% top',
              scrub: true
            }
          }
        );

        var inner = panel.querySelector('.panel-inner');
        if (inner) {
          gsap.fromTo(inner,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wrapper,
                start: pctStart + '% top',
                end: pctMid + '% top',
                scrub: true
              }
            }
          );
        }
      });

      window.addEventListener('load', function () {
        ScrollTrigger.refresh();
      });
    }
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
