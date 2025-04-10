importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js");

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBzPI54XTLtCTFXlBlIkp7257Bri6BXrOc",
  authDomain: "testpush-ad174.firebaseapp.com",
  projectId: "testpush-ad174",
  storageBucket: "testpush-ad174.appspot.com",
  messagingSenderId: "197083996622",
  appId: "1:197083996622:web:ba9cf0258de13b80014b9f"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Gestion des notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log("Message en arrière-plan :", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/favicon.png", // Icône personnalisée
  });
});
