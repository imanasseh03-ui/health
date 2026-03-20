document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const msg = document.getElementById('form-msg');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  const USER_KEY = 'health_users';
  const CURRENT_USER_KEY = 'currentUser';

  // ✅ Redirect if already logged in
  const existingUser = localStorage.getItem(CURRENT_USER_KEY);
  if (existingUser) {
    window.location.href = 'index.html';
  }

  const showError = (text) => {
    msg.textContent = text;
    msg.className = 'form-error';
  };

  const showSuccess = (text) => {
    msg.textContent = text;
    msg.className = 'form-success';
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // ✅ Validation FIRST
    if (!isValidEmail(email)) {
      showError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    try {
      const usersRaw = localStorage.getItem(USER_KEY);
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      const user = users.find(
        u =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        showError('Invalid email or password');
        return;
      }

      // ✅ Save logged-in user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      showSuccess('Login successful! Redirecting...');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (error) {
      showError('Something went wrong');
    }
  });
});