/**
 * PRANA YOGA & MEDITATION STUDIO — ADMIN DASHBOARD JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initTableSearch();
  initStatusFilter();
  initCheckInAction();
  initAdminModals();
  initExportAction();
});

/* 1. Real-time Table Search */
function initTableSearch() {
  document.querySelectorAll('[data-table-search]').forEach(input => {
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      const targetTableId = input.getAttribute('data-table-search');
      const table = document.getElementById(targetTableId);
      if (!table) return;

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* 2. Status Filter */
function initStatusFilter() {
  document.querySelectorAll('[data-status-filter]').forEach(select => {
    select.addEventListener('change', () => {
      const filter = select.value.toLowerCase();
      const targetTableId = select.getAttribute('data-status-filter');
      const table = document.getElementById(targetTableId);
      if (!table) return;

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const statusPill = row.querySelector('.status-pill');
        if (!statusPill) return;

        const statusText = statusPill.innerText.toLowerCase();
        if (filter === 'all' || statusText.includes(filter)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* 3. Check-In Toggle */
function initCheckInAction() {
  document.querySelectorAll('[data-action="checkin-toggle"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const isChecked = btn.classList.contains('btn-primary');
      if (isChecked) {
        btn.className = 'btn btn-outline-dark btn-sm';
        btn.innerHTML = '<i class="bi bi-circle"></i> Check In';
        if (window.showToast) window.showToast('Member check-in reversed.');
      } else {
        btn.className = 'btn btn-primary btn-sm';
        btn.innerHTML = '<i class="bi bi-check2-circle"></i> Checked In';
        if (window.showToast) window.showToast('Member successfully checked in!');
      }
    });
  });
}

/* 4. Admin Modals (Add Member, Add Class, etc.) */
function initAdminModals() {
  // Modal open triggers
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-open');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Modal close triggers
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop-custom');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Backdrop click to close
  document.querySelectorAll('.modal-backdrop-custom').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Form submit hooks
  document.querySelectorAll('form[data-admin-action]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const action = form.getAttribute('data-admin-action');
      const modal = form.closest('.modal-backdrop-custom');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
      form.reset();
      if (window.showToast) {
        window.showToast(`Success: ${action} recorded in studio database (Demo State).`);
      }
    });
  });
}

/* 5. CSV Export Simulation */
function initExportAction() {
  document.querySelectorAll('[data-action="export-csv"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-export-name') || 'report';
      if (window.showToast) {
        window.showToast(`Generating ${name}_${new Date().toISOString().split('T')[0]}.csv... Export completed!`);
      }
    });
  });
}
