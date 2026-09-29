/**
 * ANURAG JAISWAL - PORTFOLIO INTERACTIVITY SCRIPT
 * Clean, lightweight vanilla JavaScript for smooth UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Elements Cache
  // --------------------------------------------------------------------------
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // Terminal Elements
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const copyTerminalBtn = document.getElementById('copy-terminal-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  // --------------------------------------------------------------------------
  // 2. Mobile Hamburger Menu Toggle
  // --------------------------------------------------------------------------
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.classList.toggle('is-active');
      navMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('is-active');
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('is-active');
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Scroll Events (Sticky Navbar, Scroll Progress & Back to Top)
  // --------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Navbar background blur intensity
    if (navbarWrapper) {
      if (scrollY > 40) {
        navbarWrapper.classList.add('scrolled');
      } else {
        navbarWrapper.classList.remove('scrolled');
      }
    }

    // Scroll progress bar
    if (scrollProgressBar && docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  // Back to Top Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Active Navigation Highlighting on Scroll
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNav() {
    const scrollY = window.pageYOffset + 120; // offset for sticky header

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --------------------------------------------------------------------------
  // 5. Terminal Interactive Tab Switching
  // --------------------------------------------------------------------------
  terminalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTabId = tab.getAttribute('data-tab');

      // Update Tab Buttons
      terminalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update Tab Content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('id') === targetTabId) {
          content.classList.add('active');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Toast Notification Helper
  // --------------------------------------------------------------------------
  let toastTimeout;
  function showToast(message = 'Copied to clipboard!') {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    
    toast.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  // Copy Terminal Content
  if (copyTerminalBtn) {
    copyTerminalBtn.addEventListener('click', () => {
      const activeTabContent = document.querySelector('.tab-content.active');
      if (activeTabContent) {
        const textToCopy = activeTabContent.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Code snippet copied!');
        }).catch(() => {
          showToast('Failed to copy');
        });
      }
    });
  }

  // Copy Email Address Button
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const emailElement = document.getElementById('email-text');
      const email = emailElement ? emailElement.innerText.trim() : 'anuragjaiswal9136@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied!');
      }).catch(() => {
        showToast('Failed to copy');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6b. Quick Contact Form Handler (Opens Native Mail Client)
  // --------------------------------------------------------------------------
  const quickContactForm = document.getElementById('quick-contact-form');
  if (quickContactForm) {
    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('msg-name');
      const msgInput = document.getElementById('msg-input');

      const name = nameInput ? nameInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!message) {
        showToast('Please enter a message before sending.');
        return;
      }

      const subject = name ? `Portfolio Contact from ${name}` : 'Portfolio Contact';
      const body = name 
        ? `Hello Anurag,\n\nName: ${name}\n\nMessage:\n${message}\n\n---\nSent from your portfolio website.`
        : `Hello Anurag,\n\nMessage:\n${message}\n\n---\nSent from your portfolio website.`;

      const mailtoUrl = `mailto:anuragjaiswal9136@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;
      showToast('Opening your email client...');
    });
  }

  // --------------------------------------------------------------------------
  // 7. Scroll Reveal Animation (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 8. Subtle Mouse Glow / Tilt Effect for Highlight Cards (Desktop Only)
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  console.log('✨ Anurag Jaiswal portfolio initialized successfully.');
});
