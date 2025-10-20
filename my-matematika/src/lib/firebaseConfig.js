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

let currentUser = null;

_onAuthStateChanged(auth, (user) => {
    currentUser = user;
    console.log("[Auth] State changed:", user ? user.email : "No user");
});

export const getCurrentUser = () => currentUser;

export const onAuthStateChanged = _onAuthStateChanged;
export const signOut = _signOut;

export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, "materi"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify([]), { status: 500 });
    }
}