import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, onSnapshot, orderBy, setDoc, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
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
        const sendFriendRequestButton = document.getElementById('sendFriendRequest');
        const friendRequestsList = document.getElementById('friendRequestsList');
        const friendsList = document.getElementById('friendsList');
        let currentChatUserId = null;

        // Function to load users
        async function loadUsers() {
            try {
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
            } catch (error) {
                console.error('Error loading users:', error);
            }
        }

        // Function to load friend requests
        async function loadFriendRequests() {
            const user = auth.currentUser;
            if (!user) {
                console.error('No user is currently authenticated.');
                return;
            }

            try {
                const friendRequestsCollection = collection(db, 'friendRequests');
                const q = query(friendRequestsCollection, where('receiverId', '==', user.uid), orderBy('timestamp'));
                const querySnapshot = await getDocs(q);

                friendRequestsList.innerHTML = '';
                if (querySnapshot.empty) {
                    friendRequestsList.innerHTML = '<p>No friend requests.</p>';
                } else {
                    querySnapshot.forEach((doc) => {
                        const request = doc.data();
                        const requestElement = document.createElement('div');
                        requestElement.classList.add('friend-request');
                        requestElement.innerHTML = `
                            <div>Sender: ${request.senderId}</div>
                            <button class="acceptFriendRequest" data-id="${doc.id}">Accept</button>
                            <button class="rejectFriendRequest" data-id="${doc.id}">Reject</button>
                        `;
                        friendRequestsList.appendChild(requestElement);
                    });

                    document.querySelectorAll('.acceptFriendRequest').forEach(button => {
                        button.addEventListener('click', async (e) => {
                            const requestId = e.target.getAttribute('data-id');
                            try {
                                await updateDoc(doc(db, 'friendRequests', requestId), {
                                    status: 'accepted'
                                });
                                await addDoc(collection(db, 'friends'), {
                                    userId1: user.uid,
                                    userId2: request.senderId,
                                    status: 'accepted'
                                });
                                loadFriendRequests();
                                loadFriends();
                            } catch (error) {
                                console.error('Error accepting friend request:', error);
                            }
                        });
                    });

                    document.querySelectorAll('.rejectFriendRequest').forEach(button => {
                        button.addEventListener('click', async (e) => {
                            const requestId = e.target.getAttribute('data-id');
                            try {
                                await updateDoc(doc(db, 'friendRequests', requestId), {
                                    status: 'rejected'
                                });
                                loadFriendRequests();
                            } catch (error) {
                                console.error('Error rejecting friend request:', error);
                            }
                        });
                    });
                }
            } catch (error) {
                console.error('Error loading friend requests:', error);
            }
        }

        // Function to load friends
        async function loadFriends() {
            const user = auth.currentUser;
            if (!user) {
                console.error('No user is currently authenticated.');
                return;
            }

            try {
                const friendsCollection = collection(db, 'friends');
                const q = query(friendsCollection, where('status', '==', 'accepted'), where('userId1', '==', user.uid));
                const querySnapshot = await getDocs(q);

                friendsList.innerHTML = '';
                if (querySnapshot.empty) {
                    friendsList.innerHTML = '<p>No friends yet.</p>';
                } else {
                    querySnapshot.forEach(async (doc) => {
                        const friendData = doc.data();
                        const friendId = friendData.userId2;
                        const friendDoc = await getDoc(doc(db, 'users', friendId));
                        const friend = friendDoc.data();
                        const friendElement = document.createElement('div');
                        friendElement.classList.add('friend');
                        friendElement.innerHTML = `
                            <div class="friend-name">${friend.pseudo}</div>
                            <button class="startChat" data-id="${friendId}">Chat</button>
                        `;
                        friendsList.appendChild(friendElement);
                    });

                    document.querySelectorAll('.startChat').forEach(button => {
                        button.addEventListener('click', (e) => {
                            currentChatUserId = e.target.getAttribute('data-id');
                            loadMessages(currentChatUserId);
                        });
                    });
                }
            } catch (error) {
                console.error('Error loading friends:', error);
            }
        }

        // Function to load messages with a specific friend
        async function loadMessages(friendId) {
            const user = auth.currentUser;
            if (!user || !friendId) {
                console.error('User or friend ID is missing.');
                return;
            }

            const q = query(
                collection(db, 'messages'),
                where('senderId', 'in', [user.uid, friendId]),
                where('receiverId', 'in', [user.uid, friendId]),
                orderBy('timestamp')
            );

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

        // Authentication state change listener
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User is authenticated:', user.uid);
                loadUsers();
                loadFriendRequests();
                loadFriends();
            } else {
                console.error('User is not authenticated.');
                window.location.href = 'index.html';
            }
        });

        sendFriendRequestButton.addEventListener('click', async () => {
            const receiverId = userSelect.value;
            const user = auth.currentUser;

            if (user && receiverId) {
                try {
                    await addDoc(collection(db, 'friendRequests'), {
                        senderId: user.uid,
                        receiverId: receiverId,
                        status: 'pending',
                        timestamp: new Date()
                    });
                    alert('Friend request sent.');
                } catch (error) {
                    console.error('Error sending friend request:', error);
                }
            } else {
                alert('Please select a user to send a friend request.');
            }
        });

        sendMessageButton.addEventListener('click', async () => {
            const message = messageInput.value;
            const user = auth.currentUser;

            if (user && message && currentChatUserId) {
                try {
                    await addDoc(collection(db, 'messages'), {
                        senderId: user.uid,
                        receiverId: currentChatUserId,
                        message: message,
                        timestamp: new Date()
                    });
                    messageInput.value = '';
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            } else {
                alert('Please type a message and select a friend to chat with.');
            }
        });

        logoutButton.addEventListener('click', async () => {
            await signOut(auth);
            window.location.href = 'index.html';
        });
    }
});
