// src/lib/firebaseConfig.js
// Firebase Auth SAJA (sementara, sampai auth migrasi ke Postgres).
// Semua data sudah pindah ke Neon Postgres (src/db/) — jangan tambahkan
// Firestore di sini lagi.
//
// Kalau env Firebase belum diisi (mis. dev lokal baru clone), app tetap
// jalan: auth = null dan komponen harus menangani kasus itu.

import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
        apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
        authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
        measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID, // optional
    };

const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let auth = null;
let authModule = null;
let currentUser = null;

if (configured) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    authModule = await import("firebase/auth");
    auth = authModule.getAuth(app);

    authModule.onAuthStateChanged(auth, (user) => {
        currentUser = user;
        console.log("[Auth] State changed:", user ? user.email : "No user");
    });
} else {
    console.warn(
        "[Auth] PUBLIC_FIREBASE_* belum diisi di .env — login admin nonaktif (data tetap jalan via Neon)."
    );
}

export { auth, configured };

export const getCurrentUser = () => currentUser;

export const onAuthStateChanged = (cb) => {
    if (!auth) {
        cb(null);
        return () => {};
    }
    return authModule.onAuthStateChanged(auth, cb);
};

export const signOut = (...args) =>
    auth ? authModule.signOut(...args) : Promise.resolve();

export const signInWithEmailAndPassword = (...args) => {
    if (!auth)
        return Promise.reject(
            new Error("Auth belum dikonfigurasi — isi PUBLIC_FIREBASE_* di .env.")
        );
    return authModule.signInWithEmailAndPassword(...args);
};

