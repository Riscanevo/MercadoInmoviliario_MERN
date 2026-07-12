// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-state-72efa.firebaseapp.com",
  projectId: "mern-state-72efa",
  storageBucket: "mern-state-72efa.firebasestorage.app",
  messagingSenderId: "426936821581",
  appId: "1:426936821581:web:38907d0ddac5184678f904",
  measurementId: "G-65RPCLJY3M"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);