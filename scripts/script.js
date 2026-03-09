document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('.js-search-btn');
  const searchInput = document.querySelector('#search-input');
  const serviceCards = document.querySelectorAll('.services-container .card');
  const servicesRow = document.querySelector('.services-container');

  // Guard clause (prevents JS errors)
  if (!searchBtn || !searchInput || serviceCards.length === 0) return;

  //create 'no results' message element
  const noResultsMsg = document.createElement('p');
  noResultsMsg.textContent = 'no service found.';
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

    //button click search
    searchBtn.addEventListener('click', filterServices);

    //enter key search
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filterServices();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    /* =========================
     APPOINTMENT BOOKING MODAL
  ========================= */

  const bookBtn = document.querySelector('.js-book-now-btn');
  const appointmentform = document.querySelector('#appointment-form');
  const successMsg = document.querySelector('#appointment-success');
  const modalElement = document.getElementById('appointmentModal');
  
  if (bookBtn && appointmentform && successMsg && modalElement) {
    const modal = new bootstrap.Modal(modalElement);

    //open modal
    bookBtn.addEventListener('click', () => {
        modal.show();
    });

    //handle form submission
    appointmentform.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.querySelector('#full-name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const service = document.querySelector('#service').value;
        const date = document.querySelector('#date').value;

        if (!fullName || !email || !service || !date) {
            alert('Please fill in all required fields.');
            return;
        }

        successMsg.classList.remove('d-none');
        appointmentform.reset();

        setTimeout(() => {
            modal.hide();
             successMsg.classList.add('d-none');
        
        }, 2000);
    });

 }

 /* =========================
   NAVBAR AUTH STATE
========================= */

document.addEventListener('DOMContentLoaded', () => {
    const authArea = document.getElementById('auth-area');
    if(!authArea) return;

    const CURRENT_USER_KEY = 'health_current_user';
    const current = localStorage.getItem(CURRENT_USER_KEY);

    if(current) return;

    try{
        const user = JSON.parse(current);

        //Get name (fallback order)
        const name = 
        user.firstName || 
        user.fullname || 
        user.email.split('@')[0];

        authArea.innerHTML = `
        <span class="me-3 fw-bold text-success">
        👋 Hi, ${name}
        </span>
        <button class="btn btn-sm btn-outline-success ms-2" id="logout-btn">Logout</button>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem(CURRENT_USER_KEY);
            window.location.reload();

        });
        
    } catch(e) {
        console.error('invalid user data');
    }
});


});