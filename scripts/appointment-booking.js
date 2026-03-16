document.addEventListener('DOMContentLoaded', () => {

  // Elements
  const bookBtn = document.querySelector('.js-book-now-btn');
  const appointmentForm = document.querySelector('#appointment-form');
  const modalElement = document.getElementById('appointmentModal');
  const toastElement = document.getElementById('appointmentToast');
  const toastMessage = document.getElementById('toast-message');
  const appointmentsList = document.getElementById('appointments-list');

  if (!bookBtn || !appointmentForm || !modalElement || !appointmentsList) return;

  const modal = new bootstrap.Modal(modalElement);
  const toast = new bootstrap.Toast(toastElement);

  // Show modal
  bookBtn.addEventListener('click', () => modal.show());

  // Function to render appointments
  function renderAppointments() {
    let appointments = JSON.parse(localStorage.getItem('health_appointments')) || [];
    if (appointments.length === 0) {
      appointmentsList.innerHTML = '<p class="text-center fw-bold">No appointments booked yet.</p>';
    } else {
      appointmentsList.innerHTML = appointments.map((app, index) => `
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${app.service}</h5>
              <p class="card-text"><strong>Patient:</strong> ${app.fullName}</p>
              <p class="card-text"><strong>Email:</strong> ${app.email}</p>
              <p class="card-text"><strong>Date:</strong> ${app.date}</p>
              <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
            </div>
          </div>
        </div>
      `).join('');

      // Add delete functionality
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = e.target.getAttribute('data-index');
          appointments.splice(idx, 1);
          localStorage.setItem('health_appointments', JSON.stringify(appointments));
          renderAppointments();
        });
      });
    }
  }

  // Initial render
  renderAppointments();

  // Handle booking
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.querySelector('#full-name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const service = document.querySelector('#service').value;
    const date = document.querySelector('#date').value;

    if (!fullName || !email || !service || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    // Save to localStorage
    const appointment = { fullName, email, service, date };
    let appointments = JSON.parse(localStorage.getItem('health_appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('health_appointments', JSON.stringify(appointments));

    // Show toast
    toastMessage.textContent = `✅ ${fullName.split(' ')[0]}, your ${service} appointment is booked for ${date}.`;
    toast.show();

    // Close modal and reset form
    appointmentForm.reset();
    setTimeout(() => modal.hide(), 2000);

    // Re-render appointments
    renderAppointments();
  });

  const searchInput = document.getElementById('search-appointments');
  const filterService = document.getElementById('filter-service');
  const sortDate = document.getElementById('sort-date');
  const clearBtn = document.getElementById('clear-appointments');

  function renderappointments() {
    
    let appointments = JSON.parse(localStorage.getItem('health_appointments')) || [];

    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterService.value;
    const sortValue = sortData.vslue;

    /* SEARCH */

    if (searchValue) {
      appointments = appointments.filter(app =>
        app.fullName.toLowerCase().includes(searchValue)
      );
    }

    /* FILTER */

    if (filterValue !== "all") {
      appointments = appointments.filter(app =>
        app.service === filterValue
      );
    }

    /* SORT */

    if (sortValue === "newest") {
      appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    if (sortValue === "oldest") {
      appointment.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    /* DISPLAY */

    if (appointments.length === 0) {
      appointmentsList.innerHTML =
      '<p class="text-center fw-bold">No appointments found.</p>';
      return;
    }

    appointmentList.innerHTML = appointments.map((app, index) => `

    <div class="col-md-6">
    <div class="card shadow-sm p-3">
    <div class=" class-body">

    <h5 class="card-title text-success">
          ${app.service}
        </h5>

        <p><strong>Patient:</strong> ${app.fullName}</p>
        <p><strong>Email:</strong> ${app.email}</p>
        <p><strong>Date:</strong> ${app.date}</p>

        <button 
          class="btn btn-sm btn-danger delete-btn"
          data-index="${index}">
          Delete
        </button>

      </div>
    </div>
  </div>
    
    `).join('');

    /* DELETE  BUTTON*/

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.dataset.index;

        let appointments = 
        JSON.parse(localStorage.getItem('health_appointments')) || [];

        appointments.solice(idx, 1);

        localStorage.setItem(
          'health_appointments',
          JSON.stringify(appointments)
        );

        renderAppointments();
      });
    });

  }

  searchInput.addEventListener('input', renderAppointments);
  filterService.addEventListener('change', renderApointments);
  sortDate.addEventListener('change', renderAppointments);

  /* CLEAR ALL */

  clearBtn.addEventListener('click', () => {
    if (confirm("Delete all appointments?")) {
      localStorage.removeItem('health_appointments');
      renderAppointments();
    }
  });

});