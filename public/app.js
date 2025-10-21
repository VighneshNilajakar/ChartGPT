import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Cache the DOM elements
const email = document.getElementById('email');
const password = document.getElementById('password');
const signInBtn = document.getElementById('signInBtn');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const login = document.getElementById('login');
const authPart = document.getElementById('authPart');

// Hide the authenticated part initially
authPart.style.display = 'none';

// Sign in with email and password
const signIn = async () => {
    const signInEmail = email.value;
    const signInPassword = password.value;
    signInWithEmailAndPassword(auth, signInEmail, signInPassword)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            sessionStorage.setItem('user', JSON.stringify(user));
            alert('User signed in successfully');
            window.location.href = 'prompt.html'; // Redirect to prompt.html
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage);
        });
}

// Sign in with Google
const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // Signed in
            const user = result.user;
            console.log(user);
            sessionStorage.setItem('user', JSON.stringify(user));
            alert('User signed in with Google successfully');
            window.location.href = 'prompt.html'; // Redirect to prompt.html
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage);
        });
}

// Check auth state
const checkAuthState = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        window.location.href = 'prompt.html'; // Redirect to prompt.html if user is already signed in
    } else {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                sessionStorage.setItem('user', JSON.stringify(user));
                window.location.href = 'prompt.html'; // Redirect to prompt.html
            } else {
                login.style.display = 'block';
                authPart.style.display = 'none';
                console.log('User is signed out');
            }
        });
    }
}
checkAuthState();

// Sign out
const userSignOut = () => {
    signOut(auth).then(() => {
        sessionStorage.removeItem('user');
        console.log('User signed out');
        alert('User signed out successfully');
        login.style.display = 'block';
        authPart.style.display = 'none';
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorMessage);
    });
}

signInBtn.addEventListener('click', signIn);
googleSignInBtn.addEventListener('click', signInWithGoogle);
signOutBtn.addEventListener('click', userSignOut);