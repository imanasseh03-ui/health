import { renderAppointments } from "./ui.js";
import { setupEvents } from "./events.js";

document.addEventListener('DOMContentLoaded', () => {

  const modalElement = document.getElementById('appointmentModal');
  const toastElement = document.getElementById('appointmentToast');

  // Guard clause
  if (!modalElement || !toastElement) return;

  const modal = new bootstrap.Modal(modalElement);
  const toast = new bootstrap.Toast(toastElement);

  // Load UI
  renderAppointments();

  // Setup all events
  setupEvents(modal, toast);

});