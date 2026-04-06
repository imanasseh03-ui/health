import { getAppointments } from "./storage.js";
import { getStatusColor } from "./utils.js";

export function renderAppointments() {
  const list = document.getElementById('appointments-list');
  const emptyState = document.getElementById('empty-state');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  let appointments = getAppointments();

  if (currentUser?.role !== 'admin') {
    appointments = appointments.filter((app) => app.name === currentUser.fullname);
  }

  if (appointments.length === 0) {
    list.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  if (currentUser?.role === 'admin') {
    const grouped = appointments.reduce((acc, app, index) => {
      if (!acc[app.name]) acc[app.name] = [];
      acc[app.name].push({ ...app, originalIndex: index });
      return acc;
    }, {});

    list.innerHTML = Object.keys(grouped).map((patientName) => `
      <div class="patient-section mb-4">
        <h4 class="text-primary mb-3">${patientName}'s Appointments</h4>
        ${grouped[patientName].map(({ originalIndex, ...app }) => `
          <div class="card shadow-sm border-0 rounded-3 mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="text-success mb-0">${app.service}</h5>
                <span class="badge bg-${getStatusColor(app.status)} px-3 py-2">
                  ${app.status || 'Pending'}
                </span>
              </div>
              <p class="mb-1"><strong>Doctor:</strong> ${app.doctor}</p>
              <p class="mb-1"><strong>Date:</strong> ${app.date}</p>
              <p class="mb-2"><strong>Time:</strong> ${app.time}</p>
              <div class="d-flex flex-wrap gap-2 mt-3">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-index="${originalIndex}">
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-warning status-btn" data-index="${originalIndex}">
                  Status
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${originalIndex}">
                  Delete
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  } else {
    list.innerHTML = appointments.map((app) => `
      <div class="card shadow-sm border-0 rounded-3 mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="text-success mb-0">${app.service}</h5>
            <span class="badge bg-${getStatusColor(app.status)} px-3 py-2">
              ${app.status || 'Pending'}
            </span>
          </div>
          <p class="mb-1"><strong>Doctor:</strong> ${app.doctor}</p>
          <p class="mb-1"><strong>Date:</strong> ${app.date}</p>
          <p class="mb-2"><strong>Time:</strong> ${app.time}</p>
          <div class="mt-3 text-muted small">
            You can view your appointment status only
          </div>
        </div>
      </div>
    `).join('');
  }
}
