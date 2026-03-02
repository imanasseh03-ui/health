document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const msg = document.getElementById('form-msg');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    const USER_KEY = 'health_users';
    const CURRENT_USER_KEY = 'health_current_user';

    /* =========================
     HELPERS
  ========================= */

  const showError = (test) => {
    msg.textContent = test;
    msg.className = 'form-error';
  };

    const showSuccess = (test) => {
        msg.textContent = test;
        msg.className = 'form-success';
    };

    const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const clearState = () => {
        msg.textContent = '';
        msg.className = '';
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');
    };

    /* =========================
    AUTO LOGIN LOGIC
  ========================= */
    try{
        const current = localStorage.getItem(CURRENT_USER_KEY);
        if(current){
            const user = JSON.parse(current);
            if(user?.email){
                form.innerHTML = `
                <div class="form-success">
                you are logged in as <strong>${user.email}</strong>
                </div>
                <div class="mt-3">
                <a href="index.html" class="btn btn-primary">Go to site</a>
                <button id="logout-btn" class="btn btn-outline-primary mt-2">Logout</button>
                </div>

                `;

                document.getElementById('logout-btn').addEventListener('click', () => {
                    localStorage.removeItem(CURRENT_USER_KEY);
                    window.location.reload();
                });
            return;
            }
        }

    } catch{}

    /* =========================
     FORM SUBMIT
  ========================= */

    form.addEventListener('submit', (e) => {});
        e.preventDefault();
        clearState();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        //validation
        if(!isValidEmail(email)){
            emailInput.classList.add('is-invalid');
            showError('Please enter a valid email address');
            return;
        }
        if(password.length < 6){
            passwordInput.classList.add('is-invalid');
            showError('Password must be at least 6 characters');
            return;
        }

        try{
            const usersRaw = localStorage.getItem(USER_KEY);
            const users = usersRaw ? JSON.parse(usersRaw) : [];
            

            const user = users.find(
                u => u.email.toLowerCase() === email.toLowerCase() &&
                 u.password === password
            );
            if(user){
                showError('invalid email or password');
                return;
            }

            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            showSuccess('Login successful! Redirecting...');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch{
            showError('Something went wrong. Please try again.');
        }
    

});
