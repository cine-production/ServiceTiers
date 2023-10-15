const openModalButton = document.getElementById('openModal');
const passwordModal = document.getElementById('passwordModal');
const closeModalButton = document.getElementById('closeModal');
const checkPasswordButton = document.getElementById('checkPassword');
const passwordInput = document.getElementById('passwordInput');

openModalButton.addEventListener('click', () => {
    passwordModal.style.display = 'block';
});

closeModalButton.addEventListener('click', () => {
    passwordModal.style.display = 'none';
    passwordInput.value = '';
});

checkPasswordButton.addEventListener('click', () => {
    const password = passwordInput.value;

    if (password === 'salut123') {
        window.location.href = 'page1.html'; // Rediriger vers la première page
    } else if (password === 'ent123') {
        window.location.href = 'page2.html'; // Rediriger vers la deuxième page
    } else {
        alert('Mot de passe incorrect. Veuillez réessayer.');
        passwordInput.value = '';
    }
});