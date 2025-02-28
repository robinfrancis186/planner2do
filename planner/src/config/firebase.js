import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZcgw9X2MGFeQllffS2V_Z1HakXgx2tNM",
  authDomain: "planner2do.firebaseapp.com",
  projectId: "planner2do",
  storageBucket: "planner2do.firebasestorage.app",
  messagingSenderId: "247553170665",
  appId: "1:247553170665:web:bd3840e34d145d8a56e478",
  measurementId: "G-PZWHYG87CE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth }; 