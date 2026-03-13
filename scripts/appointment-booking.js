document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     APPOINTMENT BOOKING MODAL
  ========================= */

  const bookBtn = document.querySelector('.js-book-now-btn');
  const appointmentForm = document.querySelector('#appointment-form');
  const modalElement = document.getElementById('appointmentModal');

  const toastElement = document.getElementById('appointmentToast');
  const toastMessage = document.getElementById('toast-message');

  if (!bookBtn || !appointmentForm || !modalElement) return;

  const modal = new bootstrap.Modal(modalElement);
  const toast = new bootstrap.Toast(toastElement);

  // Open modal
  bookBtn.addEventListener('click', () => {
    modal.show();
  });

  // Handle form submission
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

    // Get logged-in user
    const currentUser = JSON.parse(localStorage.getItem('health_current_user'));

    let firstName = fullName.split(' ')[0];

    if (currentUser) {
      firstName =
        currentUser.firstName ||
        (currentUser.fullname ? currentUser.fullname.split(' ')[0] : firstName);
    }

    // Show toast notification
    toastMessage.textContent = `✅ ${firstName}, your ${service} appointment is booked for ${date}.`;
    toast.show();

    // Reset form
    appointmentForm.reset();

    // Close modal after 2 seconds
    setTimeout(() => {
      modal.hide();
    }, 2000);

  });

});