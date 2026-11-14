/**
 * PRANA YOGA & MEDITATION STUDIO — MAIN JAVASCRIPT
 * Strictly vanilla ES6+, zero external framework dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavigation();
  initAccordions();
  initGalleryFilter();
  initCountdownTimer();
  initFormValidation();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode) with LocalStorage & OS Preference
   ========================================================================== */
function initTheme() {
  const savedTheme = (localStorage.getItem('prana-theme') || localStorage.getItem('stackly-theme'));
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const targetTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  applyTheme(targetTheme);

  document.querySelectorAll('.theme-toggle-btn:not(.notification-btn):not(.dropdown-toggle-custom):not([data-bound="true"])').forEach(btn => {
    btn.setAttribute('data-bound', 'true');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('prana-theme', next);
      showToast(`Switched to ${next} mode`);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btns = document.querySelectorAll('.theme-toggle-btn:not(.notification-btn):not(.dropdown-toggle-custom)');
  btns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (theme === 'dark') {
      if (icon) icon.className = 'bi bi-sun-fill';
      btn.setAttribute('title', 'Switch to Light Mode');
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      if (icon) icon.className = 'bi bi-moon-stars-fill';
      btn.setAttribute('title', 'Switch to Dark Mode');
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  });
}

/* ==========================================================================
   2. RTL Management (Right-to-Left Layout)
   ========================================================================== */
function initRTL() {
  const savedRTL = (localStorage.getItem('prana-rtl') || localStorage.getItem('stackly-rtl'));
  if (savedRTL === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const isRTL = current === 'rtl';
      if (isRTL) {
        document.documentElement.setAttribute('dir', 'ltr');
        localStorage.setItem('prana-rtl', 'false');
        showToast('Switched to LTR layout');
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('prana-rtl', 'true');
        showToast('Switched to RTL layout');
      }
    });
  });
}

/* ==========================================================================
   3. Header, Sticky Scroll & Mobile Navigation Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  const hamburgerBtns = document.querySelectorAll('.hamburger-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtns = document.querySelectorAll('.mobile-nav-close');

  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtns.forEach(btn => btn.addEventListener('click', openDrawer));
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  closeBtns.forEach(btn => btn.addEventListener('click', closeDrawer));

  document.querySelectorAll('.mobile-nav-links a, .mobile-nav-drawer .btn').forEach(elem => {
    elem.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   4. Accordions (FAQs & Class Details)
   ========================================================================== */
function initAccordions() {
  document.querySelectorAll('.accordion-header-custom').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Optional: close siblings in the same accordion container
      const container = item.closest('.accordion-custom');
      if (container) {
        container.querySelectorAll('.accordion-item-custom').forEach(sibling => {
          sibling.classList.remove('active');
        });
      }

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. Gallery Filtering & Lightbox Modal
   ========================================================================== */
function initGalleryFilter() {
  const pills = document.querySelectorAll('.gallery-filter-pill');
  const items = document.querySelectorAll('.gallery-item');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox click
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay h5')?.innerText || 'Studio Gallery';
      if (img) {
        openLightbox(img.src, title);
      }
    });
  });
}

function openLightbox(src, title) {
  let modal = document.getElementById('galleryLightboxModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'galleryLightboxModal';
    modal.className = 'modal-backdrop-custom';
    modal.innerHTML = `
      <div class="modal-dialog-custom" style="max-width: 800px; background: transparent; border: none; box-shadow: none;">
        <div style="position: relative; text-align: center;">
          <button type="button" class="btn btn-white btn-sm" id="closeLightbox" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
            <i class="bi bi-x-lg"></i>
          </button>
          <img id="lightboxImg" src="" alt="Enlarged view" style="border-radius: 12px; width: 100%; max-height: 80vh; object-fit: contain; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
          <div id="lightboxCaption" style="color: #fff; margin-top: 12px; font-family: var(--font-heading); font-size: 1.3rem;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('#closeLightbox')) {
        modal.classList.remove('active');
      }
    });
  }

  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').innerText = title;
  modal.classList.add('active');
}

/* ==========================================================================
   6. Coming Soon Countdown Timer
   ========================================================================== */
function initCountdownTimer() {
  const container = document.getElementById('countdownTimer');
  if (!container) return;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 45); // 45 days from now

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      container.innerHTML = "<span>We are now open!</span>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-minutes');
    const sEl = document.getElementById('cd-seconds');

    if (dEl) dEl.innerText = String(days).padStart(2, '0');
    if (hEl) hEl.innerText = String(hours).padStart(2, '0');
    if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
    if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   7. Form Validation & Password Visibility
   ========================================================================== */
function initFormValidation() {
  // Password toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-group, .position-relative')?.querySelector('input');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '<i class="bi bi-eye-slash"></i>';
        } else {
          input.type = 'password';
          btn.innerHTML = '<i class="bi bi-eye"></i>';
        }
      }
    });
  });

  // Client validation for forms
  document.querySelectorAll('form[data-validate="true"]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }

        // Email check
        if (input.type === 'email' && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            input.classList.add('is-invalid');
            isValid = false;
          }
        }
      });

      if (isValid) {
        const successMsg = form.getAttribute('data-success-message') || 'Action completed successfully! (Demo interface - backend service ready)';
        showToast(successMsg);
        form.reset();
      } else {
        showToast('Please check all highlighted fields.');
      }
    });
  });
}

/* ==========================================================================
   8. Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container-custom');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-custom';
  toast.innerHTML = `<i class="bi bi-info-circle-fill"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global expose
window.showToast = showToast;
