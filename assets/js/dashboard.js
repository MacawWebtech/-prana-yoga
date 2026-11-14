/**
 * PRANA YOGA & MEDITATION STUDIO — MEMBER DASHBOARD JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
  initDashboardDropdowns();
  initBookingActions();
  initTableTabs();
});

/* 1. Sidebar Collapse & Mobile Drawer */
function initDashboardSidebar() {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        sidebar.classList.toggle('mobile-open');
      } else {
        sidebar.classList.toggle('collapsed');
      }
    });
  }

  // Close sidebar on mobile when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 992 && sidebar && sidebar.classList.contains('mobile-open')) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    }
  });
}

/* 2. Topbar Dropdowns (Profile, Notifications) */
function initDashboardDropdowns() {
  document.querySelectorAll('.dropdown-toggle-custom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.dropdown-custom');
      const menu = parent?.querySelector('.dropdown-menu-custom');

      // Close other open dropdowns
      document.querySelectorAll('.dropdown-menu-custom.show').forEach(m => {
        if (m !== menu) m.classList.remove('show');
      });

      if (menu) {
        menu.classList.toggle('show');
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu-custom.show').forEach(m => {
      m.classList.remove('show');
    });
  });
}

/* 3. Booking Management: Cancel & Reschedule Modals */
function initBookingActions() {
  // Cancel Booking
  document.querySelectorAll('[data-action="cancel-booking"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const row = btn.closest('tr') || btn.closest('.booking-item-card');
      const classTitle = row?.querySelector('.class-title-text')?.innerText || 'Class Session';

      if (confirm(`Are you sure you want to cancel your booking for "${classTitle}"? Your credit will be refunded to your active membership.`)) {
        if (row) {
          row.style.opacity = '0.5';
          const badge = row.querySelector('.status-pill');
          if (badge) {
            badge.className = 'status-pill status-cancelled';
            badge.innerText = 'Cancelled';
          }
          btn.style.display = 'none';
        }
        if (window.showToast) {
          window.showToast('Session cancelled. 1 Class credit has been refunded.');
        }
      }
    });
  });

  // Reschedule Booking
  document.querySelectorAll('[data-action="reschedule-booking"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const row = btn.closest('tr') || btn.closest('.booking-item-card');
      const classTitle = row?.querySelector('.class-title-text')?.innerText || 'Class Session';
      
      const newTime = prompt(`Reschedule "${classTitle}" to another slot (e.g., Tomorrow at 09:00 AM):`, 'Tomorrow, 09:00 AM');
      if (newTime) {
        const timeEl = row?.querySelector('.session-time-text');
        if (timeEl) timeEl.innerText = newTime;
        if (window.showToast) {
          window.showToast(`Booking rescheduled to ${newTime}.`);
        }
      }
    });
  });

  // Download Invoice
  document.querySelectorAll('[data-action="download-invoice"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const invNum = btn.getAttribute('data-invoice') || 'INV-2026-089';
      if (window.showToast) {
        window.showToast(`Generating ${invNum}.pdf receipt... Download started.`);
      }
    });
  });
}

/* 4. Table Tabs (e.g. Upcoming vs Past Bookings) */
function initTableTabs() {
  document.querySelectorAll('.table-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.table-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');
      document.querySelectorAll('.tab-content-panel').forEach(p => {
        if (p.getAttribute('data-panel') === target) {
          p.style.display = 'block';
        } else {
          p.style.display = 'none';
        }
      });
    });
  });
}
