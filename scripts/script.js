document.addEventListener('DOMContentLoaded', () => {
  const CURRENT_USER_KEY = 'currentUser';
  const navbarCollapse = document.getElementById('navbarNav');
  const navLinks = Array.from(document.querySelectorAll('.navbar .nav-link'));

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
  const storedNotifications =
    JSON.parse(localStorage.getItem('health_notifications')) || [];
  const accountName =
    currentUser.fullname ||
    currentUser.firstName ||
    currentUser.email.split('@')[0];
  const role = currentUser.role || 'user';
  const visibleAppointments = role === 'admin'
    ? appointments
    : appointments.filter((appointment) => appointment.email === currentUser.email);
  const pendingAppointments =
    visibleAppointments.filter((appointment) => appointment.status === 'pending');
  const adminNotifications = role === 'admin'
    ? storedNotifications.filter((notification) => notification.audience === 'admin')
    : [];

  const notificationItems = [
    ...adminNotifications.map((notification) => ({
      title: notification.title,
      detail: notification.detail,
      createdAt: notification.createdAt || ''
    })),
    ...pendingAppointments.map((appointment) => ({
      title: `${appointment.service} appointment pending`,
      detail: `${appointment.date} at ${appointment.time}${appointment.doctor ? ` with ${appointment.doctor}` : ''}`,
      createdAt: `${appointment.date}T${appointment.time || '00:00'}`
    }))
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const pendingCount =
    notificationItems.length;

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
            data-dropdown-toggle="notifications"
            aria-expanded="false"
          >
            <i class="fa-solid fa-bell fs-5"></i>
          </button>
          ${pendingCount > 0 ? `<span class="notif-badge">${pendingCount}</span>` : ''}
          <ul class="dropdown-menu dropdown-menu-end shadow" style="min-width: 300px;">
            <li class="dropdown-header">Notifications</li>
            <li><hr class="dropdown-divider"></li>
            ${pendingCount > 0 ? notificationItems.map((notification) => `
              <li class="dropdown-item">
                <strong>${notification.title}</strong><br>
                <small>${notification.detail}</small>
              </li>
            `).join('') : '<li class="dropdown-item text-muted">No notifications yet</li>'}
          </ul>
        </div>

        <div class="dropdown">
          <button
            class="btn user-btn dropdown-toggle"
            type="button"
            data-dropdown-toggle="user-menu"
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

    const dropdownToggles = Array.from(authArea.querySelectorAll('[data-dropdown-toggle]'));
    const closeAuthDropdowns = () => {
      authArea.querySelectorAll('.dropdown-menu').forEach((menu) => {
        menu.classList.remove('show');
      });

      dropdownToggles.forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    };

    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const dropdown = toggle.closest('.dropdown');
        const menu = dropdown?.querySelector('.dropdown-menu');
        if (!menu) return;

        const shouldOpen = !menu.classList.contains('show');
        closeAuthDropdowns();

        if (shouldOpen) {
          menu.classList.add('show');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!authArea.contains(event.target)) {
        closeAuthDropdowns();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAuthDropdowns();
      }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.location.href = 'login.html';
    });
  }

  const appointmentEl = document.getElementById('next-appointment');

  if (appointmentEl) {
    if (visibleAppointments.length > 0) {
      const sortedAppointments = [...visibleAppointments].sort((a, b) =>{
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
      })
      const next = sortedAppointments[0];

      appointmentEl.textContent =
        `${next.service}${next.doctor ? ` with ${next.doctor}` : ''} on ${next.date} at ${next.time}`;
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

  const closeNavbarMenu = () => {
    if (!navbarCollapse || !navbarCollapse.classList.contains('show')) return;

    if (window.bootstrap && navbarCollapse) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      if (!targetId || !targetId.startsWith('#')) return;

      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      event.preventDefault();
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeNavbarMenu();
    });
  });

  const setActiveNavLink = () => {
    if (navLinks.length === 0) return;

    const scrollPosition = window.scrollY + 140;
    let activeId = '#top';

    navLinks.forEach((link) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const section = document.querySelector(targetId);
      if (!section) return;

      if (scrollPosition >= section.offsetTop) {
        activeId = targetId;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === activeId);
    });
  };

  window.addEventListener('scroll', setActiveNavLink, { passive: true });
  setActiveNavLink();
});
