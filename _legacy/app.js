/**
 * AuraBlood - Blood Donation System Design System
 * Client-side dynamic effects & global layout handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initParticles();
  initMouseParallax();
  initStats();
  initTimeline();
  initCompatibility();
  initFeatures();
  initTestimonials();
  initFaq();
  initLoader();
  initCustomCursor();
  initBackToTop();
  initFab();
});

/**
 * Navbar scroll behavior & mobile drawer menu toggle
 */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add background blur/solid color to navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile drawer
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggleBtn.classList.toggle('open');
      navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking navigation link (especially for mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggleBtn.classList.remove('open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
        
        // Update active class
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Close mobile menu if clicked outside the navbar area
    document.addEventListener('click', (event) => {
      if (!navbar.contains(event.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggleBtn.classList.remove('open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * Scroll progress indicator bar updating
 */
function initScrollProgress() {
  const progressIndicator = document.getElementById('scroll-progress');
  if (!progressIndicator) return;

  const updateProgress = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      progressIndicator.style.width = `${scrolled}%`;
    } else {
      progressIndicator.style.width = '0%';
    }
  };

  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress(); // initial check
}

/**
 * Generate glowing ambient particles that slowly float up
 */
function initParticles() {
  const particlesContainer = document.getElementById('ambient-particles');
  if (!particlesContainer) return;

  const maxParticles = 30; // Kept balanced for smooth UI performance

  for (let i = 0; i < maxParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'ambient-particle';

    // Randomize specs for organic scattering
    const duration = Math.random() * 15 + 10;   // 10s to 25s
    const delay = Math.random() * -25;          // Negative delays so they exist instantly
    const left = Math.random() * 100;           // 0% to 100% of viewport width
    const wobble = Math.random() * 80 - 40;     // -40px to 40px drift
    const scale = Math.random() * 0.9 + 0.4;    // 0.4 to 1.3 sizing

    particle.style.setProperty('--duration', `${duration}s`);
    particle.style.setProperty('--delay', `${delay}s`);
    particle.style.setProperty('--left', `${left}%`);
    particle.style.setProperty('--wobble', `${wobble}px`);
    particle.style.setProperty('--scale', scale.toString());

    particlesContainer.appendChild(particle);
  }
}

/**
 * Mouse Move Parallax Depth effect on ambient particles
 */
function initMouseParallax() {
  const particlesContainer = document.getElementById('ambient-particles');
  if (!particlesContainer) return;

  let requestRef = null;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  // Damping coefficient for ultra-smooth movement (higher is slower/smoother)
  const easeFactor = 0.08;

  window.addEventListener('mousemove', (e) => {
    // Standardize mouse relative coordinates between -1 and 1
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;

    // Start update cycle if not running
    if (!requestRef) {
      requestRef = requestAnimationFrame(updateParallax);
    }
  });

  function updateParallax() {
    // Apply interpolation/damping
    currentX += (mouseX - currentX) * easeFactor;
    currentY += (mouseY - currentY) * easeFactor;

    // Apply values to CSS custom properties
    particlesContainer.style.setProperty('--mouse-x', currentX.toString());
    particlesContainer.style.setProperty('--mouse-y', currentY.toString());

    // Stop updating if difference is negligible to save rendering cycles
    if (Math.abs(mouseX - currentX) < 0.001 && Math.abs(mouseY - currentY) < 0.001) {
      requestRef = null;
    } else {
      requestRef = requestAnimationFrame(updateParallax);
    }
  }
}

/**
 * Animate statistics cards and counter increments when scrolled into view
 */
function initStats() {
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('visible');
        
        const counterElement = card.querySelector('.counter');
        if (counterElement) {
          const targetValue = parseInt(card.getAttribute('data-target'), 10);
          animateCounter(counterElement, targetValue);
        }
        
        observer.unobserve(card);
      }
    });
  }, observerOptions);

  statCards.forEach(card => {
    observer.observe(card);
  });
}

/**
 * Counts up a number element to a target value using smooth quadratic easing
 */
function animateCounter(element, target) {
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Quadratic ease-out: f(t) = t * (2 - t)
    const easeProgress = progress * (2 - progress);
    const value = Math.floor(easeProgress * target);
    
    element.textContent = value.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Animate timeline steps on scroll
 */
function initTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => {
    observer.observe(item);
  });
}

/**
 * Interactive Blood Compatibility Matching Engine
 */
function initCompatibility() {
  const badgeBoard = document.getElementById('compatibility-badge-board');
  if (!badgeBoard) return;

  const badges = badgeBoard.querySelectorAll('.compat-badge');
  const giantBadge = document.getElementById('compat-giant-badge');
  const titleType = document.getElementById('compat-title-type');
  const descText = document.getElementById('compat-desc-text');
  const giveList = document.getElementById('compat-give-list');
  const receiveList = document.getElementById('compat-receive-list');

  const compatibilityRules = {
    'O-': {
      give: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      receive: ['O-'],
      desc: 'Universal Donor: O- blood can be given to patients of any blood type in emergencies.'
    },
    'O+': {
      give: ['O+', 'A+', 'B+', 'AB+'],
      receive: ['O-', 'O+'],
      desc: 'Universal Red Cell Donor: O+ is the most common blood type, needed by many patients.'
    },
    'A-': {
      give: ['A-', 'A+', 'AB-', 'AB+'],
      receive: ['O-', 'A-'],
      desc: 'A- donors can provide red cells to both A and AB positive/negative recipients.'
    },
    'A+': {
      give: ['A+', 'AB+'],
      receive: ['O-', 'O+', 'A-', 'A+'],
      desc: 'A+ is one of the most common types. A+ patients can receive A and O positive or negative blood.'
    },
    'B-': {
      give: ['B-', 'B+', 'AB-', 'AB+'],
      receive: ['O-', 'B-'],
      desc: 'B- donors can provide red cells to both B and AB positive/negative recipients.'
    },
    'B+': {
      give: ['B+', 'AB+'],
      receive: ['O-', 'O+', 'B-', 'B+'],
      desc: 'B+ donors can help patients with B+ and AB+ blood types.'
    },
    'AB-': {
      give: ['AB-', 'AB+'],
      receive: ['O-', 'A-', 'B-', 'AB-'],
      desc: 'AB- is a rare type. They can receive red cells from all negative blood types.'
    },
    'AB+': {
      give: ['AB+'],
      receive: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      desc: 'Universal Recipient: AB+ patients can safely receive red blood cells from any blood type.'
    }
  };

  function selectBloodType(type) {
    const rule = compatibilityRules[type];
    if (!rule) return;

    // 1. Update giant badge and text descriptions
    giantBadge.textContent = type;
    titleType.textContent = `Group ${type} ${type === 'O-' ? '(Universal Donor)' : type === 'AB+' ? '(Universal Recipient)' : ''}`;
    descText.textContent = rule.desc;

    // 2. Generate Give/Receive list static circular badges
    giveList.innerHTML = '';
    rule.give.forEach(t => {
      const b = document.createElement('span');
      b.className = 'compat-badge-static give';
      b.textContent = t;
      giveList.appendChild(b);
    });

    receiveList.innerHTML = '';
    rule.receive.forEach(t => {
      const b = document.createElement('span');
      b.className = 'compat-badge-static receive';
      b.textContent = t;
      receiveList.appendChild(b);
    });

    // 3. Highlight/Dim badges on the board
    badges.forEach(badge => {
      const badgeType = badge.getAttribute('data-type');
      badge.className = 'compat-badge'; // reset
      
      if (badgeType === type) {
        badge.classList.add('active');
      } else if (rule.give.includes(badgeType) && rule.receive.includes(badgeType)) {
        badge.classList.add('highlighted');
      } else if (rule.give.includes(badgeType)) {
        badge.classList.add('highlighted');
      } else if (rule.receive.includes(badgeType)) {
        badge.classList.add('receive-highlighted');
      } else {
        badge.classList.add('dimmed');
      }
    });
  }

  // Bind click listeners to board badges
  badges.forEach(badge => {
    badge.addEventListener('click', () => {
      const type = badge.getAttribute('data-type');
      selectBloodType(type);
    });
  });

  // Select default O- on startup
  selectBloodType('O-');
}

/**
 * Animate feature cards on scroll using Intersection Observer
 */
function initFeatures() {
  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  featureCards.forEach(card => {
    observer.observe(card);
  });
}

/**
 * Testimonial Carousel Auto-slide and Dots Navigation
 */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (slides.length === 0) return;

  let currentSlideIndex = 0;
  let autoSlideTimer = null;

  // 1. Generate Dot indicators dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  // 2. Navigation function
  function goToSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    currentSlideIndex = index;

    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
  }

  // 3. Arrow Click Handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex + 1);
      resetAutoSlide();
    });
  }

  // 4. Auto-Slide timers
  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
    }
    startAutoSlide();
  }

  startAutoSlide();
}

/**
 * FAQ Accordion Toggle with dynamic scrollHeight expansion
 */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          otherContent.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Premium Loading Screen Fade Out
 */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 600);
  });
  
  // Fallback in case window load fails to fire
  setTimeout(() => {
    loader.classList.add('fade-out');
  }, 3000);
}

/**
 * Animated Custom Cursor (Spring Easing Lag Effect)
 */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const dot = document.getElementById('custom-cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateOuterCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateOuterCursor);
  }
  animateOuterCursor();

  // Attach hover state triggers for all clickables
  const updateInteractiveHoverListeners = () => {
    const clickables = document.querySelectorAll('a, button, input, select, textarea, .compat-badge, .carousel-btn, .carousel-dot');
    clickables.forEach(elem => {
      // Remove to prevent duplicate bindings
      elem.removeEventListener('mouseenter', addHoverClass);
      elem.removeEventListener('mouseleave', removeHoverClass);
      elem.addEventListener('mouseenter', addHoverClass);
      elem.addEventListener('mouseleave', removeHoverClass);
    });
  };

  function addHoverClass() {
    cursor.classList.add('cursor-hover');
    dot.classList.add('cursor-hover');
  }

  function removeHoverClass() {
    cursor.classList.remove('cursor-hover');
    dot.classList.remove('cursor-hover');
  }

  updateInteractiveHoverListeners();

  // Re-bind cursor when dynamically changing blood groups/compatibility list elements
  const badgeBoard = document.getElementById('compatibility-badge-board');
  if (badgeBoard) {
    badgeBoard.addEventListener('click', () => {
      setTimeout(updateInteractiveHoverListeners, 100);
    });
  }
}

/**
 * Back to Top Scroll Behavior
 */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Floating Action Button (FAB) Controller
 */
function initFab() {
  const fabContainer = document.querySelector('.fab-container');
  const mainBtn = document.getElementById('main-fab');
  if (!fabContainer || !mainBtn) return;

  mainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = fabContainer.classList.toggle('active');
    mainBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  document.addEventListener('click', () => {
    fabContainer.classList.remove('active');
    mainBtn.setAttribute('aria-expanded', 'false');
  });
}
