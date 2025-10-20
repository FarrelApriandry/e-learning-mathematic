import admin from "firebase-admin";

const keyPath = {
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: import.meta.env.PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: import.meta.env.PUBLIC_FIREBASE_CLIENT_EMAIL,
    };

if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(keyPath) });
}

const db = admin.firestore();

export { db };
export { admin };