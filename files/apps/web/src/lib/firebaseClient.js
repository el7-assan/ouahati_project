import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDpfTO-KjT03VnBZ4cp-aFi1AlZCQaYQC8",
  authDomain: "ouahati-8526d.firebaseapp.com",
  projectId: "ouahati-8526d",
  storageBucket: "ouahati-8526d.firebasestorage.app",
  messagingSenderId: "327797738738",
  appId: "1:327797738738:web:44153ea7b159cd9ec8146b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);