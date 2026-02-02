document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('darkModeToggle');
    const body = document.body;
    const navbar = document.querySelector('.navbar');

    // Check local storage for preference
    const darkMode = localStorage.getItem('darkMode');

    function enableDarkMode() {
        body.setAttribute('data-theme', 'dark');
        if (navbar) {
            navbar.classList.remove('navbar-light');
            navbar.classList.add('navbar-dark');
        }
        if (toggleButton) toggleButton.checked = true;
    }

    function disableDarkMode() {
        body.removeAttribute('data-theme');
        if (navbar) {
            navbar.classList.remove('navbar-dark');
            navbar.classList.add('navbar-light');
        }
        if (toggleButton) toggleButton.checked = false;
    }

    if (darkMode === 'enabled') {
        enableDarkMode();
    } else {
        // Ensure default state is consistent
        disableDarkMode();
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                disableDarkMode();
                localStorage.setItem('darkMode', 'disabled');
            } else {
                enableDarkMode();
                localStorage.setItem('darkMode', 'enabled');
            }
        });
    }
});
