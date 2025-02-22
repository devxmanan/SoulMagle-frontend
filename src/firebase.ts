
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCqChQwEE1jqagVYULacZ9Zfv0r2U3WyRY",
    authDomain: "soul-megle.firebaseapp.com",
    projectId: "soul-megle",
    storageBucket: "soul-megle.firebasestorage.app",
    messagingSenderId: "37196273010",
    appId: "1:37196273010:web:daf56291995e0db080f9eb",
    measurementId: "G-7LLG6MN61F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();


export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        return user;
    } catch (error) {
        console.error("Error during Google Sign-In:", error);
        return false;
    }
};