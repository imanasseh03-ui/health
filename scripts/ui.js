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
        <div class="card shadow-sm p-3">
  <div class="card-body">

    <!-- Top row -->
    <div class="d-flex align-items-center mb-3">
      <h5 class="text-success mb-0 me-1">${app.service}</h5>
      <span class="badge bg-${getStatusColor(app.status)}">
        ${app.status}
      </span>
    </div>

    <!-- Info -->
    <p class="mb-1"><strong>Patient:</strong> ${app.fullName}</p>
    <p class="mb-1"><strong>Doctor:</strong> ${app.doctor}</p>
    <p class="mb-1"><strong>Date:</strong> ${app.date}</p>
    <p class="mb-2"><strong>Time:</strong> ${app.time}</p>

    <!-- Buttons -->
    <div class="d-flex flex-wrap gap-2 mt-3">
      <button class="btn btn-sm btn-primary edit-btn" data-index="${index}">
        Edit
      </button>

      <button class="btn btn-sm btn-warning status-btn me-2" data-index="${index}">
        Change Status
      </button> 

      <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
        Delete
      </button>
    </div>

  </div>
</div>
  `).join('');
}