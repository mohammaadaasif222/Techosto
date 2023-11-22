// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "estate-fe3c2.firebaseapp.com",
  projectId: "estate-fe3c2",
  storageBucket: "estate-fe3c2.appspot.com",
  messagingSenderId: "1068667879023",
  appId: "1:1068667879023:web:94f02f7d1b211a7fa0d79a"
}; 

// Initialize Firebase
export const app = initializeApp(firebaseConfig);