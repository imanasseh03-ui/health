import { getAppointments } from "./storage.js";
import { getStatusColor } from "./utils.js";

export function renderAppointments() {
    const list = document.getElementById('appointments-list');
    const emptyState = document.getElementById('empty-state');

    let appointments = getAppointments();

    if (appointments.length === 0) {
        list.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    list.innerHTML = appointments.map((app, index) => `
        <div class="col-md-6 mb-6">
            <div class="card shadow-sm p-3">
                <div class="card-body">
                

                      <div class="d-flex justify-content-between">
                        <h5 class="text-success">${app.service}</h5>
                        <span class="badge bg-${getStatusColor(app.status)}">
                        ${app.status}
                        </span>
                    </div>

                    <p><strong>Patient:</strong> ${app.fullName}</p>
          <p><strong>Gender:</strong> ${app.gender}</p>
          <p><strong>Doctor:</strong> ${app.doctor}</p>
          <p><strong>Date:</strong> ${app.date}</p>
          <p><strong>Time:</strong> ${app.time}</p>

          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  `).join('');
}