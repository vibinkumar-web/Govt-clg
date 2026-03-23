
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Element References ---------- */
  const navbar       = document.querySelector('.navbar');
  const hamburger    = document.querySelector('.hamburger');
  const navLinks     = document.querySelector('.nav-links');
  const navOverlay   = document.querySelector('.nav-overlay');
  const backToTop    = document.querySelector('.back-to-top');
  const statNumbers  = document.querySelectorAll('.stat-number');
  const reveals      = document.querySelectorAll('.reveal');
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const contactForm  = document.getElementById('contactForm');

  /* ---------- Sticky Navbar ---------- */
  /* Adds a shadow and compact style when user scrolls past 80px */
  function handleScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }
    /* Back-to-top visibility */
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }
  }
  window.addEventListener('scroll', handleScroll);

  /* ---------- Mobile Hamburger Menu ---------- */
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    if (navOverlay) navOverlay.classList.toggle('show');
    /* Prevent body scroll when menu is open */
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', toggleMobileMenu);
  }

  /* Close mobile menu when a nav link is clicked */
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navLinks.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });
  }

  /* ---------- Mobile Dropdown Toggle ---------- */
  document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        var parent = this.closest('.nav-dropdown');
        if (parent) parent.classList.toggle('open');
      }
    });
  });

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Back to Top Button ---------- */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Statistics Counter Animation ---------- */
  /* Counts numbers up from 0 when they enter the viewport */
  var statsCounted = false;

  function animateCounters() {
    if (statsCounted) return;

    statNumbers.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        statsCounted = true;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 2000; // 2 seconds
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          /* Ease-out cubic */
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + '+';
          }
        }

        requestAnimationFrame(step);
      }
    });
  }

  if (statNumbers.length) {
    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load
  }

  /* ---------- Scroll Reveal Animation ---------- */
  /* Uses IntersectionObserver for performant reveal-on-scroll */
  if (reveals.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: show everything immediately */
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- Gallery Category Filter ---------- */
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* Update active button */
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        var category = this.getAttribute('data-filter');

        galleryItems.forEach(function (item) {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Contact Form Validation ---------- */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('formName');
      var email   = document.getElementById('formEmail');
      var subject = document.getElementById('formSubject');
      var message = document.getElementById('formMessage');
      var isValid = true;

      /* Clear previous errors */
      this.querySelectorAll('.error-msg').forEach(function (el) { el.remove(); });
      this.querySelectorAll('.form-group input, .form-group textarea').forEach(function (el) {
        el.style.borderColor = '';
      });

      /* Validate name */
      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        isValid = false;
      }

      /* Validate email */
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showError(email, 'Please enter your email address.');
        isValid = false;
      } else if (!emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      /* Validate subject */
      if (subject && !subject.value.trim()) {
        showError(subject, 'Please enter a subject.');
        isValid = false;
      }

      /* Validate message */
      if (!message.value.trim()) {
        showError(message, 'Please enter your message.');
        isValid = false;
      }

      if (isValid) {
        /* Simulate form submission */
        var submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(function () {
          alert('Thank you! Your message has been sent successfully.');
          contactForm.reset();
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
        }, 1200);
      }
    });
  }

  /**
   * Displays an inline error message below a form field.
   * @param {HTMLElement} field — the input/textarea element
   * @param {string} msg — error text
   */
  function showError(field, msg) {
    field.style.borderColor = '#e74c3c';
    var errorEl = document.createElement('span');
    errorEl.className = 'error-msg';
    errorEl.style.cssText = 'color:#e74c3c;font-size:0.8rem;margin-top:0.2rem;display:block;';
    errorEl.textContent = msg;
    field.parentNode.appendChild(errorEl);
  }

  /* ---------- Active Nav Link Highlight ---------- */
  /* Highlights the current page link in the navbar */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

});
