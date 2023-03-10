import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTNmzX9iwDBX3hRPw-vCSo1OpqKji8KZI",
  authDomain: "juanbri-face-recognition.firebaseapp.com",
  projectId: "juanbri-face-recognition",
  storageBucket: "juanbri-face-recognition.appspot.com",
  messagingSenderId: "792667054822",
  appId: "1:792667054822:web:cc258fbdddbfd0088ad127",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
