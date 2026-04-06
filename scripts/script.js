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

  const pendingCount =
    appointments.filter((a) => a.status === 'pending').length;

  const authArea = document.getElementById('auth-area');

  if (authArea) {
    const name =
      currentUser.firstName ||
      (currentUser.fullname ? currentUser.fullname.split(' ')[0] : null) ||
      currentUser.email.split('@')[0];

    const role = currentUser.role || 'user';

    authArea.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <div class="notification-bell position-relative dropdown">
          <i class="fa-solid fa-bell fs-5 dropdown-toggle" data-bs-toggle="dropdown" style="cursor: pointer;"></i>
          ${pendingCount > 0 ? `<span class="notif-badge">${pendingCount}</span>` : ''}
          <ul class="dropdown-menu dropdown-menu-end shadow" style="min-width: 300px;">
            <li class="dropdown-header">Notifications</li>
            <li><hr class="dropdown-divider"></li>
            ${pendingCount > 0 ? appointments.filter((a) => a.status === 'pending').map((appt) => `
              <li class="dropdown-item">
                <strong>${appt.service}</strong><br>
                <small>${appt.name} - ${appt.date} at ${appt.time}</small>
              </li>
            `).join('') : '<li class="dropdown-item text-muted">No new notifications</li>'}
          </ul>
        </div>

        <div class="dropdown">
          <button class="btn user-btn dropdown-toggle" data-bs-toggle="dropdown">
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

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.location.href = 'login.html';
    });
  }

  const appointmentEl = document.getElementById('next-appointment');

  if (appointmentEl) {
    if (appointments.length > 0) {
      const next = appointments[appointments.length - 1];

      appointmentEl.textContent =
        `${next.service} with ${next.doctor} on ${next.date} at ${next.time}`;
    } else {
      appointmentEl.textContent = 'No upcoming appointments';
    }
  }
});
