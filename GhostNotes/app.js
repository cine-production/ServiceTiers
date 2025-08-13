import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmcCZB3Nrohxl3OWMolTAMSg_P1wNVV0g",
  authDomain: "phuic-7db7b.firebaseapp.com",
  projectId: "phuic-7db7b",
  storageBucket: "phuic-7db7b.firebasestorage.app",
  messagingSenderId: "657915171663",
  appId: "1:657915171663:web:07caba395aaec597fa2b3a",
  measurementId: "G-7MFCBQ6TEN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const googleLoginBtn = document.getElementById("googleLoginBtn");
const loginEmailBtn = document.getElementById("loginEmailBtn");
const signupEmailBtn = document.getElementById("signupEmailBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authError = document.getElementById("authError");

const authSection = document.getElementById("authSection");
const userSection = document.getElementById("userSection");
const userEmailSpan = document.getElementById("userEmail");

const noteText = document.getElementById("noteText");
const saveNoteBtn = document.getElementById("saveNote");
const notesList = document.getElementById("notesList");

let refreshIntervalId = null;

// Connexion Google
googleLoginBtn.addEventListener("click", async () => {
  authError.textContent = "";
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (e) {
    authError.textContent = "Erreur Google: " + e.message;
  }
});

// Connexion email/mdp
loginEmailBtn.addEventListener("click", async () => {
  authError.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) {
    authError.textContent = "Email et mot de passe requis";
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    authError.textContent = "Erreur connexion: " + e.message;
  }
});

// Inscription email/mdp
signupEmailBtn.addEventListener("click", async () => {
  authError.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) {
    authError.textContent = "Email et mot de passe requis";
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    authError.textContent = "Erreur inscription: " + e.message;
  }
});

// Déconnexion
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Sur changement d’état (connecté / déconnecté)
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    userSection.style.display = "block";
    userEmailSpan.textContent = user.email || user.displayName || "Utilisateur";
    loadNotes();

    if (refreshIntervalId) clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval(loadNotes, 4000); // toutes les 4 secondes

  } else {
    authSection.style.display = "block";
    userSection.style.display = "none";
    notesList.innerHTML = "";
    noteText.value = "";

    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
    }
  }
});

// Sauvegarde note avec position
saveNoteBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Géolocalisation non supportée par ce navigateur");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const text = noteText.value.trim();
      if (!text) {
        alert("Écris ta note avant de sauvegarder !");
        return;
      }
      try {
        await addDoc(collection(db, "notes"), {
          uid: auth.currentUser.uid,
          text,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        });
        alert("Note enregistrée à votre position !");
        noteText.value = "";
        loadNotes();
      } catch (e) {
        alert("Erreur sauvegarde note : " + e.message);
      }
    },
    (err) => alert("Erreur localisation : " + err.message),
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

const requestLocationBtn = document.getElementById("requestLocationBtn");

requestLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par ce navigateur.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      alert(`Localisation autorisée : ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
      // Tu peux éventuellement relancer le chargement des notes ici
      loadNotes();
    },
    (error) => {
      alert("Erreur de localisation : " + error.message);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});


// Chargement notes proches
async function loadNotes() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const querySnapshot = await getDocs(collection(db, "notes"));
      notesList.innerHTML = "";
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dist = getDistance(userLat, userLng, data.lat, data.lng);
        if (dist < 0.677) {  // 900 mètres = 0.900 km
          const div = document.createElement("div");
          div.className = "note";
          div.textContent = data.text;
          notesList.appendChild(div);
        }
      });
    } catch (e) {
      console.error("Erreur chargement notes:", e);
    }
  });
}

// Calcul distance en km (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Enregistrement service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}


