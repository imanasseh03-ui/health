document.addEventListener('DOMContentLoaded', () => {

    const CURRENT_USER_KEY = 'currentUser';
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    //protect  page
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    const appointments = JSON.parse(localStorage.getItem('health-appointments')) || [];

    // stats
    document.getElementById('total-count').textContent = appointments.length;

    document.getElementById('pending-count').textContent = appointments.filter(a => a.status === 'pending').length;

    document.getElementById('completed-count').textContent = appointments.filter(a => a.status === 'completed').length;

    //table
    const table = document.getElementById('admin-table');

    table.innerHTML = appointments.map(appt => `
    <tr>
      <td>${appt.name}</td>
      <td>${appt.service}</td>
      <td>${appt.date}</td>
      <td>${appt.time}</td>
      <td>
        <span class="badge bg-${
          appt.status === 'pending' ? 'warning' :
          appt.status === 'confirmed' ? 'info' : 'success'
        }">
          ${appt.status}
        </span>
      </td>
    </tr>
  `).join('');
})