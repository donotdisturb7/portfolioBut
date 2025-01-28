// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsQRo2YFrTN2bi9-BtL84VOB9SFv2TXGM",
  authDomain: "portfoliobut.firebaseapp.com",
  projectId: "portfoliobut",
  storageBucket: "portfoliobut.firebasestorage.app",
  messagingSenderId: "20904307566",
  appId: "1:20904307566:web:b68dd76a952328ce956f7f",
  measurementId: "G-PCVPW8R4JN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { auth, db, analytics, storage };