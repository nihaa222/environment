// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "environment-c02a9.firebaseapp.com",
  projectId: "environment-c02a9",
  storageBucket: "environment-c02a9.appspot.com",
  messagingSenderId: "423828149414",
  appId: "1:423828149414:web:4aa568620c4bbcbcec9067",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
