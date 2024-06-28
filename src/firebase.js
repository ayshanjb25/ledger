// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore,doc, setDoc} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBGhN43s0TpdBJqniYXi7O-OdbBv9O6Kk",
  authDomain: "ledger-app-ec512.firebaseapp.com",
  projectId: "ledger-app-ec512",
  storageBucket: "ledger-app-ec512.appspot.com",
  messagingSenderId: "912913397819",
  appId: "1:912913397819:web:44ab3c2df5f90c0b00041e",
  measurementId: "G-20GSZF42B5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export{db, auth, provider,doc,setDoc};