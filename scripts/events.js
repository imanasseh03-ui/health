import { addAppointment, deleteAppointment, updateAppointment, updateStatus } from "./storage.js";
import { renderAppointments } from "./ui.js";

export function setupEvents(modal, toast){
  

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

  const isAdmin = currentUser?.role === 'admin';
  // 👉 OPEN MODAL
  bookBtn.addEventListener('click', () => modal.show());

  // 👉 SUBMIT FORM
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let patientName;

    //Admin booking
    if (isAdmin) {
      const patientSelect = document.getElementById('patient-select');
      if (!patientSelect || !patientSelect.value) {
        toastMessage.textContent = "Please select a patient";
        toast.show();
        return;
      }
      patientName = patientSelect.value;
    } else {
      //Normal user
      patientName = currentUser.fullname;
    }

    const appointment = {
      name: patientName,
      email: document.getElementById('email').value,
      service: document.getElementById('service').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      doctor: document.getElementById('doctor').value,
      status: "pending"
    };

    const emailInput = document.getElementById('email');
    const serviceInput = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const doctorInput = document.getElementById('doctor');

    if (!emailInput.value || !serviceInput.value || !dateInput.value || !timeInput.value || !doctorInput.value) { console.log("missing form inputs"); return; }

    addAppointment(appointment);

    toastMessage.textContent = `✅ Appointment for ${appointment.name} booked successfully`;
    toast.show();

    form.reset();
    modal.hide();

    renderAppointments();
  });

  // ✅ HANDLE ALL BUTTONS
  document.addEventListener('click', (e) => {

    const button = e.target.closest('button');
    if (!button) return;

    const index = Number(button.dataset.index);
    if (isNaN(index)) return;

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
};