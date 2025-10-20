import { db, admin } from "src/lib/firebaseAdmin";

export async function GET() {
    try {
        const snapshot = await db.collection("quiz_global").get();
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // strip correctIndex before returning to client
        const safe = data.map(q => {
        const questions = (q.questions || []).map(({ id, text, options, imageUrl, weight, type, metadata }) => ({
            id, text, options, imageUrl, weight, type, metadata
        }));
        return { ...q, questions };
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
            title: body.title || "Untitled",
            description: body.description || "",
            visibilty: body.visibilty || "",
            category: body.category || "",
            questions: body.questions || [],
            randomize_order: body.randomize_order ?? true,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };
        const ref = await db.collection("quiz_global").add(payload);
        return new Response(JSON.stringify({ success: true, id: ref.id }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
    }

    // basic DELETE by id
    export async function DELETE({ request }) {
    try {
        const { id } = await request.json();
        if (!id) return new Response(JSON.stringify({ success: false, message: "ID required" }), { status: 400 });
        await db.collection("quiz_global").doc(id).delete();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
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

        await db.collection("quiz_global").doc(id).update(updatedData);

        return new Response(
            JSON.stringify({ success: true, message: "Quiz Global berhasil diperbarui!" }),
            { status: 200 }
        );
    } catch (err) {
        console.error("🔥 Error PUT quiz_global:", err);
        return new Response(
            JSON.stringify({ success: false, message: err.message }),
            { status: 500 }
        );
    }
}