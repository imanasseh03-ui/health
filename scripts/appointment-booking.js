import { renderAppointments } from "./ui.js";
import { setupEvents } from "./events.js";

document.addEventListener('DOMContentLoaded', () => {

  const modalElement = document.getElementById('appointmentModal');
  const toastElement = document.getElementById
  ('appointmentToast');

  const CURRENT_USER_KEY = 'currentUser';
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

  const userName = 
  currentUser.firstName ||
  (currentUser.fullname ? currentUser.fullname.split(' ')[0] : '') || currentUser.email.split('@')[0];



  // Guard clause
  if (!modalElement || !toastElement) return;

  const modal = new bootstrap.Modal(modalElement);
  const toast = new bootstrap.Toast(toastElement);

  // Load UI
  renderAppointments();

  // Setup all events
  setupEvents(modal, toast);

});