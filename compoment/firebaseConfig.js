// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9snQnxsklPdaUq0faxwjOuFEm6Xrb6dg",
  authDomain: "usermanagerapp-d8379.firebaseapp.com",
  projectId: "usermanagerapp-d8379",
  storageBucket: "usermanagerapp-d8379.appspot.com",
  messagingSenderId: "359397660943",
  appId: "1:359397660943:web:9a8322d774f77bc6a9c67a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
