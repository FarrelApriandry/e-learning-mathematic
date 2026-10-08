// src/pages/api/quiz_materi.js
import { verifyAdmin } from "../../lib/auth.js";
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
// GET — Ambil semua quiz materi, 1 quiz via ?id=,
// atau filter publik via ?class=10&status=published
// (kunci jawaban dibuang sebelum ke client)
// ===============================
export async function GET({ request }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = toId(searchParams.get("id"));
    const kelas = searchParams.get("class");
    const status = searchParams.get("status");

    const filters = [];
    if (kelas) filters.push(eq(quizMateri.class, kelas));
    if (status) filters.push(eq(quizMateri.status, status));

    const strip = (q) => ({
      ...q,
      questions: (q.questions || []).map(({ answer, ...rest }) => rest),
    });

    if (id) {
      const rows = await db
        .select()
        .from(quizMateri)
        .where(eq(quizMateri.id, id))
        .limit(1);
      if (rows.length === 0) return badRequest("Quiz tidak ditemukan.");
      return ok(strip(rows[0]));
    }

    let query = db.select().from(quizMateri).$dynamic();
    if (filters.length > 0) query = query.where(and(...filters));
    const rows = await query.orderBy(desc(quizMateri.created_at));

    return ok(rows.map(strip));
  } catch (err) {
    return serverError(err, "GET quiz_materi");
  }
}

// ===============================
// POST — Tambah quiz materi
// ===============================
export async function POST({ request }) {
  try {
    const gate = verifyAdmin(request);
    if (gate.error) return gate.error;
    const body = await readBody(request);

    if (!body.title) {
      return badRequest("Title wajib diisi.");
    }

    const [row] = await db
      .insert(quizMateri)
      .values({
        title: body.title,
        description: body.description ?? "",
        class: body.class ?? "",
        materi: body.materi ?? "",
        related_materi: body.related_materi ?? "",
        is_public: body.is_public ?? false,
        status: body.status ?? "draft",
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
    const gate = verifyAdmin(request);
    if (gate.error) return gate.error;
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("ID quiz tidak ditemukan.");

    const updates = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.class !== undefined) updates.class = body.class;
    if (body.materi !== undefined) updates.materi = body.materi;
    if (body.related_materi !== undefined)
      updates.related_materi = body.related_materi;
    if (body.is_public !== undefined) updates.is_public = body.is_public;
    if (body.status !== undefined) updates.status = body.status;
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
    const gate = verifyAdmin(request);
    if (gate.error) return gate.error;
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
