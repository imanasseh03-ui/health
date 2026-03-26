const KEY = 'health-appointments';

export function getAppointments() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveAppointments(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function addAppointment(appointment) {
    const appointments = getAppointments();
    appointments.push({
        ...appointment,
        status: 'pending' // default status
    });
    saveAppointments(appointments);
}

export function deleteAppointment(index) {
    const appointments = getAppointments();
    appointments.splice(index, 1);
    saveAppointments(appointments);
}

export function updateAppointment(index, updates) {
    const appointments = getAppointments();

    appointments[index] = {
        ...appointments[index],
        ...updates
    };

    saveAppointments(appointments);
}

// 🔁 Cycle status (Pending → Confirmed → Completed)
export function updateStatus(index) {
    const appointments = getAppointments();

    const current = appointments[index].status;

    if (current === 'pending') {
        appointments[index].status = 'confirmed';
    } else if (current === 'confirmed') {
        appointments[index].status = 'completed';
    } else {
        appointments[index].status = 'pending';
    }

    saveAppointments(appointments);
}