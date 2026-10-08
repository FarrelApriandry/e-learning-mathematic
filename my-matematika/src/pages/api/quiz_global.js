// src/pages/api/quiz_global.js
import {
  ok,
  okMessage,
  badRequest,
  serverError,
  readBody,
  toId,
  eq,
  and,
  desc,
  quizGlobal,
  quizParticipant,
} from "../../lib/apiHelpers.js";
import { db } from "../../db/index.js";

// ===============================
// GET — Ambil semua quiz global, atau 1 via ?id=
// (kunci jawaban dibuang sebelum ke client)
// ===============================
export async function GET({ request }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = toId(searchParams.get("id"));

    const strip = (q) => ({
      ...q,
      questions: (q.questions || []).map(({ answer, ...rest }) => rest),
    });

    if (id) {
      const rows = await db
        .select()
        .from(quizGlobal)
        .where(eq(quizGlobal.id, id))
        .limit(1);
      if (rows.length === 0) return badRequest("Quiz tidak ditemukan.");
      return ok(strip(rows[0]));
    }

    const rows = await db
      .select()
      .from(quizGlobal)
      .orderBy(desc(quizGlobal.created_at));

    return ok(rows.map(strip));
  } catch (err) {
    return serverError(err, "GET quiz_global");
  }
}

// ===============================
// POST — Tambah quiz global
// ===============================
export async function POST({ request }) {
  try {
    const body = await readBody(request);

    const [row] = await db
      .insert(quizGlobal)
      .values({
        title: body.title || "Untitled",
        description: body.description ?? "",
        // NOTE: ejaan "visibilty" sengaja mengikuti kode lama (Firestore)
        // supaya payload client yang sudah ada tetap jalan.
        visibilty: body.visibilty ?? "",
        category: body.category ?? "",
        questions: body.questions || [],
        randomize_order: body.randomize_order ?? true,
      })
      .returning();

    return okMessage("Quiz global berhasil ditambahkan!", { id: row.id });
  } catch (err) {
    return serverError(err, "POST quiz_global");
  }
}

// ===============================
// PUT — Update quiz global by ID
// ===============================
export async function PUT({ request }) {
  try {
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("ID quiz tidak ditemukan.");

    const updates = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.visibilty !== undefined) updates.visibilty = body.visibilty;
    if (body.category !== undefined) updates.category = body.category;
    if (body.questions !== undefined) updates.questions = body.questions;
    if (body.randomize_order !== undefined)
      updates.randomize_order = body.randomize_order;
    updates.updated_at = new Date();

    await db.update(quizGlobal).set(updates).where(eq(quizGlobal.id, id));

    return okMessage("Quiz Global berhasil diperbarui!");
  } catch (err) {
    return serverError(err, "PUT quiz_global");
  }
}

// ===============================
// DELETE — Hapus quiz global by ID
// ===============================
export async function DELETE({ request }) {
  try {
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("ID quiz tidak ditemukan.");

    // participants tidak ber-FK (polymorphic), jadi dihapus manual dulu
    await db.delete(quizParticipant).where(
      and(
        eq(quizParticipant.quiz_type, "global"),
        eq(quizParticipant.quiz_id, id)
      )
    );

    await db.delete(quizGlobal).where(eq(quizGlobal.id, id));

    return okMessage("Quiz global berhasil dihapus!");
  } catch (err) {
    return serverError(err, "DELETE quiz_global");
  }
}
