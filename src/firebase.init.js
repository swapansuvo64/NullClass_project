import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyArYeE3sbz46wy2LaWkjWuRb7UkyN7nOT0",
  authDomain: "newone-eadcc.firebaseapp.com",
  projectId: "newone-eadcc",
  storageBucket: "newone-eadcc.appspot.com",
  messagingSenderId: "918670142629",
  appId: "1:918670142629:web:fd435af2c683e0dd82f14c",
  measurementId: "G-4DHXHD4GEN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
