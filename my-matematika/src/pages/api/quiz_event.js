// src/pages/api/quiz_event.js
import admin from "firebase-admin";

const keyPath = {
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: import.meta.env.PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: import.meta.env.PUBLIC_FIREBASE_CLIENT_EMAIL,
    };
    if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(keyPath) });
    const db = admin.firestore();

    export async function GET() {
    try {
        const snapshot = await db.collection("quiz_event").get();
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        const safe = data.map(e => {
        const questions = (e.questions || []).map(({ id, text, options, imageUrl, weight, type, metadata }) => ({ id, text, options, imageUrl, weight, type, metadata }));
        return { ...e, questions };
        });
        return new Response(JSON.stringify({ success: true, data: safe }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
    }

    export async function POST({ request }) {
    try {
        const body = await request.json();
        const payload = {
            title: body.title || "Event quiz",
            description: body.description || "Description event",
            access_code: body.access_code || null,
            duration_minutes: body.duration_minutes || 0,
            status: body.status || "draft",
            created_by: body.admin || "admin undefined",
            start_time: body.start_time ? admin.firestore.Timestamp.fromMillis(body.start_time) : null,
            end_time: body.end_time ? admin.firestore.Timestamp.fromMillis(body.end_time) : null,
            questions: body.questions || [],
            participants: body.participants || [],
            randomize_order: body.randomize_order ?? false,
            is_public_results: body.is_public_results ?? false,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };
        const ref = await db.collection("quiz_event").add(payload);
        return new Response(JSON.stringify({ success: true, id: ref.id }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
    }

    // simple PUT to update event by id
    export async function PUT({ request }) {
    try {
        const body = await request.json();
        if (!body.id) return new Response(JSON.stringify({ success: false, message: "id required" }), { status: 400 });
        const data = { ...body.updates };
        data.updated_at = admin.firestore.FieldValue.serverTimestamp();
        await db.collection("quiz_event").doc(body.id).set(data, { merge: true });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
    }

    export async function DELETE({ request }) {
    try {
        const { id } = await request.json();
        if (!id) return new Response(JSON.stringify({ success: false, message: "ID required" }), { status: 400 });
        await db.collection("quiz_event").doc(id).delete();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}
