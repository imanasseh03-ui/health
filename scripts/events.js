import { addAppointment, deleteAppointment } from "./storage.js";
import { renderAppointments } from "./ui.js";

export function setupEvents(modal, toast) {
    const form = document.getElementById('appointment-form');
    const bookBtn = document.querySelector('.js-book-now-btn');
    const toastMessage = document.getElementById('toast-message');

    // 👉 OPEN MODAL
    bookBtn.addEventListener('click', () => modal.show());

    // 👉 SUBMIT FORM
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const appointment = {
            fullName: document.getElementById('full-name').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            doctor: document.getElementById('doctor').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            status: "pending"
        };

        addAppointment(appointment);

         toastMessage.textContent = `✅ ${appointment.fullName} booked successfully`;
         toast.show();

         form.reset();
         modal.hide();

        renderAppointments();
    });

    // 👉 DELETE APPOINTMENT
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            deleteAppointment(index);
            renderAppointments();
        }
    });

}