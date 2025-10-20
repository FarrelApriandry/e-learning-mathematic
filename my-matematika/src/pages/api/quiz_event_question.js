// src/pages/api/quiz_event_question.js
import admin from "firebase-admin";

// 🔐 Firebase Admin Init
const keyPath = {
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: import.meta.env.PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: import.meta.env.PUBLIC_FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(keyPath) });
const db = admin.firestore();

// ===============================
// GET — Get all questions for a quiz event
// ===============================
export async function GET({ request }) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get("eventId");
        if (!eventId)
        return new Response(JSON.stringify({ success: false, message: "eventId required" }), { status: 400 });

        const snapshot = await db
        .collection(`quiz_event/${eventId}/questions`)
        .orderBy("order", "asc")
        .get();

        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (err) {
        console.error("❌ GET quiz_event_questions error:", err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}


// ===============================
// POST — Add a new question to event
// ===============================
export async function POST({ request }) {
    try {
        const body = await request.json();
        const { eventId, question, options, answer, type, imageUrl, weight, metadata, order } = body;

        if (!eventId || !question)
        return new Response(JSON.stringify({ success: false, message: "eventId & question required" }), { status: 400 });

        const payload = {
            question,
            options: options || [],
            answer: answer ?? null, // index jawaban benar
            type: type || "multiple_choice", // multiple_choice | true_false | short_answer
            imageUrl: imageUrl || null,
            weight: weight || 1,
            metadata: metadata || {},
            order: order || Date.now(),
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        const ref = await db.collection(`quiz_event/${eventId}/questions`).add(payload);
        return new Response(JSON.stringify({ success: true, id: ref.id }), { status: 200 });
    } catch (err) {
        console.error("❌ POST quiz_event_questions error:", err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}


// ===============================
// PUT — Update a specific question
// ===============================
export async function PUT({ request }) {
    try {
        const body = await request.json();
        const { eventId, questionId, updates } = body;

        if (!eventId || !questionId)
        return new Response(JSON.stringify({ success: false, message: "eventId & questionId required" }), { status: 400 });

        const data = {
        ...updates,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection(`quiz_event/${eventId}/questions`).doc(questionId).set(data, { merge: true });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error("❌ PUT quiz_event_questions error:", err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}


// ===============================
// DELETE — Remove question by ID
// ===============================
export async function DELETE({ request }) {
    try {
        const { eventId, questionId } = await request.json();
        if (!eventId || !questionId)
        return new Response(JSON.stringify({ success: false, message: "eventId & questionId required" }), { status: 400 });

        await db.collection(`quiz_event/${eventId}/questions`).doc(questionId).delete();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error("❌ DELETE quiz_event_questions error:", err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}
