/**
 * PRANA YOGA & MEDITATION STUDIO — MULTI-STEP BOOKING WORKFLOW
 * Interactive 6-step front-end booking flow:
 * Step 1: Select Class
 * Step 2: Select Instructor
 * Step 3: Choose Date
 * Step 4: Select Available Time Slot
 * Step 5: Review & Membership Eligibility
 * Step 6: Confirmation Screen & Calendar Action
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingWorkflow();
});

function initBookingWorkflow() {
  // Inject Booking Modal if not present
  createBookingModal();

  // Booking Data State
  const bookingState = {
    classTitle: 'Vinyasa Flow',
    classDuration: '60 Mins',
    classLevel: 'All Levels',
    instructor: 'Elena Rostova',
    date: new Date().toISOString().split('T')[0],
    slot: '09:00 AM - 10:00 AM',
    room: 'Studio Sanctuary A (Earth Room)',
    membershipStatus: 'Active - 8 Credits Available'
  };

  let currentStep = 1;
  const maxSteps = 6;

  const modal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('closeBookingModal');
  const stepIndicators = document.querySelectorAll('.booking-modal-step');
  const stepContainers = document.querySelectorAll('.booking-step-content');
  const btnPrev = document.getElementById('bookingPrevBtn');
  const btnNext = document.getElementById('bookingNextBtn');

  // Trigger buttons across pages
  document.querySelectorAll('[data-trigger="book-class"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preClass = btn.getAttribute('data-class-name');
      const preInstructor = btn.getAttribute('data-instructor-name');
      if (preClass) bookingState.classTitle = preClass;
      if (preInstructor) bookingState.instructor = preInstructor;

      goToStep(1);
      updateUI();
      openModal();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function openModal() {
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    goToStep(1);
  }

  function goToStep(step) {
    currentStep = step;

    // Update stepper headers
    stepIndicators.forEach(ind => {
      const s = parseInt(ind.getAttribute('data-step'), 10);
      ind.classList.remove('active', 'completed');
      if (s === currentStep) ind.classList.add('active');
      else if (s < currentStep) ind.classList.add('completed');
    });

    // Update step view
    stepContainers.forEach(cont => {
      const s = parseInt(cont.getAttribute('data-step'), 10);
      if (s === currentStep) cont.style.display = 'block';
      else cont.style.display = 'none';
    });

    // Button states
    if (btnPrev && btnNext) {
      if (currentStep === 1) {
        btnPrev.style.display = 'none';
        btnNext.style.display = 'inline-flex';
      } else if (currentStep === 6) {
        btnPrev.style.display = 'none';
        btnNext.style.display = 'none';
      } else {
        btnPrev.style.display = 'inline-flex';
        btnNext.style.display = 'inline-flex';
      }

      if (currentStep === 5) {
        btnNext.innerHTML = '<i class="bi bi-check-circle"></i> Confirm Booking';
      } else if (currentStep < 5) {
        btnNext.innerHTML = 'Continue <i class="bi bi-arrow-right"></i>';
      }
    }

    if (currentStep === 5) {
      renderSummary();
    }
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep < maxSteps) {
        goToStep(currentStep + 1);
      }
    });
  }

  // Interactive selectors inside steps
  // Step 1: Class Selection
  document.querySelectorAll('.book-class-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.book-class-option').forEach(o => o.classList.remove('border-primary-active'));
      opt.classList.add('border-primary-active');
      bookingState.classTitle = opt.getAttribute('data-name');
      bookingState.classDuration = opt.getAttribute('data-duration') || '60 Mins';
      bookingState.classLevel = opt.getAttribute('data-level') || 'All Levels';
    });
  });

  // Step 2: Instructor Selection
  document.querySelectorAll('.book-instructor-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.book-instructor-option').forEach(o => o.classList.remove('border-primary-active'));
      opt.classList.add('border-primary-active');
      bookingState.instructor = opt.getAttribute('data-name');
    });
  });

  // Step 3: Date Picker
  const dateInput = document.getElementById('bookingDateInput');
  if (dateInput) {
    dateInput.value = bookingState.date;
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.addEventListener('change', (e) => {
      bookingState.date = e.target.value;
    });
  }

  // Step 4: Time Slot Selection
  document.querySelectorAll('.booking-slot-card').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.booking-slot-card').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      bookingState.slot = slot.getAttribute('data-slot');
    });
  });

  function renderSummary() {
    const summaryEl = document.getElementById('bookingSummaryDetails');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="background-color: var(--color-surface-tint); padding: 20px; border-radius: var(--border-radius); border: 1px solid var(--color-border); margin-bottom: 16px;">
          <h4 style="margin-bottom: 8px;">${bookingState.classTitle}</h4>
          <p style="font-size: 0.9rem; color: var(--color-black-soft); margin-bottom: 12px;">
            <i class="bi bi-clock me-1"></i> ${bookingState.classDuration} &nbsp;|&nbsp; 
            <i class="bi bi-bar-chart me-1"></i> ${bookingState.classLevel}
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.88rem; padding-top: 12px; border-top: 1px solid var(--color-border-subtle);">
            <div><strong>Instructor:</strong> ${bookingState.instructor}</div>
            <div><strong>Room:</strong> ${bookingState.room}</div>
            <div><strong>Date:</strong> ${bookingState.date}</div>
            <div><strong>Time Slot:</strong> ${bookingState.slot}</div>
          </div>
        </div>
        <div style="padding: 14px 16px; border-radius: var(--border-radius); border: 1px solid var(--color-primary-border); background-color: var(--color-primary-subtle); display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.88rem; font-weight: 600; color: var(--color-primary);"><i class="bi bi-shield-check me-2"></i>Membership Status</span>
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-black);">${bookingState.membershipStatus}</span>
        </div>
      `;
    }

    const confEl = document.getElementById('bookingConfirmationSummary');
    if (confEl) {
      const bookingRef = 'STK-' + Math.floor(100000 + Math.random() * 900000);
      confEl.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background-color: var(--color-primary); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 16px;">
            <i class="bi bi-check-lg"></i>
          </div>
          <h3 style="margin-bottom: 8px;">Session Confirmed!</h3>
          <p style="font-size: 0.95rem; color: var(--color-black-soft); margin-bottom: 16px;">
            Your space has been reserved for <strong>${bookingState.classTitle}</strong> with <strong>${bookingState.instructor}</strong>.
          </p>
          <div style="display: inline-block; padding: 8px 18px; border-radius: var(--border-radius-pill); background-color: var(--color-surface-tint); border: 1px solid var(--color-border); font-size: 0.85rem; font-weight: 600; margin-bottom: 24px;">
            Booking Reference: ${bookingRef}
          </div>
          <div style="background-color: var(--color-surface-tint); padding: 16px; border-radius: var(--border-radius); text-align: left; font-size: 0.88rem; margin-bottom: 24px;">
            <div style="margin-bottom: 6px;"><strong>Date & Time:</strong> ${bookingState.date} at ${bookingState.slot}</div>
            <div style="margin-bottom: 6px;"><strong>Studio Location:</strong> 742 Evergreen Lotus Sanctuary, Studio A</div>
            <div><strong>What to bring:</strong> Yoga mat, refillable water bottle, and comfortable attire.</div>
          </div>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <a href="${(window.location.pathname.includes('/member-dashboard/') || window.location.pathname.includes('\\member-dashboard\\')) ? 'bookings.html' : 'member-dashboard/bookings.html'}" class="btn btn-primary btn-sm">View in Dashboard</a>
            <button type="button" class="btn btn-outline-dark btn-sm" onclick="window.showToast('Calendar invite (.ics) generated!');">
              <i class="bi bi-calendar-plus"></i> Add to Calendar
            </button>
          </div>
        </div>
      `;
    }
  }

  function updateUI() {
    // Sync pre-selected names if any
  }
}

function createBookingModal() {
  if (document.getElementById('bookingModal')) return;

  const isSubdir = window.location.pathname.includes('/member-dashboard/') || 
                   window.location.pathname.includes('/admin-dashboard/') || 
                   window.location.pathname.includes('\\member-dashboard\\') || 
                   window.location.pathname.includes('\\admin-dashboard\\');
  const assetPrefix = isSubdir ? '../' : '';
  const dashLink = isSubdir ? 'bookings.html' : 'member-dashboard/bookings.html';

  const modalHtml = `
    <div id="bookingModal" class="modal-backdrop-custom">
      <div class="modal-dialog-custom" style="max-width: 680px;">
        <div class="modal-header-custom">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--color-primary-subtle); color: var(--color-primary); display: inline-flex; align-items: center; justify-content: center;">
              <i class="bi bi-calendar-heart"></i>
            </span>
            <h4 style="margin: 0; font-size: 1.3rem;">Book a Class</h4>
          </div>
          <button type="button" class="modal-close-btn" id="closeBookingModal">&times;</button>
        </div>

        <div class="modal-body-custom">
          <!-- Stepper header -->
          <div class="booking-stepper">
            <div class="step-item booking-modal-step active" data-step="1">
              <div class="step-circle">1</div>
              <div class="step-label">Class</div>
            </div>
            <div class="step-item booking-modal-step" data-step="2">
              <div class="step-circle">2</div>
              <div class="step-label">Teacher</div>
            </div>
            <div class="step-item booking-modal-step" data-step="3">
              <div class="step-circle">3</div>
              <div class="step-label">Date</div>
            </div>
            <div class="step-item booking-modal-step" data-step="4">
              <div class="step-circle">4</div>
              <div class="step-label">Time</div>
            </div>
            <div class="step-item booking-modal-step" data-step="5">
              <div class="step-circle">5</div>
              <div class="step-label">Review</div>
            </div>
            <div class="step-item booking-modal-step" data-step="6">
              <div class="step-circle">6</div>
              <div class="step-label">Confirm</div>
            </div>
          </div>

          <!-- Step 1: Select Class -->
          <div class="booking-step-content" data-step="1">
            <h5 style="margin-bottom: 12px;">Step 1: Choose Your Class</h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="book-class-option border-primary-active" data-name="Vinyasa Flow" data-duration="60 Mins" data-level="Intermediate" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer;">
                <strong>Vinyasa Flow</strong>
                <div style="font-size: 0.8rem; color: var(--color-black-muted);">Dynamic Movement & Breath</div>
              </div>
              <div class="book-class-option" data-name="Hatha Yoga" data-duration="75 Mins" data-level="Beginner to All" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer;">
                <strong>Hatha Foundation</strong>
                <div style="font-size: 0.8rem; color: var(--color-black-muted);">Alignment & Posture</div>
              </div>
              <div class="book-class-option" data-name="Yin Yoga" data-duration="60 Mins" data-level="All Levels" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer;">
                <strong>Yin Sanctuary</strong>
                <div style="font-size: 0.8rem; color: var(--color-black-muted);">Deep Tissue & Fascia Release</div>
              </div>
              <div class="book-class-option" data-name="Guided Meditation" data-duration="45 Mins" data-level="All Levels" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer;">
                <strong>Guided Meditation</strong>
                <div style="font-size: 0.8rem; color: var(--color-black-muted);">Stillness & Mindful Calm</div>
              </div>
              <div class="book-class-option" data-name="Sound Healing Bath" data-duration="60 Mins" data-level="All Levels" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer;">
                <strong>Sound Healing Bath</strong>
                <div style="font-size: 0.8rem; color: var(--color-black-muted);">Tibetan Bowls & Vibration</div>
              </div>
              <div class="book-class-option" data-name="Ashtanga Primary" data-duration="90 Mins" data-level="Advanced" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer;">
                <strong>Ashtanga Primary</strong>
                <div style="font-size: 0.8rem; color: var(--color-black-muted);">Traditional Mysore Sequence</div>
              </div>
            </div>
          </div>

          <!-- Step 2: Select Instructor -->
          <div class="booking-step-content" data-step="2" style="display: none;">
            <h5 style="margin-bottom: 12px;">Step 2: Choose Instructor</h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="book-instructor-option border-primary-active" data-name="Elena Rostova" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer; display: flex; align-items: center; gap: 10px;">
                <img src="${assetPrefix}assets/images/instructors/elena-rostova.jpg" alt="Elena" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <div>
                  <strong>Elena Rostova</strong>
                  <div style="font-size: 0.75rem; color: var(--color-black-muted);">Senior Vinyasa Master</div>
                </div>
              </div>
              <div class="book-instructor-option" data-name="Marcus Vance" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer; display: flex; align-items: center; gap: 10px;">
                <img src="${assetPrefix}assets/images/instructors/marcus-vance.jpg" alt="Marcus" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <div>
                  <strong>Marcus Vance</strong>
                  <div style="font-size: 0.75rem; color: var(--color-black-muted);">Breathwork & Sound</div>
                </div>
              </div>
              <div class="book-instructor-option" data-name="Priya Sharma" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer; display: flex; align-items: center; gap: 10px;">
                <img src="${assetPrefix}assets/images/instructors/priya-sharma.jpg" alt="Priya" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <div>
                  <strong>Priya Sharma</strong>
                  <div style="font-size: 0.75rem; color: var(--color-black-muted);">Hatha & Meditation</div>
                </div>
              </div>
              <div class="book-instructor-option" data-name="David Chen" style="border: 1px solid var(--color-border); padding: 12px; border-radius: var(--border-radius); cursor: pointer; display: flex; align-items: center; gap: 10px;">
                <img src="${assetPrefix}assets/images/instructors/david-chen.jpg" alt="David" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <div>
                  <strong>David Chen</strong>
                  <div style="font-size: 0.75rem; color: var(--color-black-muted);">Yin & Mobility</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Choose Date -->
          <div class="booking-step-content" data-step="3" style="display: none;">
            <h5 style="margin-bottom: 12px;">Step 3: Select Date</h5>
            <div style="margin-bottom: 16px;">
              <label class="form-label">Session Date</label>
              <input type="date" id="bookingDateInput" class="form-control" style="font-size: 1rem;">
            </div>
            <div style="background-color: var(--color-surface-tint); padding: 14px; border-radius: var(--border-radius); border: 1px solid var(--color-border); font-size: 0.85rem; color: var(--color-black-soft);">
              <i class="bi bi-info-circle me-1"></i> Studio open 7 days a week from 06:30 AM to 08:30 PM.
            </div>
          </div>

          <!-- Step 4: Available Time Slot -->
          <div class="booking-step-content" data-step="4" style="display: none;">
            <h5 style="margin-bottom: 12px;">Step 4: Select Time Slot</h5>
            <p style="font-size: 0.85rem; color: var(--color-black-muted); margin-bottom: 12px;">Showing available spots for selected date.</p>
            <div class="slot-grid">
              <div class="booking-slot-card slot-item selected" data-slot="07:00 AM - 08:00 AM">07:00 AM<small style="display:block; font-size: 0.7rem; font-weight: 400;">4 spots</small></div>
              <div class="booking-slot-card slot-item" data-slot="09:00 AM - 10:00 AM">09:00 AM<small style="display:block; font-size: 0.7rem; font-weight: 400;">8 spots</small></div>
              <div class="booking-slot-card slot-item" data-slot="12:00 PM - 01:00 PM">12:00 PM<small style="display:block; font-size: 0.7rem; font-weight: 400;">2 spots</small></div>
              <div class="booking-slot-card slot-item" data-slot="05:30 PM - 06:30 PM">05:30 PM<small style="display:block; font-size: 0.7rem; font-weight: 400;">6 spots</small></div>
              <div class="booking-slot-card slot-item" data-slot="07:00 PM - 08:00 PM">07:00 PM<small style="display:block; font-size: 0.7rem; font-weight: 400;">1 spot</small></div>
              <div class="slot-item disabled">08:15 PM<small style="display:block; font-size: 0.7rem;">Full</small></div>
            </div>
          </div>

          <!-- Step 5: Review & Membership -->
          <div class="booking-step-content" data-step="5" style="display: none;">
            <h5 style="margin-bottom: 12px;">Step 5: Review Booking Details</h5>
            <div id="bookingSummaryDetails"></div>
            <div style="font-size: 0.8rem; color: var(--color-black-muted); margin-top: 10px;">
              * Free cancellation allowed up to 4 hours before session start.
            </div>
          </div>

          <!-- Step 6: Confirmation Screen -->
          <div class="booking-step-content" data-step="6" style="display: none;">
            <div id="bookingConfirmationSummary"></div>
          </div>
        </div>

        <div class="modal-footer-custom">
          <button type="button" class="btn btn-outline-dark btn-sm" id="bookingPrevBtn" style="display: none;">
            <i class="bi bi-arrow-left"></i> Back
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="bookingNextBtn">
            Continue <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Add CSS style helper for selection
  const style = document.createElement('style');
  style.innerHTML = `
    .border-primary-active {
      border-color: var(--color-primary) !important;
      background-color: var(--color-primary-subtle) !important;
    }
  `;
  document.head.appendChild(style);
}
