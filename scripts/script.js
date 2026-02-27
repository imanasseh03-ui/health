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