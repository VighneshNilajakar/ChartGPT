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

// Error message mapping with funny responses
const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/user-not-found': '🔍 User not found! Did you forget your email address? 😅',
        'auth/wrong-password': '🔐 Wrong password! Your memory is as good as your password 🤦',
        'auth/invalid-email': '📧 That email looks fishy... is it even valid? 🐟',
        'auth/email-already-in-use': '👤 This email is already taken! Find another one! 💔',
        'auth/weak-password': '🛡️ Your password is weaker than a wet noodle! Use something stronger! 🍝',
        'auth/too-many-requests': '⏰ Too many login attempts! Take a break and grab some coffee ☕',
        'auth/account-exists-with-different-credential': '🎭 This account exists with a different sign-in method! Try another way! 🔐',
        'auth/popup-blocked': '🚫 Pop-up blocked! Check your browser settings, detective! 🔍',
        'auth/cancelled-popup-request': '❌ You cancelled the sign-in. No pressure! 😤',
        'auth/network-request-failed': '🌐 Network error! Your internet seems to be on vacation 🏖️',
        'auth/invalid-credential': '❌ Invalid credentials! Double-check and try again! 📝'
    };
    return errorMessages[errorCode] || `❌ Error: ${errorCode}. Something went wrong! 😵`;
};

// Show error toast
const showError = (message, duration = 4000) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, duration);
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);

// Validate inputs
const validateInputs = () => {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    
    if (!emailValue) {
        showError('📧 Please enter your email address! 👈');
        return false;
    }
    
    if (!passwordValue) {
        showError('🔑 Password field is empty! Enter something! 👆');
        return false;
    }
    
    if (emailValue.length < 5) {
        showError('📧 That email looks too short! 🤷');
        return false;
    }
    
    return true;
};

// Sign in with email and password
const signIn = async () => {
    if (!validateInputs()) return;
    
    signInBtn.disabled = true;
    signInBtn.textContent = 'Signing in...';
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        sessionStorage.setItem('user', JSON.stringify(user));
        showError('✅ Welcome back! Redirecting... 🎉', 2000);
        setTimeout(() => {
            window.location.href = 'prompt.html';
        }, 2000);
    } catch (error) {
        console.error('Sign in error:', error);
        showError(getErrorMessage(error.code));
        signInBtn.disabled = false;
        signInBtn.textContent = 'Sign In';
    }
};

// Sign in with Google
const signInWithGoogle = async () => {
    googleSignInBtn.disabled = true;
    googleSignInBtn.textContent = 'Signing in...';
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        sessionStorage.setItem('user', JSON.stringify(user));
        showError('✅ Welcome ' + user.displayName + '! 🎉', 2000);
        setTimeout(() => {
            window.location.href = 'prompt.html';
        }, 2000);
    } catch (error) {
        console.error('Google sign in error:', error);
        showError(getErrorMessage(error.code));
        googleSignInBtn.disabled = false;
        googleSignInBtn.textContent = '🔵 Sign In with Google';
    }
};

// Check auth state
const checkAuthState = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            window.location.href = 'prompt.html';
        } else {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    sessionStorage.setItem('user', JSON.stringify(user));
                    window.location.href = 'prompt.html';
                } else {
                    login.style.display = 'block';
                    authPart.style.display = 'none';
                }
            });
        }
    } catch (error) {
        console.error('Auth state check error:', error);
        login.style.display = 'block';
        authPart.style.display = 'none';
    }
};

checkAuthState();

// Sign out
const userSignOut = () => {
    signOutBtn.disabled = true;
    signOut(auth)
        .then(() => {
            sessionStorage.removeItem('user');
            showError('👋 Signed out successfully! See you soon! 👋', 2000);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            console.error('Sign out error:', error);
            showError(getErrorMessage(error.code));
            signOutBtn.disabled = false;
        });
};

signInBtn.addEventListener('click', signIn);
googleSignInBtn.addEventListener('click', signInWithGoogle);
signOutBtn.addEventListener('click', userSignOut);

// Enter key support
email.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') signIn();
});
password.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') signIn();
});