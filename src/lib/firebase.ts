import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyA75WRNm38qmLq43NmdL3pcVG9GNSvNG-E",
  authDomain: "samura-aa16d.firebaseapp.com",
  projectId: "samura-aa16d",
  storageBucket: "samura-aa16d.firebasestorage.app",
  messagingSenderId: "799648587995",
  appId: "1:799648587995:web:5a37e2b180727ea410acfe"
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
