document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const msg = document.getElementById('form-msg');

    const firstNameInput = document.getElementById('firstname');
    const middleNameInput = document.getElementById('middlename');
    const lastNameInput = document.getElementById('lastname');

   const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');


    const USER_KEY = 'health_users';

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

    /* =========================
    SUBMIT HANDLER 
    ========================= */

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        msg.textContent = '';
        msg.className = '';

       const first = firstNameInput.value.trim();
       const middle = middleNameInput.value.trim();
       const last = lastNameInput.value.trim();

       const fullname = `${first} ${middle} ${last}`.trim();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirm = confirmInput.value.trim();

        //validation
        if(fullname.length < 3){
        showError('Full name must be at least 3 characters.');
        return;
       }
        if(!isValidEmail(email)){
            showError('Please enter a valid email address.');
            return;
        }
        if(password.length < 6){
            showError('Password must be at least 6 characters.');
            return;
        }
        if(password !== confirm){
            showError('Passwords do not match.');
            return;
        }
        try{
            const usersRaw = localStorage.getItem(USER_KEY);
            const users = usersRaw ? JSON.parse(usersRaw) : [];

            //check duplicate email
            const exists = users.some(
                u => u.email.toLowerCase() === email.toLowerCase()
            );

            if(exists){
                showError('An account with this email already exists.');
                return;
            }

            //save new user
            users.push({
            fullname,
            email,
            password
          });
            localStorage.setItem(USER_KEY, JSON.stringify(users));

            showSuccess('Account created successfully! Redirecting to login...');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);

        } catch{
            showError('Unable to create account. Please try again');
        }


    });

});