// src/pages/api/materi.js
import admin from "firebase-admin";
import fs from 'fs';
// import serviceAccount from "../../lib/serviceAccountKey.json" assert { type: "json" };

const serviceAccount = JSON.parse(
    fs.readFileSync(new URL("../../lib/serviceAccountKey.json", import.meta.url))
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

export async function POST({ request }) {
    try {
        const body = await request.json();

        const payload = {
        title: body.title,
        description: body.description,
        class: body.class,
        materi: body.materi,
        youtube_link: body.youtube_link,
        pdf_link: body.pdf_link,
        downloads: 0,
        views: 0,
        created_by: 1,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection("materi").add(payload);

        return new Response(
        JSON.stringify({ success: true, message: "Materi berhasil ditambahkan!" }),
        { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Firestore Error:", err);
        return new Response(
        JSON.stringify({ success: false, message: err.message }),
        { status: 500 }
        );
    }
}
