import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, where } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  app, 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification
};
export type { User };