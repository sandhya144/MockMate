
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase-admin/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAHZOUWd3mW16vSxLIYQBmDbr7dNp03Klo",
  authDomain: "mockmate-ef2c2.firebaseapp.com",
  projectId: "mockmate-ef2c2",
  storageBucket: "mockmate-ef2c2.firebasestorage.app",
  messagingSenderId: "558537876235",
  appId: "1:558537876235:web:b2a95179b8a3f14f25b80e",
  measurementId: "G-8ZDWB7W8G7"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);