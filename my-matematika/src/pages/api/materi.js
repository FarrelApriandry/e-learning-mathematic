// src/pages/api/materi.js
import admin from "firebase-admin";

const keyPath = {
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: import.meta.env.PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: import.meta.env.PUBLIC_FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(keyPath),
    });
}

const db = admin.firestore();

// ✅ GET: Ambil semua materi dari Firestore
export async function GET() {
    try {
        const snapshot = await db.collection("materi").get();
        const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));

        return new Response(
        JSON.stringify({ success: true, data }),
        { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Error GET materi:", err);
        return new Response(
        JSON.stringify({ success: false, message: err.message }),
        { status: 500 }
        );
    }
}

    // ✅ POST: Tambahkan materi baru ke Firestore
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

export async function DELETE({ request }) {
    try {
        const { id } = await request.json();

        if (!id) {
        return new Response(
            JSON.stringify({ success: false, message: "ID materi tidak ditemukan." }),
            { status: 400 }
        );
        }

        await db.collection("materi").doc(id).delete();

        return new Response(
        JSON.stringify({ success: true, message: "Materi berhasil dihapus!" }),
        { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Error DELETE materi:", err);
        return new Response(
        JSON.stringify({ success: false, message: err.message }),
        { status: 500 }
        );
    }
}
