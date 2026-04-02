document.addEventListener('DOMContentLoaded', () => {

  const CURRENT_USER_KEY = 'currentUser';

  /* =========================
        AUTH CHECK
  ========================= */

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

  /* =========================
        LOAD APPOINTMENTS FIRST
  ========================= */

  const appointments =
    JSON.parse(localStorage.getItem('health-appointments')) || [];

  const pendingCount =
    appointments.filter(a => a.status === 'pending').length;

  /* =========================
        NAVBAR AUTH STATE
  ========================= */

  const authArea = document.getElementById('auth-area');

  if (authArea) {

    const name =
      currentUser.firstName ||
      (currentUser.fullname ? currentUser.fullname.split(' ')[0] : null) ||
      currentUser.email.split('@')[0];

    const role = currentUser.role || 'user';

    authArea.innerHTML = `
      <div class="d-flex align-items-center gap-3">

        <!-- 🔔 Notification Bell -->
        <div class="notification-bell position-relative">
          <i class="fa-solid fa-bell fs-5"></i>
          ${pendingCount > 0 ? `<span class="notif-badge">${pendingCount}</span>` : ''}
        </div>

        <!-- 👤 User Dropdown -->
        <div class="dropdown">
          <button class="btn user-btn dropdown-toggle" data-bs-toggle="dropdown">
            👤 ${name}
            ${role === 'admin' ? '<span class="admin-badge">ADMIN</span>' : ''}
          </button>

          <ul class="dropdown-menu dropdown-menu-end shadow">
            <li class="dropdown-item-text small text-muted">
              ${currentUser.email}
            </li>

            <li><hr class="dropdown-divider"></li>

            ${
              role === 'admin'
                ? `<li><a class="dropdown-item text-success" href="admin.html">⚙️ Admin Dashboard</a></li>`
                : ''
            }

            <li>
              <button class="dropdown-item text-danger" id="logout-btn">
                🚪 Logout
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

  /* =========================
        UPCOMING APPOINTMENT
  ========================= */

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