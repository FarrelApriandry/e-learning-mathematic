import { db, admin} from "../../lib/firebaseAdmin";

// ===============================
// GET — Get all questions for a quiz event
// ===============================
export async function GET({ request }) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get("eventId");
    
        if (!eventId) {
            return new Response(
            JSON.stringify({ success: false, message: "eventId required" }),
            { status: 400 }
            );
        }
    
        const eventRef = db.collection("quiz_event").doc(eventId);
        const snapshot = await eventRef.collection("questions").get();
    
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    
        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
        });
        } catch (err) {
        console.error("❌ GET quiz_event_questions error:", err);
        return new Response(
            JSON.stringify({ success: false, message: err.message }),
            { status: 500 }
        );
    }
}

// ===============================
// POST /bulk_add — Add multiple questions
// ===============================
export async function POST({ request }) {
    try {
        const body = await request.json();
        const { eventId, questions } = body;

        if (!eventId || !questions?.length)
            return new Response(JSON.stringify({ success: false, message: "eventId & questions required" }), { status: 400 });

        const batch = db.batch();
        const ref = db.collection(`quiz_event/${eventId}/questions`);

        questions.forEach((q) => {
            const docRef = ref.doc();
            batch.set(docRef, {
            ...q,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
            });
        });

        await batch.commit();

        return new Response(JSON.stringify({ success: true, count: questions.length }), { status: 200 });
    } catch (err) {
        console.error("❌ BULK ADD quiz_event_questions error:", err);
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
