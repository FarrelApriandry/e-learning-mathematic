// src/pages/api/materi.js
import { db, admin } from "src/lib/firebaseAdmin";

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

// ✅ PUT: Update data materi yang sudah ada
export async function PUT({ request }) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ success: false, message: "ID materi tidak ditemukan." }),
                { status: 400 }
            );
        }

        updateData.updated_at = admin.firestore.FieldValue.serverTimestamp();

        await db.collection("materi").doc(id).update(updateData);

        return new Response(
            JSON.stringify({ success: true, message: "Materi berhasil diperbarui!" }),
            { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Error PUT materi:", err);
        return new Response(
            JSON.stringify({ success: false, message: err.message }),
            { status: 500 }
        );
    }
}

// ✅ DELETE: Hapus materi
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
