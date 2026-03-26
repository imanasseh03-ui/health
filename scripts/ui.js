import { getAppointments } from "./storage.js";
import { getStatusColor } from "./utils.js";

export function renderAppointments() {
    const list = document.getElementById('appointments-list');
    const emptyState = document.getElementById('empty-state');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let appointments = getAppointments();

    if (appointments.length === 0) {
        list.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    list.innerHTML = appointments.map((app, index) => `
        <div class="card shadow-sm border-0 rounded-3 mb-3">
            <div class="card-body">

                <!-- Top row -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="text-success mb-0">${app.service}</h5>
                    <span class="badge bg-${getStatusColor(app.status)} px-3 py-2">
                        ${app.status || 'Pending'}
                    </span>
                </div>

                <!-- Info -->
                <p class="mb-1"><strong>Patient:</strong> ${app.name}</p>
                <p class="mb-1"><strong>Doctor:</strong> ${app.doctor}</p>
                <p class="mb-1"><strong>Date:</strong> ${app.date}</p>
                <p class="mb-2"><strong>Time:</strong> ${app.time}</p>

                ${
                  currentUser?.role === 'admin' ? `
                    <!-- Admin Controls -->
                    <div class="d-flex flex-wrap gap-2 mt-3">
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-index="${index}">
                            ✏️ Edit
                        </button>

                        <button class="btn btn-sm btn-outline-warning status-btn" data-index="${index}">
                            🔄 Status
                        </button>

                        <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">
                            🗑 Delete
                        </button>
                    </div>
                  ` : `
                    <!-- User View -->
                    <div class="mt-3 text-muted small">
                        You can view your appointment status only
                    </div>
                  `
                }

            </div>
        </div>
    `).join('');
}