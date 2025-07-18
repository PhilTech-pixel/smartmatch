// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDldEalry_nCemUSklSXKUCFJVVy5OPIbg",
  authDomain: "smartmatch-77ac3.firebaseapp.com",
  projectId: "smartmatch-77ac3",
  storageBucket: "smartmatch-77ac3.appspot.com",
  messagingSenderId: "279759956592",
  appId: "1:279759956592:web:3aa1e18ee4d3e1e5e0e2b5",
  measurementId: "G-20MKNVXMW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);