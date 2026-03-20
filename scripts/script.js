document.addEventListener('DOMContentLoaded', () => {

  const CURRENT_USER_KEY = 'currentUser';
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);

  // 🔒 Protect page
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  /* =========================
        NAVBAR AUTH STATE
  ========================= */

  const authArea = document.getElementById('auth-area');

  if (authArea) {
    try {
      const user = JSON.parse(currentUser);

      const name =
        user.firstName ||
        (user.fullname ? user.fullname.split(' ')[0] : null) ||
        user.email.split('@')[0];

      authArea.innerHTML = `
        <span class="me-3 fw-bold text-success">
          👋 Hi, ${name}
        </span>
        <button class="btn btn-sm btn-outline-success ms-2" id="logout-btn">
          Logout
        </button>
      `;

      document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        window.location.href = 'login.html';
      });

    } catch (e) {
      console.error('Invalid user data');
    }
  }

});