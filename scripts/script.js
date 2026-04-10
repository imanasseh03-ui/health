document.addEventListener('DOMContentLoaded', () => {
  const CURRENT_USER_KEY = 'currentUser';

  let currentUser;

  try {
    currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch (e) {
    currentUser = null;
  }

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const appointments =
    JSON.parse(localStorage.getItem('health-appointments')) || [];
  const accountName =
    currentUser.fullname ||
    currentUser.firstName ||
    currentUser.email.split('@')[0];
  const role = currentUser.role || 'user';
  const visibleAppointments = role === 'admin'
    ? appointments
    : appointments.filter((appointment) => appointment.name === accountName);
  const pendingAppointments =
    visibleAppointments.filter((appointment) => appointment.status === 'pending');

  const pendingCount =
    pendingAppointments.length;

  const authArea = document.getElementById('auth-area');

  if (authArea) {
    const name =
      currentUser.firstName ||
      (currentUser.fullname ? currentUser.fullname.split(' ')[0] : null) ||
      currentUser.email.split('@')[0];

    authArea.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <div class="notification-bell position-relative dropdown">
          <button
            class="btn notification-toggle dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fa-solid fa-bell fs-5"></i>
          </button>
          ${pendingCount > 0 ? `<span class="notif-badge">${pendingCount}</span>` : ''}
          <ul class="dropdown-menu dropdown-menu-end shadow" style="min-width: 300px;">
            <li class="dropdown-header">Notifications</li>
            <li><hr class="dropdown-divider"></li>
            ${pendingCount > 0 ? pendingAppointments.map((appt) => `
              <li class="dropdown-item">
                <strong>${appt.service}</strong><br>
                <small>${appt.name} - ${appt.date} at ${appt.time}</small>
              </li>
            `).join('') : '<li class="dropdown-item text-muted">No new notifications</li>'}
          </ul>
        </div>

        <div class="dropdown">
          <button
            class="btn user-btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            ${name}
            ${role === 'admin' ? '<span class="admin-badge">ADMIN</span>' : ''}
          </button>

          <ul class="dropdown-menu dropdown-menu-end shadow">
            <li class="dropdown-item-text small text-muted">
              ${currentUser.email}
            </li>

            <li><hr class="dropdown-divider"></li>

            ${
              role === 'admin'
                ? '<li><a class="dropdown-item text-success" href="admin.html">Admin Dashboard</a></li>'
                : ''
            }

            <li>
              <button class="dropdown-item text-danger" id="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    `;

    authArea.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((toggle) => {
      bootstrap.Dropdown.getOrCreateInstance(toggle);
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.location.href = 'login.html';
    });
  }

  const appointmentEl = document.getElementById('next-appointment');

  if (appointmentEl) {
    if (visibleAppointments.length > 0) {
      const next = visibleAppointments[visibleAppointments.length - 1];

      appointmentEl.textContent =
        `${next.service} with ${next.doctor} on ${next.date} at ${next.time}`;
    } else {
      appointmentEl.textContent = 'No upcoming appointments';
    }
  }

  const searchInput = document.getElementById('search-input');
  const searchButton = document.querySelector('.js-search-btn');
  const serviceCards = Array.from(document.querySelectorAll('[data-service]'));
  const servicesSection = document.getElementById('services');

  const runServiceSearch = () => {
    if (!searchInput || serviceCards.length === 0) return;

    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      serviceCards.forEach((card) => {
        card.classList.remove('service-match', 'service-dim');
      });
      return;
    }

    let firstMatch = null;

    serviceCards.forEach((card) => {
      const haystack = card.dataset.service || '';
      const isMatch = haystack.includes(query);

      card.classList.toggle('service-match', isMatch);
      card.classList.toggle('service-dim', !isMatch);

      if (!firstMatch && isMatch) {
        firstMatch = card;
      }
    });

    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (firstMatch) {
      setTimeout(() => {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 180);
    }
  };

  if (searchButton) {
    searchButton.addEventListener('click', runServiceSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        runServiceSearch();
      }
    });
  }
});
