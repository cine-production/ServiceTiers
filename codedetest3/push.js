// Importer et initialiser Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzPI54XTLtCTFXlBlIkp7257Bri6BXrOc",
    authDomain: "testpush-ad174.firebaseapp.com",
    projectId: "testpush-ad174",
    storageBucket: "testpush-ad174.appspot.com",
    messagingSenderId: "197083996622",
    appId: "1:197083996622:web:ba9cf0258de13b80014b9f"
  };
  
  // Initialisation de Firebase
  firebase.initializeApp(firebaseConfig);
  
  const messaging = firebase.messaging();
  
  // Clé publique VAPID
  const vapidKey = "BP38CroGbEeGd67VsdlFFdPBKBDDnJYW2isUfpWm1beL8PeuH8yfY1alUbo5PErgU1RJrF5GYCsIqKQv1gqRUk";
  
  // Demande de permission et récupération du token
  document.getElementById("enableNotifications").addEventListener("click", async () => {
    try {
      const token = await messaging.getToken({ vapidKey });
      if (token) {
        console.log("Token Firebase Cloud Messaging :", token);
        alert("Notifications activées !");
        // Envoyez le token à votre backend pour l'enregistrer
      } else {
        console.warn("Aucun token disponible. Autorisez les notifications.");
      }
    } catch (error) {
      console.error("Erreur lors de l'activation des notifications :", error);
    }
  });
  
  // Gestion des messages en premier plan
  messaging.onMessage((payload) => {
    console.log("Message reçu :", payload);
    alert(`Notification : ${payload.notification.title}\n${payload.notification.body}`);
  });
  