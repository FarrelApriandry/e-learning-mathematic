// src/pages/api/quiz_materi.js
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
  quizMateri,
  quizParticipant,
} from "../../lib/apiHelpers.js";
import { db } from "../../db/index.js";

// ===============================
// GET — Ambil semua quiz materi
// (kunci jawaban dibuang sebelum ke client)
// ===============================
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(quizMateri)
      .orderBy(desc(quizMateri.created_at));

    const data = rows.map((q) => ({
      ...q,
      questions: (q.questions || []).map(({ answer, ...rest }) => rest),
    }));

    return ok(data);
  } catch (err) {
    return serverError(err, "GET quiz_materi");
  }
}

// ===============================
// POST — Tambah quiz materi
// ===============================
export async function POST({ request }) {
  try {
    const body = await readBody(request);

    if (!body.title) {
      return badRequest("Title wajib diisi.");
    }

    const [row] = await db
      .insert(quizMateri)
      .values({
        title: body.title,
        related_materi: body.related_materi ?? "",
        is_public: body.is_public ?? false,
        questions: body.questions || [],
      })
      .returning();

    return okMessage("Quiz materi berhasil ditambahkan!", { id: row.id });
  } catch (err) {
    return serverError(err, "POST quiz_materi");
  }
}

// ===============================
// PUT — Update quiz materi by ID
// ===============================
export async function PUT({ request }) {
  try {
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("ID quiz tidak ditemukan.");

    const updates = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.related_materi !== undefined)
      updates.related_materi = body.related_materi;
    if (body.is_public !== undefined) updates.is_public = body.is_public;
    if (body.questions !== undefined) updates.questions = body.questions;
    updates.updated_at = new Date();

    await db.update(quizMateri).set(updates).where(eq(quizMateri.id, id));

    return okMessage("Quiz berhasil diperbarui!");
  } catch (err) {
    return serverError(err, "PUT quiz_materi");
  }
}

// ===============================
// DELETE — Hapus quiz materi by ID
// ===============================
export async function DELETE({ request }) {
  try {
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("ID quiz tidak ditemukan.");

    // participants tidak ber-FK (polymorphic), jadi dihapus manual dulu
    await db.delete(quizParticipant).where(
      and(
        eq(quizParticipant.quiz_type, "materi"),
        eq(quizParticipant.quiz_id, id)
      )
    );

    await db.delete(quizMateri).where(eq(quizMateri.id, id));

    return okMessage("Quiz berhasil dihapus!");
  } catch (err) {
    return serverError(err, "DELETE quiz_materi");
  }
}
