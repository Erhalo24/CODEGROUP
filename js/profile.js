import { auth } from './firebase.js';
import { updateProfile, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';

const displayNameInput = document.getElementById('displayName');
const saveBtn = document.getElementById('saveProfile');
const emailEl = document.getElementById('email');
const logoutBtn = document.getElementById('logout');

let user = null;

// Giriş kontrolü
onAuthStateChanged(auth, (u) => {
  if (!u) {
    location.href = 'login.html';
    return;
  }
  user = u;
  emailEl.textContent = user.email;
  displayNameInput.value = user.displayName || '';
});

// Kullanıcı adı kaydet
saveBtn.onclick = async () => {
  const name = displayNameInput.value.trim();
  if (!name) return alert('Kullanıcı adı boş olamaz');

  await updateProfile(user, { displayName: name });
  alert('Kullanıcı adı kaydedildi');
  location.href = 'dashboard.html';
};

// Çıkış
logoutBtn.onclick = async () => {
  await signOut(auth);
  location.href = 'login.html';
};