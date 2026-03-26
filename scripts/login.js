document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const msg = document.getElementById('form-msg');
  const btn = document.getElementById('login-btn');
  const btnText = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.loader');

  const CURRENT_USER_KEY = 'currentUser';
  const USER_KEY = 'health_users';

  const ADMIN_EMAIL = 'admin@health.com';
  const ADMIN_PASSWORD = 'admin123';

  const showError = (text) => {
    msg.textContent = text;
    msg.className = 'form-error';
  };

  const showSuccess = (text) => {
    msg.textContent = text;
    msg.className = 'form-success';
  };

  const toggleLoading = (isLoading) => {
    loader.classList.toggle('hidden', !isLoading);
    btnText.textContent = isLoading ? 'Logging in...' : 'Login';
    btn.disabled = isLoading;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    toggleLoading(true);

    setTimeout(() => {

      // ✅ Admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
          email,
          role: 'admin'
        }));

        showSuccess('Admin login successful!');

        return setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }

      const users = JSON.parse(localStorage.getItem(USER_KEY)) || [];

      const user = users.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        toggleLoading(false);
        return showError('Invalid email or password');
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        ...user,
        role: 'user'
      }));

      showSuccess('Login successful!');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);

    }, 800); // simulate loading

  });

});