import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, onSnapshot, orderBy, setDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIjoNj8DmjRX46SMb8-CayZsq6lQGU-rw",
    authDomain: "furries-ihbpld.firebaseapp.com",
    projectId: "furries-ihbpld",
    storageBucket: "furries-ihbpld.appspot.com",
    messagingSenderId: "329813018418",
    appId: "1:329813018418:web:6e88025cb6a9745a85792b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('index.html')) {
        // Login Page
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = 'chat.html';
            } catch (error) {
                alert(error.message);
            }
        });
    } else if (path.includes('signup.html')) {
        // Signup Page
        const signupForm = document.getElementById('signupForm');
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const pseudo = document.getElementById('pseudo').value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Check if the pseudo already exists
                const usersCollection = collection(db, 'users');
                const q = query(usersCollection, where('pseudo', '==', pseudo));
                const querySnapshot = await getDocs(q);
                const userCount = querySnapshot.size + 1;
                const userId = `${pseudo}_${userCount.toString().padStart(4, '0')}`;

                // Save user info in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    pseudo: pseudo,
                    email: email,
                    userId: userId
                });
                
                window.location.href = 'chat.html';
            } catch (error) {
                alert(error.message);
            }
        });
    } else if (path.includes('chat.html')) {
        // Chat Page
        const chatBox = document.getElementById('chatBox');
        const messageInput = document.getElementById('messageInput');
        const sendMessageButton = document.getElementById('sendMessage');
        const logoutButton = document.getElementById('logout');
        const userSelect = document.getElementById('userSelect');

        // Load the list of users
        async function loadUsers() {
            const usersCollection = collection(db, 'users');
            const usersQuery = query(usersCollection);
            const querySnapshot = await getDocs(usersQuery);

            userSelect.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = user.pseudo;
                userSelect.appendChild(option);
            });
        }
        
        loadUsers();

        sendMessageButton.addEventListener('click', async () => {
            const message = messageInput.value;
            const user = auth.currentUser;
            const receiverId = userSelect.value;

            if (user && message) {
                await addDoc(collection(db, 'messages'), {
                    senderId: user.uid,
                    receiverId: receiverId,
                    message: message,
                    timestamp: new Date()
                });
                messageInput.value = '';
            }
        });

        logoutButton.addEventListener('click', async () => {
            await signOut(auth);
            window.location.href = 'index.html';
        });

        // Listen for messages
        const q = query(collection(db, 'messages'), orderBy('timestamp'));
        onSnapshot(q, (querySnapshot) => {
            chatBox.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = `
                    <div class="sender">${data.senderId}</div>
                    <div class="message-text">${data.message}</div>
                    <div class="timestamp">${new Date(data.timestamp.seconds * 1000).toLocaleTimeString()}</div>
                `;
                chatBox.appendChild(messageElement);
            });
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }
});
