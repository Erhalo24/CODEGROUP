import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js';

const shareBtn = document.getElementById('shareBtn');
const codeText = document.getElementById('codeText');
const codes = document.getElementById('codes');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;

// Kullanıcı login kontrolü
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = 'login.html';
    return;
  }

  currentUser = user;

  if (!user.displayName) {
    alert('Kod paylaşmak için önce profilinizden kullanıcı adı belirleyin');
    shareBtn.disabled = true;
  } else {
    shareBtn.disabled = false;
  }
});

// Kod paylaşma
shareBtn.onclick = async () => {
  if (!currentUser.displayName) {
    alert('Kullanıcı adı olmadan kod paylaşamazsınız');
    return;
  }

  if (!codeText.value) return;

  await addDoc(collection(db, 'codes'), {
    userUid: currentUser.uid,
    userName: currentUser.displayName,
    text: codeText.value,
    time: serverTimestamp()
  });

  codeText.value = '';
};

// Kodları listele ve silme yetkisi
const q = query(collection(db, 'codes'), orderBy('time', 'desc'));
onSnapshot(q, (snap) => {
  codes.innerHTML = '';

  snap.forEach((d) => {
    const c = d.data();
    const div = document.createElement('div');
    div.classList.add('code');

    div.innerHTML = `
      <b>${c.userName || 'Bilinmeyen'}</b>
      <pre>${c.text}</pre>
    `;

    // Sadece kendi kodunu sil
    if (currentUser && currentUser.uid === c.userUid) {
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Sil';
      delBtn.onclick = () => deleteDoc(doc(db, 'codes', d.id));
      div.appendChild(delBtn);
    }

    codes.appendChild(div);
  });
});

// Profil butonu
window.goProfile = () => {
  location.href = 'profile.html';
};

// Çıkış butonu
logoutBtn.onclick = async () => {
  await signOut(auth);
  location.href = 'login.html';
};