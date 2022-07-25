document.addEventListener('click', (e) => {
  const isDropdownBtn = e.target.matches('[data-dropdown-btn]');

  if (!isDropdownBtn && e.target.closest('[data-dropdown]') !== null) {
    return;
  }

  let currentDropdown;

  if (isDropdownBtn) {
    currentDropdown = e.target.closest('[data-dropdown]');
    currentDropdown.classList.toggle('active-dropdown');
  }

  document
    .querySelectorAll('[data-dropdown].active-dropdown')
    .forEach((dropdown) => {
      if (dropdown === currentDropdown) {
        return;
      }

      dropdown.classList.remove('active-dropdown');
    });
});
