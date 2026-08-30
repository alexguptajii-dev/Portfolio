/**
 * ANSHU KUMAR - MODERN PERSONAL PORTFOLIO JAVASCRIPT
 * Interactive functionality: Navigation, ScrollSpy, Filters, Stats Counter,
 * Interactive Quiz App Simulator Modal, Form Validation, Clipboard & Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initNavbar();
  initScrollProgress();
  initScrollReveal();
  initStatCounters();
  initSkillsFilter();
  initQuizDemoModal();
  initContactForm();
  initClipboardButtons();
  initResumeActions();
  initBackToTop();
  updateCurrentYear();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Navbar glass effect on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy: Highlight active link
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Hamburger Toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile drawer when clicking any nav link
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ==========================================================================
   2. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* ==========================================================================
   3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
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
    revealElements.forEach(el => el.classList.add('reveal-visible'));
  }
}

/* ==========================================================================
   4. ANIMATED STAT COUNTERS
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const runCounterAnimation = () => {
    statNumbers.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuad)
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = target * easeProgress;

        counter.textContent = decimals > 0 
          ? currentVal.toFixed(decimals) 
          : Math.floor(currentVal).toString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          runCounterAnimation();
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(achievementsSection);
  } else {
    runCounterAnimation();
  }
}

/* ==========================================================================
   5. SKILLS CATEGORY FILTER
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE QUIZ DEMO MODAL (Live playable demonstration)
   ========================================================================== */
function initQuizDemoModal() {
  const modal = document.getElementById('quiz-modal');
  const openBtn = document.getElementById('open-quiz-demo-btn');
  const closeBtn = document.getElementById('close-quiz-modal-btn');
  const restartBtn = document.getElementById('quiz-restart-btn');
  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');

  const questionCountEl = document.getElementById('quiz-question-count');
  const progressFillEl = document.getElementById('quiz-progress-fill');
  const subjectBadgeEl = document.getElementById('quiz-subject-badge');
  const questionTextEl = document.getElementById('quiz-question-text');
  const optionsContainer = document.getElementById('quiz-options-container');

  const playView = document.getElementById('quiz-play-view');
  const resultView = document.getElementById('quiz-result-view');
  const scoreNumEl = document.getElementById('result-score-num');
  const feedbackTextEl = document.getElementById('result-feedback-text');

  // Sample questions demonstrating the 50+ question architecture
  const sampleQuestions = [
    {
      subject: "Data Structures",
      question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
      options: ["Queue", "Stack", "Binary Tree", "Linked List"],
      correct: 1
    },
    {
      subject: "C++ & Algorithms",
      question: "What is the worst-case time complexity of standard QuickSort?",
      options: ["O(log n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 2
    },
    {
      subject: "Web Development",
      question: "Which CSS layout module is specifically designed for one-dimensional layouts?",
      options: ["CSS Grid", "Flexbox", "Float Positioning", "Table Layout"],
      correct: 1
    },
    {
      subject: "JavaScript",
      question: "Which keyword declares a block-scoped variable that cannot be reassigned?",
      options: ["var", "let", "const", "static"],
      correct: 2
    },
    {
      subject: "Object-Oriented Programming",
      question: "Which OOP concept allows a subclass to provide a specific implementation of a parent class method?",
      options: ["Encapsulation", "Method Overriding (Polymorphism)", "Abstraction", "Multiple Inheritance"],
      correct: 1
    }
  ];

  let currentQuestionIdx = 0;
  let userAnswers = new Array(sampleQuestions.length).fill(null);

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentQuestionIdx = 0;
    userAnswers.fill(null);
    showPlayView();
    renderQuestion();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const showPlayView = () => {
    playView.classList.remove('hidden');
    resultView.classList.add('hidden');
  };

  const showResultView = () => {
    playView.classList.add('hidden');
    resultView.classList.remove('hidden');

    // Calculate score
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === sampleQuestions[idx].correct) score++;
    });

    scoreNumEl.textContent = score.toString();

    if (score === 5) {
      feedbackTextEl.textContent = "Outstanding! Perfect 5/5 score. Your CS fundamentals are rock solid!";
    } else if (score >= 3) {
      feedbackTextEl.textContent = "Great job! Strong grasp of Computer Science & Web Development concepts.";
    } else {
      feedbackTextEl.textContent = "Good try! A quick review of DSA and JavaScript concepts will boost your score.";
    }
  };

  const renderQuestion = () => {
    const q = sampleQuestions[currentQuestionIdx];
    const total = sampleQuestions.length;

    questionCountEl.textContent = `Question ${currentQuestionIdx + 1} of ${total}`;
    progressFillEl.style.width = `${((currentQuestionIdx + 1) / total) * 100}%`;
    subjectBadgeEl.textContent = q.subject;
    questionTextEl.textContent = q.question;

    // Render options
    optionsContainer.innerHTML = '';
    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = `quiz-opt-btn ${userAnswers[currentQuestionIdx] === optIdx ? 'selected' : ''}`;
      btn.type = 'button';
      
      const optLetter = String.fromCharCode(65 + optIdx);
      btn.innerHTML = `
        <span><strong>${optLetter})</strong> ${optText}</span>
        ${userAnswers[currentQuestionIdx] === optIdx ? '<i class="fa-solid fa-circle-check text-cyan"></i>' : ''}
      `;

      btn.addEventListener('click', () => {
        userAnswers[currentQuestionIdx] = optIdx;
        renderQuestion();
      });

      optionsContainer.appendChild(btn);
    });

    // Update navigation buttons
    prevBtn.disabled = currentQuestionIdx === 0;
    if (currentQuestionIdx === total - 1) {
      nextBtn.innerHTML = `<span>Submit Quiz</span> <i class="fa-solid fa-check"></i>`;
    } else {
      nextBtn.innerHTML = `<span>Next Question</span> <i class="fa-solid fa-arrow-right"></i>`;
    }
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (restartBtn) restartBtn.addEventListener('click', openModal);

  // Close on backdrop click or ESC key
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  // Next & Prev handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestionIdx > 0) {
        currentQuestionIdx--;
        renderQuestion();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentQuestionIdx < sampleQuestions.length - 1) {
        currentQuestionIdx++;
        renderQuestion();
      } else {
        showResultView();
      }
    });
  }
}

/* ==========================================================================
   7. CONTACT FORM VALIDATION & MAIL TRIGGER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successAlert = document.getElementById('form-success-alert');
  if (!form) return;

  const nameInput = document.getElementById('user_name');
  const emailInput = document.getElementById('user_email');
  const subjectInput = document.getElementById('user_subject');
  const messageInput = document.getElementById('user_message');
  const submitBtn = document.getElementById('submit-btn');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset error classes
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    if (hasError) return;

    // Show loading state on button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Preparing message...`;

    setTimeout(() => {
      // Build mailto link as fallback/direct send
      const subject = encodeURIComponent(subjectInput.value.trim() || `Portfolio Contact from ${nameInput.value.trim()}`);
      const body = encodeURIComponent(
        `Hi Anshu,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
      );
      const mailtoUrl = `mailto:alexguptajii@gmail.com?subject=${subject}&body=${body}`;

      // Open mailto
      window.location.href = mailtoUrl;

      // Show in-page success alert
      if (successAlert) {
        successAlert.classList.remove('hidden');
      }

      showToast("Your message is ready! Opening your email client...", "success");

      // Reset form
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="btn-text">Send Message</span> <i class="fa-solid fa-paper-plane btn-icon"></i>`;
    }, 600);
  });
}

/* ==========================================================================
   8. 1-CLICK CLIPBOARD COPY WITH TOAST NOTIFICATION
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Change icon temporarily
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-cyan"></i>';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);

        showToast(`Copied to clipboard: ${textToCopy}`, 'info');
      } catch (err) {
        showToast(`Copy failed: ${textToCopy}`, 'error');
      }
    });
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconHtml = '<i class="fa-solid fa-circle-check text-cyan"></i>';
  if (type === 'error') iconHtml = '<i class="fa-solid fa-circle-exclamation text-red"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}

/* ==========================================================================
   9. FLOATING BACK TO TOP BUTTON WITH CIRCULAR PROGRESS
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  const footerBackToTop = document.getElementById('footer-back-to-top');
  if (!backToTopBtn) return;

  const circle = backToTopBtn.querySelector('.progress-ring-circle');
  const radius = circle ? circle.r.baseVal.value : 21;
  const circumference = 2 * Math.PI * radius;

  if (circle) {
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
  }

  const setProgress = (percent) => {
    if (!circle) return;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  };

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / totalHeight) * 100;

    setProgress(scrollPercent);

    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  backToTopBtn.addEventListener('click', scrollToTop);
  if (footerBackToTop) footerBackToTop.addEventListener('click', scrollToTop);
}

/* ==========================================================================
   10. DYNAMIC YEAR IN FOOTER
   ========================================================================== */
function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
}

/* ==========================================================================
   11. RESUME ACTIONS (Download PDF & Print)
   ========================================================================== */
function initResumeActions() {
  const downloadBtn = document.getElementById('download-resume-btn');
  const printBtn = document.getElementById('print-resume-btn');

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showToast("Opening print/save dialog — select 'Save as PDF' to save your copy!", "info");
      setTimeout(() => {
        window.print();
      }, 400);
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
