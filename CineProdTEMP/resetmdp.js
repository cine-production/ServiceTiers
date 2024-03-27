// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "VotreApiKey",
    authDomain: "VotreAuthDomain",
    projectId: "VotreProjectID",
    storageBucket: "VotreStorageBucket",
    messagingSenderId: "VotreMessagingSenderId",
    appId: "VotreAppId",
    measurementId: "VotreMeasurementId"
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Obtention de l'objet authentification
const auth = getAuth(app);

// Gestionnaire d'événement pour le formulaire de connexion
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Utilisateur connecté:', user);

        // Redirection de l'utilisateur vers une autre page après la connexion
        window.location.href = 'choisir_avatar.html';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erreur de connexion:', errorMessage);
    }
});

// Gestionnaire d'événement pour le formulaire de réinitialisation de mot de passe
const resetPasswordForm = document.getElementById('reset-password-form');
resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const resetEmail = resetPasswordForm['reset-password-email'].value;

    try {
        await sendPasswordResetEmail(auth, resetEmail);
        console.log('E-mail de réinitialisation envoyé avec succès!');

        // Redirection de l'utilisateur vers une page de confirmation si nécessaire
        window.location.href = 'reset-password-confirmation.html';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation:', errorMessage);
    }
});

// Gestionnaire d'état d'authentification pour la mise à jour de l'interface utilisateur
const authContainer = document.getElementById('auth-container');
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Code pour afficher l'avatar de l'utilisateur connecté, si nécessaire
    } else {
        authContainer.innerHTML = '';
    }
});
