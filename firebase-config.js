// Firebase Configuration (Simplified for browser module loading)
const firebaseConfig = {
  apiKey: "AIzaSyDvioUzYqLPGe1pr86pa0oocbpsYU3kIoU",
  authDomain: "flashcard-app-703e3.firebaseapp.com",
  projectId: "flashcard-app-703e3",
  storageBucket: "flashcard-app-703e3.appspot.storage",
  messagingSenderId: "167284996806",
  appId: "1:167284996806:web:778d50ff2ec2f4de6175c7"
};

// Lazy load Firebase modules to avoid circular dependencies
let firebaseApp = null;
let auth = null;
let db = null;
let googleProvider = null;

async function initializeFirebase() {
  if (firebaseApp) return; // Already initialized
  
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js");
  const { getAuth, GoogleAuthProvider } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js");
  const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");

  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  googleProvider = new GoogleAuthProvider();
  
  console.log("✅ Firebase initialized");
}

// Authentication Functions
export async function loginWithGoogle() {
  await initializeFirebase();
  try {
    const { signInWithPopup } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js");
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

export async function logout() {
  await initializeFirebase();
  try {
    const { signOut } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js");
    await signOut(auth);
  } catch (error) {
    console.error("❌ Logout error:", error);
    throw error;
  }
}

export function getCurrentUser() {
  return auth ? auth.currentUser : null;
}

export async function onUserStateChange(callback) {
  await initializeFirebase();
  const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js");
  return onAuthStateChanged(auth, callback);
}

export async function getAuthInstance() {
  await initializeFirebase();
  return auth;
}

export async function getDbInstance() {
  await initializeFirebase();
  return db;
}
