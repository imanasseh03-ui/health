document.addEventListener('DOMContentLoaded', () => {

  const bookBtn = document.querySelector('.js-book-now-btn');
  const appointmentForm = document.querySelector('#appointment-form');
  const modalElement = document.getElementById('appointmentModal');
  const toastElement = document.getElementById('appointmentToast');
  const toastMessage = document.getElementById('toast-message');
  const appointmentsList = document.getElementById('appointments-list');

  const searchInput = document.getElementById('search-appointment');
  const filterService = document.getElementById('filter-service');
  const sortDate = document.getElementById('sort-date');
  const clearBtn = document.getElementById('clear-appointments');

  if (!bookBtn || !appointmentForm || !modalElement || !appointmentsList) return;

  const modal = new bootstrap.Modal(modalElement);
  const toast = new bootstrap.Toast(toastElement);

  // 👉 STATUS COLOR FUNCTION (GLOBAL)
  function getStatusColor(status) {
    if (status === "pending") return "secondary";
    if (status === "confirmed") return "success";
    if (status === "completed") return "dark";
    return "secondary";
  }

  // 👉 SHOW MODAL
  bookBtn.addEventListener('click', () => modal.show());

  /* =========================
     RENDER APPOINTMENTS
  ========================= */
  function renderAppointments() {

    let appointments = JSON.parse(localStorage.getItem('health_appointments')) || [];

    const searchValue = searchInput?.value.toLowerCase() || "";
    const filterValue = filterService?.value || "all";
    const sortValue = sortDate?.value || "none";

    const emptyState = document.getElementById('empty-state');
    const appointmentsList = document.getElementById('appointments-list');

    // SEARCH
    if (searchValue) {
      appointments = appointments.filter(app =>
        app.fullName.toLowerCase().includes(searchValue)
      );
    }

    // FILTER
    if (filterValue !== "all") {
      appointments = appointments.filter(app =>
        app.service === filterValue
      );
    }

    // SORT
    if (sortValue === "newest") {
      appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortValue === "oldest") {
      appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // EMPTY STATE
    if (appointments.length === 0) {
      appointmentsList.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    } else {
      if (emptyState) emptyState.style.display = "none";
    }

    // DISPLAY
    appointmentsList.innerHTML = appointments.map((app, index) => `
      <div class="col-md-6">
        <div class="card shadow-sm p-3">
          <div class="card-body">

            <div class="d-flex justify-content-between">
              <h5 class="text-success">${app.service}</h5>
              <span class="badge bg-${getStatusColor(app.status)}">
                ${app.status}
              </span>
            </div>

            <p><strong>Patient:</strong> ${app.fullName}</p>
            <p><strong>Doctor:</strong> ${app.doctor}</p>
            <p><strong>Date:</strong> ${app.date}</p>
            <p><strong>Time:</strong> ${app.time}</p>

            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-sm btn-primary edit-btn" data-index="${index}">
                Edit
              </button>

              <button class="btn btn-sm btn-warning status-btn" data-index="${index}">
                Change Status
              </button>

              <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>
    `).join('');

    // 👉 DELETE
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.dataset.index;
        let appointments = JSON.parse(localStorage.getItem('health_appointments')) || [];

        appointments.splice(idx, 1);
        localStorage.setItem('health_appointments', JSON.stringify(appointments));

        renderAppointments();

        function deleteAppointment(index) {
          appointmentsList.children[index].remove();
          updateEmptyState();
        }
      });
    });

    // 👉 CHANGE STATUS
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        let appointments = JSON.parse(localStorage.getItem('health_appointments')) || [];

        const current = appointments[index].status;

        if (current === "pending") {
          appointments[index].status = "confirmed";
        } else if (current === "confirmed") {
          appointments[index].status = "completed";
        } else {
          appointments[index].status = "pending";
        }

        localStorage.setItem('health_appointments', JSON.stringify(appointments));
        renderAppointments();
      });
    });

    // 👉 EDIT
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;

        let appointments = JSON.parse(localStorage.getItem('health_appointments')) || [];

        const newDate = prompt("Enter new date:", appointments[index].date);
        const newTime = prompt("Enter new time:", appointments[index].time);

        if (newDate) appointments[index].date = newDate;
        if (newTime) appointments[index].time = newTime;

        localStorage.setItem('health_appointments', JSON.stringify(appointments));
        renderAppointments();
      });
    });
  }

  renderAppointments();

  /* =========================
     BOOK APPOINTMENT
  ========================= */
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.querySelector('#full-name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const service = document.querySelector('#service').value;
    const date = document.querySelector('#date').value;
    const doctor = document.querySelector('#doctor').value;
    const time = document.querySelector('#time').value;

    if (!fullName || !email || !service || !date || !doctor || !time) {
      alert('Please fill in all fields.');
      return;
    }

    const appointment = {
      fullName,
      email,
      service,
      doctor,
      date,
      time,
      status: "pending"
    };

    let appointments = JSON.parse(localStorage.getItem('health_appointments')) || [];
    appointments.push(appointment);

    // 👉 SAVE
    localStorage.setItem('health_appointments', JSON.stringify(appointments));

    // 👉 TOAST
    toastMessage.textContent =
      `✅ ${fullName.split(' ')[0]}, your ${service} appointment is booked for ${date}`;
    toast.show();

    appointmentForm.reset();
    setTimeout(() => modal.hide(), 1500);

    renderAppointments();
  });

  /* =========================
     EXTRA EVENTS
  ========================= */
  searchInput?.addEventListener('input', renderAppointments);
  filterService?.addEventListener('change', renderAppointments);
  sortDate?.addEventListener('change', renderAppointments);

  clearBtn?.addEventListener('click', () => {
    if (confirm("Delete all appointments?")) {
      localStorage.removeItem('health_appointments');
      renderAppointments();
    }
  });

});