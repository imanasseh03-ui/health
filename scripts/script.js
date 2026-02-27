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
});