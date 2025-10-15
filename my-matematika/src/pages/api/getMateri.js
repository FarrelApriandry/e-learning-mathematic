// src/pages/api/getMateri.js
import admin from "firebase-admin";
import fs from "node:fs";

const serviceAccount = JSON.parse(
    fs.readFileSync(new URL("../../lib/serviceAccountKey.json", import.meta.url))
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
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
