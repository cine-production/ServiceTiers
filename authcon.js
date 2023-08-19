import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

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

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Utilisateur connecté:', user);

        // Rediriger l'utilisateur vers le site internet (index.html)
        window.location.href = 'index.html';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erreur de connexion:', errorMessage);
    }
});

const authContainer = document.getElementById('auth-container');
onAuthStateChanged(auth, (user) => {
    if (user) {
        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'avatar-container';
        const avatarImage = document.createElement('img');
        avatarImage.src = user.photoURL;
        avatarImage.alt = 'Avatar';
        avatarContainer.appendChild(avatarImage);

        authContainer.innerHTML = '';
        authContainer.appendChild(avatarContainer);
    } else {
        authContainer.innerHTML = '';
    }
});

