import { renderAppointments } from "./ui.js";
import { setupEvents } from "./events.js";

document.addEventListener('DOMContentLoaded', () => {
  const modalElement = document.getElementById('appointmentModal');
  const toastElement = document.getElementById('appointmentToast');
  const dateField = document.getElementById('date');
  const emailField = document.getElementById('email');
  const emailGroup = document.getElementById('email-group');
  const accountSummary = document.getElementById('account-summary');
  const accountName = document.getElementById('account-name');
  const accountEmail = document.getElementById('account-email');
  const greeting = document.getElementById('dashboard-greeting');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  if (!modalElement || !toastElement) return;

  const modal = new bootstrap.Modal(modalElement);
  const toast = new bootstrap.Toast(toastElement);

  const updateDashboardStats = () => {
    const appointments = JSON.parse(localStorage.getItem('health-appointments')) || [];
    const visibleAppointments = currentUser.role === 'admin'
      ? appointments
      : appointments.filter((appointment) => appointment.name === (currentUser.fullname || currentUser.email.split('@')[0]));

    const totalCount = document.getElementById('total-appointments-count');
    const pendingCount = document.getElementById('pending-appointments-count');
    const completedCount = document.getElementById('completed-appointments-count');

    if (totalCount) {
      totalCount.textContent = String(visibleAppointments.length);
    }

    if (pendingCount) {
      pendingCount.textContent = String(visibleAppointments.filter((appointment) => appointment.status === 'pending').length);
    }

    if (completedCount) {
      completedCount.textContent = String(visibleAppointments.filter((appointment) => appointment.status === 'completed').length);
    }
  };

  if (dateField) {
    dateField.min = new Date().toISOString().split('T')[0];
  }

  renderAppointments();
  setupEvents(modal, toast);
  updateDashboardStats();

  document.addEventListener('appointments:changed', updateDashboardStats);

  const role = currentUser.role || 'user';

  if (role === 'admin') {
    if (greeting) {
      greeting.textContent = 'Admin booking overview';
    }

    document.querySelectorAll('.admin-only').forEach((el) => el.classList.remove('d-none'));

    const patientSelectGroup = document.getElementById('patient-select-group');
    const patientSelect = document.getElementById('patient-select');
    const users = JSON.parse(localStorage.getItem('health_users')) || [];

    if (patientSelectGroup) {
      patientSelectGroup.classList.remove('d-none');
    }

    if (patientSelect) {
      patientSelect.required = true;
    }

    users.forEach((user) => {
      const option = document.createElement('option');
      option.value = user.fullname;
      option.textContent = user.fullname;
      patientSelect.appendChild(option);
    });

    patientSelect.addEventListener('change', () => {
      const selectedName = patientSelect.value;
      const selectedUser = users.find((user) => user.fullname === selectedName);

      if (selectedUser) {
        document.getElementById('email').value = selectedUser.email;
      }
    });
  } else {
    const patientSelectGroup = document.getElementById('patient-select-group');
    const patientSelect = document.getElementById('patient-select');

    if (greeting) {
      greeting.textContent = `Welcome back, ${currentUser.fullname || currentUser.email.split('@')[0]}`;
    }

    if (patientSelectGroup) {
      patientSelectGroup.classList.add('d-none');
    }

    if (emailField) {
      emailField.value = currentUser.email;
    }

    if (patientSelect) {
      patientSelect.required = false;
    }

    if (emailGroup) {
      emailGroup.classList.add('d-none');
    }

    if (accountSummary) {
      accountSummary.classList.remove('d-none');
    }

    if (accountName) {
      accountName.textContent =
        currentUser.fullname ||
        currentUser.firstName ||
        currentUser.email.split('@')[0];
    }

    if (accountEmail) {
      accountEmail.textContent = currentUser.email;
    }
  }
});
