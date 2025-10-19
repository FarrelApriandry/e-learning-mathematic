import admin from "firebase-admin";

const db = admin.firestore();

// ✅ POST: Simpan hasil quiz user
export async function POST({ request }) {
    try {
        const body = await request.json();

        const payload = {
        user_id: body.user_id,
        quiz_id: body.quiz_id,
        answers: body.answers, // [{ question_id, selected_option }]
        score: body.score,
        started_at: body.started_at,
        finished_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection("user_attempts").add(payload);

        return new Response(
        JSON.stringify({ success: true, message: "Jawaban user berhasil disimpan!" }),
        { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Error POST user_attempts:", err);
        return new Response(
        JSON.stringify({ success: false, message: err.message }),
        { status: 500 }
        );
    }
}
