document.addEventListener('DOMContentLoaded', () => {

    const CURRENT_USER_KEY = 'currentUser';
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    //protect  page
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    const appointments = JSON.parse(localStorage.getItem('health-appointments')) || [];
    const users = JSON.parse(localStorage.getItem('health_users')) || [];

    // populate patient select
    const patientSelect = document.getElementById('patient-select');
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.fullname;
        option.textContent = user.fullname;
        patientSelect.appendChild(option);
    });

    // handle create appointment form
    const createForm = document.getElementById('create-appointment-form');
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const patientName = patientSelect.value;
        const service = document.getElementById('service-select').value;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;

        if (!patientName || !service || !date || !time) {
            alert('Please fill all fields');
            return;
        }

        const newAppointment = {
            name: patientName,
            service,
            date,
            time,
            status: 'pending'
        };

        appointments.push(newAppointment);
        localStorage.setItem('health-appointments', JSON.stringify(appointments));

        alert('Appointment created successfully!');
        createForm.reset();
        location.reload(); // refresh to update tables
    });

    // stats
    document.getElementById('total-count').textContent = appointments.length;

    document.getElementById('pending-count').textContent = appointments.filter(a => a.status === 'pending').length;

    document.getElementById('completed-count').textContent = appointments.filter(a => a.status === 'completed').length;

    //table
    const table = document.getElementById('admin-table');

    table.innerHTML = appointments.map((appt, index) => {
        const statusColor = appt.status === 'pending' ? '#fff3cd' :
                            appt.status === 'confirmed' ? '#d1ecf1' : '#d4edda';
        return `
    <tr>
      <td>${appt.name}</td>
      <td>${appt.service}</td>
      <td>${appt.date}</td>
      <td>${appt.time}</td>
      <td>
        <select class="form-select status-select" data-index="${index}" style="background-color: ${statusColor};">
          <option value="pending" ${appt.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="confirmed" ${appt.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="completed" ${appt.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
    </tr>
  `;
    }).join('');

    // handle status change
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = e.target.getAttribute('data-index');
            const newStatus = e.target.value;
            appointments[index].status = newStatus;
            localStorage.setItem('health-appointments', JSON.stringify(appointments));
            // update color
            const statusColor = newStatus === 'pending' ? '#fff3cd' :
                                newStatus === 'confirmed' ? '#d1ecf1' : '#d4edda';
            e.target.style.backgroundColor = statusColor;
            // update stats
            document.getElementById('total-count').textContent = appointments.length;
            document.getElementById('pending-count').textContent = appointments.filter(a => a.status === 'pending').length;
            document.getElementById('completed-count').textContent = appointments.filter(a => a.status === 'completed').length;
            // update patients table
            updatePatientsTable();
        });
    });

    // function to update patients table
    const updatePatientsTable = () => {
        const patientsTable = document.getElementById('patients-table');
        patientsTable.innerHTML = users.map(user => {
            const userAppointments = appointments.filter(appt => appt.name === user.fullname);
            const appointmentDetails = userAppointments.length > 0 
                ? userAppointments.map(appt => `${appt.service} on ${appt.date} at ${appt.time} (${appt.status})`).join('<br>')
                : 'No appointments';

            return `
        <tr>
          <td>${user.fullname}</td>
          <td>${user.email}</td>
          <td>${appointmentDetails}</td>
        </tr>
      `;
        }).join('');
    };

    // patients table
    updatePatientsTable();
})