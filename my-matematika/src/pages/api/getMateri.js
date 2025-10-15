// src/pages/api/getMateri.js
import admin from "firebase-admin";

const keyPath = {
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: process.env.PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.PUBLIC_FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(keyPath),
    });
}

const db = admin.firestore();

export async function GET() {
    try {
        const snapshot = await db
            .collection("materi")
            .orderBy("created_at", "desc")
            .get();

        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
            "Access-Control-Allow-Origin": "*",
        });
    } catch (err) {
            console.error("🔥 Error fetching materi:", err);
            return new Response(
            JSON.stringify({ success: false, message: err.message }),
            { status: 500 }
        );
    }
}
