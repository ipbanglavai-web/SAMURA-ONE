import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCCvWplyapy19Mt7XgD4YjXWyzn0uYE5as",
  authDomain: "samura1.firebaseapp.com",
  projectId: "samura1",
  storageBucket: "samura1.firebasestorage.app",
  messagingSenderId: "711394370951",
  appId: "1:711394370951:web:ee05aed8fb926ab72bdf22"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = (() => {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
})();

export const auth = getAuth(app);

// Sign in anonymously to ensure permission checks pass seamlessly
signInAnonymously(auth).catch((err) => {
  // Silently ignore if anonymous auth is disabled on the project
});

export default app;
