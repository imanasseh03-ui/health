import { renderAppointments } from "./ui.js";
import { setupEvents } from "./events.js";

document.addEventListener('DOMContentLoaded', () => {
  const modalElement = document.getElementById('appointmentModal');
  const toastElement = document.getElementById('appointmentToast');
  const emailField = document.getElementById('email');
  const emailGroup = document.getElementById('email-group');
  const accountSummary = document.getElementById('account-summary');
  const accountName = document.getElementById('account-name');
  const accountEmail = document.getElementById('account-email');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  if (!modalElement || !toastElement) return;

  const modal = new bootstrap.Modal(modalElement);
  const toast = new bootstrap.Toast(toastElement);

  renderAppointments();
  setupEvents(modal, toast);

  const role = currentUser.role || 'user';

  if (role === 'admin') {
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
