import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

// Votre configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCkoEUIbWVkzscJEPxM5thSG2TtYol5MyQ",
    authDomain: "cineproduction.firebaseapp.com",
    projectId: "cineproduction",
    storageBucket: "cineproduction.appspot.com",
    messagingSenderId: "359535088144",
    appId: "1:359535088144:web:fc43855445d11a369fb095",
    measurementId: "G-9Z2YZTZDNP"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const user = auth.currentUser;

const authContainer = document.getElementById('auth-container');

// Fonction pour afficher l'avatar et le menu déroulant
function displayAvatar(user) {
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'avatar-container';

    // Créer l'élément de l'avatar
    const avatarImage = document.createElement('img');
    avatarImage.src = user.photoURL;
    avatarImage.alt = '';
    avatarImage.id = 'avatar-image'; // Ajouter un ID pour cibler l'élément plus tard
    avatarContainer.appendChild(avatarImage);

    // Créer le menu déroulant
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    dropdownMenu.style.display = 'none'; // Caché par défaut
    
    // Ajouter l'adresse e-mail
    const emailElement = document.createElement('p');
    emailElement.textContent = user.email; // Récupérer l'adresse e-mail de l'utilisateur
    dropdownMenu.appendChild(emailElement);

    // Ajouter le bouton pour choisir l'image d'avatar
    const changeAvatarButton = document.createElement('button');
    changeAvatarButton.textContent = 'Changer l\'avatar';
    changeAvatarButton.addEventListener('click', () => {
        // Rediriger vers la page de choix de l'avatar
        window.location.href = 'choisir_avatar.html';
    });
    dropdownMenu.appendChild(changeAvatarButton);

    // Ajouter le bouton de déconnexion
    const signOutButton = document.createElement('button');
    signOutButton.textContent = 'Se déconnecter';
    signOutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log('Utilisateur déconnecté');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    });
    dropdownMenu.appendChild(signOutButton);

    const suppButton = document.createElement('button');
    suppButton.textContent = 'Supprimer le compte';
    suppButton.classList.add('supp-button');
    suppButton.addEventListener('click', async () => {
        try {
            await deleteUser(user);
            console.log('Utilisateur déconnecté et supprimé');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    });
    dropdownMenu.appendChild(suppButton);

    // Écouter le clic sur l'avatar pour afficher ou cacher le menu déroulant
    avatarImage.addEventListener('click', () => {
        if (dropdownMenu.style.display === 'none') {
            dropdownMenu.style.display = 'block';
        } else {
            dropdownMenu.style.display = 'none';
        }
    });

    // Écouter le survol de la liste déroulante pour la cacher avec effet de fondu
    dropdownMenu.addEventListener('mouseleave', () => {
        dropdownMenu.style.display = 'none';
    });

    avatarContainer.appendChild(dropdownMenu);

    authContainer.innerHTML = '';
    authContainer.appendChild(avatarContainer);
}

// Fonction pour afficher les boutons d'inscription et de connexion
function displayButtons() {
    authContainer.innerHTML = `
        <a href="inscription.html"><button class="sub-btn">subscribe</button></a>
        <a href="connexion.html" class="login-link">login</a>
    `;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        displayAvatar(user);
    } else {
        displayButtons();
    }
});
