const KEY = 'health-appointments';

export function getAppointments() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveAppointments(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function addAppointment(appointment) {
    const appointments = getAppointments();
    appointments.push(appointment);
    saveAppointments(appointments);
}

export function deleteAppointment(index) {
    const appointments = getAppointments();
    appointments.splice(index, 1);
    saveAppointments(appointments);
}