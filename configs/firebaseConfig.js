// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLEFHf-CzcaYj50Un3llJV6ZxANdzBzQU",
  authDomain: "tripeasy-5a00a.firebaseapp.com",
  projectId: "tripeasy-5a00a",
  storageBucket: "tripeasy-5a00a.firebasestorage.app",
  messagingSenderId: "955021253791",
  appId: "1:955021253791:web:1e5e35ce21bfa9862b56aa",
  measurementId: "G-Q8WNJLY1JL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
