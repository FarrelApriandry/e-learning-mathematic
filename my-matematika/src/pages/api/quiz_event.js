// src/pages/api/quiz_event.js
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
  quizEvent,
  quizEventQuestion,
  quizParticipant,
  generateAccessCode,
} from "../../lib/apiHelpers.js";
import { db } from "../../db/index.js";

/** Kolom quiz_event yang boleh di-update via PUT (whitelist). */
const UPDATABLE = [
  "title",
  "description",
  "category",
  "duration_minutes",
  "start_time",
  "end_time",
  "status",
  "randomize_order",
  "shuffle_options",
  "is_public_results",
  "max_participants",
];

/** Parse kolom timestamp/number dengan aman dari payload client. */
function sanitizeUpdates(updates = {}) {
  const clean = {};
  for (const key of UPDATABLE) {
    if (updates[key] === undefined) continue;
    if (key === "start_time" || key === "end_time") {
      clean[key] = updates[key] ? new Date(updates[key]) : null;
    } else {
      clean[key] = updates[key];
    }
  }
  return clean;
}

// ===============================
// GET — Fetch all quiz events, atau 1 via ?id=
// ===============================
export async function GET({ request }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = toId(searchParams.get("id"));

    if (id) {
      const rows = await db
        .select()
        .from(quizEvent)
        .where(eq(quizEvent.id, id))
        .limit(1);
      if (rows.length === 0) return badRequest("Event tidak ditemukan.");
      return ok(rows[0]);
    }

    const data = await db
      .select()
      .from(quizEvent)
      .orderBy(desc(quizEvent.created_at));

    return ok(data);
  } catch (err) {
    return serverError(err, "GET quiz_event");
  }
}

// ===============================
// POST — Create new quiz event
// ===============================
export async function POST({ request }) {
  try {
    const body = await readBody(request);
    const access_code = await generateAccessCode();

    const [row] = await db
      .insert(quizEvent)
      .values({
        title: body.title || "Untitled Quiz Event",
        description: body.description ?? "",
        category: body.category ?? "",
        duration_minutes: body.duration_minutes || 0,
        start_time: body.start_time ? new Date(body.start_time) : null,
        end_time: body.end_time ? new Date(body.end_time) : null,
        access_code,
        status: body.status || "draft",
        randomize_order: body.randomize_order ?? false,
        shuffle_options: body.shuffle_options ?? false,
        is_public_results: body.is_public_results ?? false,
        max_participants: body.max_participants || 0,
      })
      .returning();

    return okMessage("Quiz event berhasil dibuat!", {
      id: row.id,
      access_code,
    });
  } catch (err) {
    return serverError(err, "POST quiz_event");
  }
}

// ===============================
// PUT — Update quiz event by ID
// Client lama kirim: { id, updates: {...}, last_modified_by }
// ===============================
export async function PUT({ request }) {
  try {
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("id required");

    const updates = sanitizeUpdates(body.updates ?? body);
    updates.last_modified_by = body.last_modified_by || "admin_undefined";
    updates.updated_at = new Date();

    await db.update(quizEvent).set(updates).where(eq(quizEvent.id, id));

    return okMessage("Quiz event berhasil diperbarui!");
  } catch (err) {
    return serverError(err, "PUT quiz_event");
  }
}

// ===============================
// DELETE — Delete quiz event by ID
// questions terhapus otomatis (FK cascade);
// participants dihapus manual (polymorphic).
// ===============================
export async function DELETE({ request }) {
  try {
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("id required");

    await db
      .delete(quizParticipant)
      .where(
        and(
          eq(quizParticipant.quiz_type, "event"),
          eq(quizParticipant.quiz_id, id)
        )
      );

    await db.delete(quizEvent).where(eq(quizEvent.id, id));

    return okMessage("Quiz event berhasil dihapus!");
  } catch (err) {
    return serverError(err, "DELETE quiz_event");
  }
}
