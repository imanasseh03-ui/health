import { addAppointment, deleteAppointment, updateAppointment, updateStatus } from "./storage.js";
import { renderAppointments } from "./ui.js";

export function setupEvents(modal, toast) {
  const form = document.getElementById('appointment-form');
  const bookBtn = document.querySelector('.js-book-now-btn');
  const toastMessage = document.getElementById('toast-message');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  if (!form || !bookBtn || !toastMessage) {
    console.log("Missing elements: form, bookBtn, or toastMessage");
    return;
  }

  const isAdmin = currentUser.role === 'admin';
  const fallbackPatientName =
    currentUser.fullname ||
    currentUser.email?.split('@')[0] ||
    'Patient';
  const refreshAppointmentsView = () => {
    renderAppointments();
    document.dispatchEvent(new CustomEvent('appointments:changed'));
  };

  bookBtn.addEventListener('click', () => modal.show());

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let patientName;

    if (isAdmin) {
      const patientSelect = document.getElementById('patient-select');

      if (!patientSelect || !patientSelect.value) {
        toastMessage.textContent = "Please select a patient";
        toast.show();
        return;
      }

      patientName = patientSelect.value;
    } else {
      patientName = fallbackPatientName;
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

    addAppointment(appointment);

    toastMessage.textContent = `Appointment for ${appointment.name} booked successfully`;
    toast.show();

    form.reset();
    modal.hide();

    refreshAppointmentsView();
  });

  document.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const index = button.dataset.index;
    if (index === undefined) return;

    if (button.classList.contains('delete-btn') && isAdmin) {
      deleteAppointment(index);
      toastMessage.textContent = "Appointment deleted";
      toast.show();
      refreshAppointmentsView();
    }

    if (button.classList.contains('status-btn') && isAdmin) {
      updateStatus(index);
      toastMessage.textContent = "Status updated";
      toast.show();
      refreshAppointmentsView();
    }

    if (button.classList.contains('edit-btn') && isAdmin) {
      const newDate = prompt('Enter new date:');
      const newTime = prompt('Enter new time:');

      if (newDate || newTime) {
        updateAppointment(index, {
          ...(newDate && { date: newDate }),
          ...(newTime && { time: newTime })
        });

        toastMessage.textContent = "Appointment updated";
        toast.show();
        refreshAppointmentsView();
      }
    }
  });
}
