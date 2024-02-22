// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b579a.firebaseapp.com",
  projectId: "mern-blog-b579a",
  storageBucket: "mern-blog-b579a.appspot.com",
  messagingSenderId: "459781394755",
  appId: "1:459781394755:web:2ce5b252335ff9809b9ff6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);