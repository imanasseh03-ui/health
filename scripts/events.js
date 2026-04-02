import { addAppointment, deleteAppointment, updateAppointment, updateStatus } from "./storage.js";
import { renderAppointments } from "./ui.js";

export function setupEvents(modal, toast) {

  const form = document.getElementById('appointment-form');
  const bookBtn = document.querySelector('.js-book-now-btn');
  const toastMessage = document.getElementById('toast-message');

  const CURRENT_USER_KEY = 'currentUser';

  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const userName =
    currentUser.firstName ||
    (currentUser.fullname ? currentUser.fullname.split(' ')[0] : '') ||
    currentUser.email.split('@')[0];

  if (!form || !bookBtn || !toastMessage) {
    console.log("missing elements: {form, bookBtn, toastMessage}");
    return;
  }

  const isAdmin = currentUser.role === 'admin';

  // 👉 OPEN MODAL
  bookBtn.addEventListener('click', () => modal.show());

  // 👉 SUBMIT FORM
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const patientInput = document.getElementById('patient-name');

    let patientName;

    //Admin booking
    if (isAdmin) {
      if (!patientInput || patientInput.value.trim()) {
        toastMessage.textContent = " Please enter patient name";
        toast.show();
        return;
      }
      patientName = patientInput.value.trim();
    } else {
      //Normal user
      patientName =
        currentUser.firstName ||
        (currentUser.fullname 
          ? currentUser.fullname.split(' ')[0] 
          : currentUser.email.split('@')[0]);
        
    }

    const appointment = {
      name: userName,
      email: currentUser.email,
      service: document.getElementById('service').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      doctor: document.getElementById('doctor').value,
      status: "pending"
    };

    addAppointment(appointment);

    toastMessage.textContent = `✅ ${appointment.name} booked successfully`;
    toast.show();

    form.reset();
    modal.hide();

    renderAppointments();
  });

  // ✅ HANDLE ALL BUTTONS
  document.addEventListener('click', (e) => {

    const button = e.target.closest('button');
    if (!button) return;

    const index = button.dataset.index;
    if (index === undefined) return;

    // 👉 DELETE
    if (button.classList.contains('delete-btn') && isAdmin) {
      deleteAppointment(index);
      toastMessage.textContent = "Appointment deleted";
      toast.show();
      renderAppointments();
    }

    // 👉 STATUS
    if (button.classList.contains('status-btn') && isAdmin) {
      updateStatus(index);
      toastMessage.textContent = "🔄 Status updated";
      toast.show();
      renderAppointments();
    }

    // 👉 EDIT
    if (button.classList.contains('edit-btn') && isAdmin) {
      const newDate = prompt('Enter new date:');
      const newTime = prompt('Enter new time:');

      if (newDate || newTime) {
        updateAppointment(index, {
          ...(newDate && { date: newDate }),
          ...(newTime && { time: newTime })
        });

        toastMessage.textContent = "✏️ Appointment updated";
        toast.show();

        renderAppointments();
      }
    }

  });

}