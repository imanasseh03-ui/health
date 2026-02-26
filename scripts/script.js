document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('.js-search-btn');
  const searchInput = document.querySelector('#search-input');
  const serviceCards = document.querySelectorAll('.services-container .card');

  // Guard clause (prevents JS errors)
  if (!searchBtn || !searchInput || serviceCards.length === 0) return;

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();

    serviceCards.forEach(card => {
      const text = card.innerText.toLowerCase();

      if (text.includes(query)) {
        card.parentElement.style.display = 'block';
      } else {
        card.parentElement.style.display = 'none';
      }
    });
  });

  // Optional: search while typing
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
});