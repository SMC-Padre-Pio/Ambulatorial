import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Substitua com as configurações do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZO38dhFkZTmw9PHDxoa0pPGMbL7cAAlc",
  authDomain: "smc-ambulatorial.firebaseapp.com",
  databaseURL: "https://smc-ambulatorial-default-rtdb.firebaseio.com",
  projectId: "smc-ambulatorial",
  storageBucket: "smc-ambulatorial.firebasestorage.app",
  messagingSenderId: "449220550732",
  appId: "1:449220550732:web:fc55b9abaf548c5210d4e9"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o serviço de Autenticação
const auth = getAuth(app);

export { auth };