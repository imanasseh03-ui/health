document.addEventListener('DOMContentLoaded', () => {

  /* =========================
        SERVICE SEARCH
  ========================= */

  const searchBtn = document.querySelector('.js-search-btn');
  const searchInput = document.querySelector('#search-input');
  const serviceCards = document.querySelectorAll('.services-container .card');
  const servicesRow = document.querySelector('.services-container');

  if (searchBtn && searchInput && serviceCards.length > 0) {

    const noResultsMsg = document.createElement('p');
    noResultsMsg.textContent = 'No service found.';
    noResultsMsg.className = 'text-center mt-4 fw-bold';
    noResultsMsg.style.display = 'none';

    servicesRow.appendChild(noResultsMsg);

    function filterServices() {
      const query = searchInput.value.trim().toLowerCase();
      let matchFound = false;

      serviceCards.forEach(card => {
        const cardText = card.innerText.toLowerCase();

        if (cardText.includes(query)) {
          card.parentElement.style.display = 'block';
          matchFound = true;
        } else {
          card.parentElement.style.display = 'none';
        }
      });

      noResultsMsg.style.display = matchFound ? 'none' : 'block';
    }

    searchBtn.addEventListener('click', filterServices);

    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        filterServices();
      }
    });
  }


 /// =========================
    // APPOINTMENT BOOKING



    

  /* =========================
        NAVBAR AUTH STATE
  ========================= */

  const authArea = document.getElementById('auth-area');
  const CURRENT_USER_KEY = 'health_current_user';

  if (authArea) {

    const current = localStorage.getItem(CURRENT_USER_KEY);

    if (current) {
      try {

        const user = JSON.parse(current);

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
  }

});