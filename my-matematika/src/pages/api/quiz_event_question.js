// src/pages/api/quiz_event_question.js
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
  asc,
  quizEventQuestion,
} from "../../lib/apiHelpers.js";
import { db } from "../../db/index.js";

// ===============================
// GET — Get all questions for a quiz event (?eventId=)
// ===============================
export async function GET({ request }) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = toId(searchParams.get("eventId"));

    if (!eventId) {
      return badRequest("eventId required");
    }

    const data = await db
      .select()
      .from(quizEventQuestion)
      .where(eq(quizEventQuestion.event_id, eventId))
      .orderBy(asc(quizEventQuestion.order), asc(quizEventQuestion.id));

    return ok(data);
  } catch (err) {
    return serverError(err, "GET quiz_event_questions");
  }
}

// ===============================
// POST /bulk_add — Add multiple questions
// Body: { eventId, questions: [{ question, options[4], answer }] }
// ===============================
export async function POST({ request }) {
  try {
    const body = await readBody(request);
    const { questions } = body;
    const eventId = toId(body.eventId);

    if (!eventId || !questions?.length) {
      return badRequest("eventId & questions required");
    }

    const rows = await db
      .insert(quizEventQuestion)
      .values(
        questions.map((q, i) => ({
          event_id: eventId,
          question: q.question ?? "",
          options: q.options ?? [],
          answer: q.answer !== undefined ? String(q.answer) : "",
          order: q.order ?? i,
        }))
      )
      .returning();

    return okMessage("Soal berhasil ditambahkan!", { count: rows.length });
  } catch (err) {
    return serverError(err, "BULK ADD quiz_event_questions");
  }
}

// ===============================
// PUT — Update a specific question
// Body: { eventId, questionId, updates }
// ===============================
export async function PUT({ request }) {
  try {
    const body = await readBody(request);
    const eventId = toId(body.eventId);
    const questionId = toId(body.questionId);

    if (!eventId || !questionId) {
      return badRequest("eventId & questionId required");
    }

    const updates = {};
    const u = body.updates ?? {};
    if (u.question !== undefined) updates.question = u.question;
    if (u.options !== undefined) updates.options = u.options;
    if (u.answer !== undefined) updates.answer = String(u.answer);
    if (u.order !== undefined) updates.order = u.order;
    updates.updated_at = new Date();

    await db
      .update(quizEventQuestion)
      .set(updates)
      .where(
        and(
          eq(quizEventQuestion.id, questionId),
          eq(quizEventQuestion.event_id, eventId)
        )
      );

    return okMessage("Soal berhasil diperbarui!");
  } catch (err) {
    return serverError(err, "PUT quiz_event_questions");
  }
}

// ===============================
// DELETE — Remove question by ID
// Body: { eventId, questionId }
// ===============================
export async function DELETE({ request }) {
  try {
    const body = await readBody(request);
    const eventId = toId(body.eventId);
    const questionId = toId(body.questionId);

    if (!eventId || !questionId) {
      return badRequest("eventId & questionId required");
    }

    await db
      .delete(quizEventQuestion)
      .where(
        and(
          eq(quizEventQuestion.id, questionId),
          eq(quizEventQuestion.event_id, eventId)
        )
      );

    return okMessage("Soal berhasil dihapus!");
  } catch (err) {
    return serverError(err, "DELETE quiz_event_questions");
  }
}
