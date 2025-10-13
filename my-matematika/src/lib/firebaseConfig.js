// src/lib/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged as _onAuthStateChanged,
    signOut as _signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    // measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID, // optional
    };

    let app;
    if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    } else {
    app = getApps()[0];
    }

export const auth = getAuth(app);
export const db = getFirestore(app);

export const onAuthStateChanged = _onAuthStateChanged;
export const signOut = _signOut;