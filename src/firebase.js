import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. IMPORTAR O FIRESTORE

const firebaseConfig = {
  apiKey: "AIzaSyCZO38dhFkZTmw9PHDxoa0pPGMbL7cAAlc",
  authDomain: "smc-ambulatorial.firebaseapp.com",
  databaseURL: "https://smc-ambulatorial-default-rtdb.firebaseio.com",
  projectId: "smc-ambulatorial",
  storageBucket: "smc-ambulatorial.firebasestorage.app",
  messagingSenderId: "449220550732",
  appId: "1:449220550732:web:fc55b9abaf548c5210d4e9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };