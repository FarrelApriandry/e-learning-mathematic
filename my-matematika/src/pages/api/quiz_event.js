// src/pages/api/quiz_event.js
import admin from "firebase-admin";

// 🔐 Firebase Admin Initialization
const keyPath = {
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: import.meta.env.PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: import.meta.env.PUBLIC_FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(keyPath) });
const db = admin.firestore();

// ===============================
// GET — Fetch all quiz events
// ===============================
export async function GET() {
    try {
        const snapshot = await db.collection("quiz_event").orderBy("created_at", "desc").get();
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return new Response(
        JSON.stringify({ success: true, data }),
        { status: 200 }
        );
    } catch (err) {
        console.error("❌ GET quiz_event error:", err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}

// ===============================
// POST — Create new quiz event
// ===============================
export async function POST({ request }) {
    try {
        const generate_access_code = Math.floor(100000 + Math.random() * 900000).toString();
        const body = await request.json();

        const payload = {
            title: body.title || "Untitled Quiz Event",
            description: body.description || "",
            category: body.category || "",
            duration_minutes: body.duration_minutes || 0,

            start_time: body.start_time
            ? admin.firestore.Timestamp.fromDate(new Date(body.start_time))
            : null,
            end_time: body.end_time
            ? admin.firestore.Timestamp.fromDate(new Date(body.end_time))
            : null,

            access_code: generate_access_code,
            status: body.status || "draft",
            randomize_order: body.randomize_order ?? false,
            shuffle_options: body.shuffle_options ?? false,
            is_public_results: body.is_public_results ?? false,
            max_participants: body.max_participants || 0,

            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        const ref = await db.collection("quiz_event").add(payload);

        return new Response(
            JSON.stringify({
            success: true,
            id: ref.id,
            access_code: generate_access_code,
            }),
            { status: 200 }
        );
        } catch (err) {
        console.error("❌ POST quiz_event error:", err);
        return new Response(
            JSON.stringify({ success: false, message: err.message }),
            { status: 500 }
        );
    }
}

// ===============================
// PUT — Update quiz event by ID
// ===============================
export async function PUT({ request }) {
    try {
        const body = await request.json();
            if (!body.id)
            return new Response(JSON.stringify({ success: false, message: "id required" }), { status: 400 });

            const updates = {
            ...body.updates,
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
            last_modified_by: body.last_modified_by || "admin_undefined",
        };

        await db.collection("quiz_event").doc(body.id).set(updates, { merge: true });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error("❌ PUT quiz_event error:", err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}


// ===============================
// DELETE — Delete quiz event by ID
// ===============================
export async function DELETE({ request }) {
    try {
        const { id } = await request.json();
        if (!id)
        return new Response(JSON.stringify({ success: false, message: "id required" }), { status: 400 });

        // 🔥 Delete main document
        await db.collection("quiz_event").doc(id).delete();

        // ⚠️ cleanup: delete its subcollections
        const subCollections = ["questions", "participants"];
        for (const sub of subCollections) {
            const subRef = db.collection(`quiz_event/${id}/${sub}`);
            const subSnap = await subRef.get();
            const batch = db.batch();
            subSnap.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error("❌ DELETE quiz_event error:", err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}
