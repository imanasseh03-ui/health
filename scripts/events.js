import { addAppointment, deleteAppointment, updateAppointment, updateStatus } from "./storage.js";
import { renderAppointments } from "./ui.js";

export function setupEvents(modal, toast) {
    const form = document.getElementById('appointment-form');
    const bookBtn = document.querySelector('.js-book-now-btn');
    const toastMessage = document.getElementById('toast-message');

    //IMPORTANT GUARD
    if (!form || !bookBtn || !toastMessage) {
        console.log("missing elements: {form, bookBtn, toastMessage}")
        return;
    }


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

    // ✅ HANDLE ALL BUTTONS (IMPORTANT)
    document.addEventListener('click', (e) => {

        const index = e.target.dataset.index;

     // 👉 DELETE APPOINTMENT
   
        if (e.target.classList.contains('delete-btn')) {
            deleteAppointment(index);
            renderAppointments();
        }
        // 👉 CHANGE STATUS
        if (e.target.classList.contains('status-btn')) {
            updateStatus(index);
            renderAppointments();
        }
        // 👉 EDIT APPOINTMENT
        if (e.target.classList.contains('edit-btn')) {
            const newDate = prompt('Enter new date:');
            const newTime = prompt('Enter new time:');

            if (newDate || newTime) {
                updateAppointment(index, {
                    ...(newDate &&{ date: newDate}),
                    ...(newTime &&{ time: newTime})
            });
                renderAppointments();
            }
        }

    });

}