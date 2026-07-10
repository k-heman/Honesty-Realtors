import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration, pulling from environment variables with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD22ruN9cnROijMm6sOO71THBWeMKtoN5E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "honesty-realtor.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "honesty-realtor",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "honesty-realtor.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "371834178020",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:371834178020:web:fe9cba20849b563cf7dff1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SBKL6GH0M7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics conditionally (it is only supported in browser environment and if enabled)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(err => {
  console.warn("Analytics initialization failed or is not supported in this environment:", err);
});

export { app, db, auth, analytics };
