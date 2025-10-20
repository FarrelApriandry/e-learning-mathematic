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

// ✅ GET: Ambil semua quiz materi
export async function GET() {
    try {
        const snapshot = await db.collection("quiz_materi").get();
        const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));

        return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (err) {
        console.error("🔥 Error GET quiz_materi:", err);
        return new Response(
        JSON.stringify({ success: false, message: err.message }),
        { status: 500 }
        );
    }
}

    // ✅ POST: Tambahkan quiz baru
export async function POST({ request }) {
    try {
        const body = await request.json();

        const payload = {
            title: body.title,
            related_materi: body.related_materi,
            is_public: false,
            questions: body.questions || [],
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection("quiz_materi").add(payload);

        return new Response(
        JSON.stringify({ success: true, message: "Quiz materi berhasil ditambahkan!" }),
        { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Error POST quiz_materi:", err);
        return new Response(
        JSON.stringify({ success: false, message: err.message }),
        { status: 500 }
        );
    }
}

// ✅ DELETE: Hapus quiz berdasarkan ID
export async function DELETE({ request }) {
    try {
        const { id } = await request.json();

        if (!id)
        return new Response(
            JSON.stringify({ success: false, message: "ID quiz tidak ditemukan." }),
            { status: 400 }
        );

        await db.collection("quiz_materi").doc(id).delete();

        return new Response(
        JSON.stringify({ success: true, message: "Quiz berhasil dihapus!" }),
        { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Error DELETE quiz_materi:", err);
        return new Response(
        JSON.stringify({ success: false, message: err.message }),
        { status: 500 }
        );
    }
}

// ✅ PUT: Update quiz berdasarkan ID
export async function PUT({ request }) {
    try {
        const body = await request.json();
        const { id, ...updatedData } = body;

        if (!id)
            return new Response(
                JSON.stringify({ success: false, message: "ID quiz tidak ditemukan." }),
                { status: 400 }
            );

        updatedData.updated_at = admin.firestore.FieldValue.serverTimestamp();

        await db.collection("quiz_materi").doc(id).update(updatedData);

        return new Response(
            JSON.stringify({ success: true, message: "Quiz berhasil diperbarui!" }),
            { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Error PUT quiz_materi:", err);
        return new Response(
            JSON.stringify({ success: false, message: err.message }),
            { status: 500 }
        );
    }
}