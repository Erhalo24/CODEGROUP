import { auth, googleProvider } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const googleBtn = document.getElementById('googleBtn');

// Kullanıcı zaten giriş yapmışsa direkt dashboard'a yönlendir
onAuthStateChanged(auth, (user) => {
  if (user) location.href = 'dashboard.html';
});

// Email & şifre ile giriş
loginBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Email ve şifre boş olamaz');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
    alert('Giriş başarısız: ' + err.message);
  }
};

// Google ile giriş
googleBtn.onclick = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
    alert('Google ile giriş başarısız: ' + err.message);
  }
};
