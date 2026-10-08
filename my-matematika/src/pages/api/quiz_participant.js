// src/pages/api/quiz_participant.js
// Pengganti src/lib/quiz_event_participant.js (yang sebelumnya menulis
// Firestore langsung dari browser).
//
// Endpoints (pakai query param `action`):
//   GET  ?action=get&quiz_type=event&quiz_id=1&uid=xxx   -> data 1 peserta
//   GET  ?action=all&quiz_type=event&quiz_id=1           -> semua peserta
//   GET  ?action=result&quiz_type=event&quiz_id=1&uid=xx -> hasil 1 user
//   POST { action: "join",     quiz_type, quiz_id, uid, name? }
//   POST { action: "submit",   quiz_type, quiz_id, uid, answers, score, total }
//
// Aturan event: cek start_time/end_time/status, access_code wajib saat join,
// auto-closed kalau semua peserta selesai (mengikuti perilaku lama).
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
  quizEvent,
  quizParticipant,
} from "../../lib/apiHelpers.js";
import { db } from "../../db/index.js";

const TYPES = ["materi", "global", "event"];

function validateEventStatus(event, { requireOpen = false } = {}) {
  const now = new Date();
  const start = event.start_time ? new Date(event.start_time) : null;
  const end = event.end_time ? new Date(event.end_time) : null;

  if (start && now < start) throw new Error("Event belum dimulai");
  if ((end && now > end) || event.status === "closed")
    throw new Error("Event sudah berakhir");
  if (requireOpen && event.status === "draft")
    throw new Error("Event belum dibuka");
}

// ===============================
// GET
// ===============================
export async function GET({ request }) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "get";
    const quizType = searchParams.get("quiz_type");
    const quizId = toId(searchParams.get("quiz_id"));
    const uid = searchParams.get("uid");

    if (!TYPES.includes(quizType) || !quizId) {
      return badRequest("quiz_type & quiz_id wajib diisi");
    }

    const baseWhere = and(
      eq(quizParticipant.quiz_type, quizType),
      eq(quizParticipant.quiz_id, quizId)
    );

    if (action === "get") {
      if (!uid) return badRequest("uid wajib diisi");
      const rows = await db
        .select()
        .from(quizParticipant)
        .where(and(baseWhere, eq(quizParticipant.uid, uid)))
        .limit(1);
      return ok(rows[0] || null);
    }

    if (action === "all") {
      // hasil publik: kalau event, harus is_public_results
      if (quizType === "event") {
        const [event] = await db
          .select()
          .from(quizEvent)
          .where(eq(quizEvent.id, quizId))
          .limit(1);
        if (!event) return badRequest("Event tidak ditemukan");
        if (!event.is_public_results)
          return badRequest("Hasil tidak bersifat publik");
      }
      const rows = await db
        .select()
        .from(quizParticipant)
        .where(baseWhere)
        .orderBy(asc(quizParticipant.joined_at));
      return ok(rows);
    }

    if (action === "result") {
      if (!uid) return badRequest("uid wajib diisi");
      const rows = await db
        .select()
        .from(quizParticipant)
        .where(and(baseWhere, eq(quizParticipant.uid, uid)))
        .limit(1);
      const p = rows[0];
      if (!p) return badRequest("Peserta tidak ditemukan");
      return ok({
        uid: p.uid,
        name: p.name,
        score: p.score,
        total: p.total,
        completed_at: p.completed_at,
      });
    }

    return badRequest("action tidak dikenal");
  } catch (err) {
    return serverError(err, "GET quiz_participant");
  }
}

// ===============================
// POST — join / submit
// ===============================
export async function POST({ request }) {
  try {
    const body = await readBody(request);
    const action = body.action;
    const quizType = body.quiz_type;
    const quizId = toId(body.quiz_id);
    const uid = body.uid || null;

    if (!TYPES.includes(quizType) || !quizId) {
      return badRequest("quiz_type & quiz_id wajib diisi");
    }

    // ---------- JOIN ----------
    if (action === "join") {
      if (quizType === "event") {
        if (!uid) return badRequest("uid wajib diisi untuk event");
        const [event] = await db
          .select()
          .from(quizEvent)
          .where(eq(quizEvent.id, quizId))
          .limit(1);
        if (!event) return badRequest("Event tidak ditemukan");

        if (body.access_code !== event.access_code) {
          return badRequest("Access code salah");
        }

        validateEventStatus(event, { requireOpen: true });

        if (
          event.max_participants > 0 &&
          (event.participant_count ?? 0) >= event.max_participants
        ) {
          return badRequest("Kuota peserta penuh");
        }

        const existing = await db
          .select()
          .from(quizParticipant)
          .where(
            and(
              eq(quizParticipant.quiz_type, quizType),
              eq(quizParticipant.quiz_id, quizId),
              eq(quizParticipant.uid, uid)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          return okMessage("Kamu sudah join event ini", {
            participant: existing[0],
          });
        }

        const [row] = await db
          .insert(quizParticipant)
          .values({
            quiz_type: quizType,
            quiz_id: quizId,
            uid,
            name: body.name ?? null,
            score: 0,
            total: 0,
            answers: [],
          })
          .returning();

        return okMessage("Berhasil join event!", { participant: row });
      }

      // materi/global: tanpa uid, cukup nama (mengikuti perilaku lama)
      const [row] = await db
        .insert(quizParticipant)
        .values({
          quiz_type: quizType,
          quiz_id: quizId,
          name: body.name || "Anon",
          score: 0,
          total: 0,
          answers: [],
        })
        .returning();

      return okMessage("Berhasil join quiz!", { participant: row });
    }

    // ---------- SUBMIT ----------
    if (action === "submit") {
      const answers = body.answers ?? [];
      const score = body.score ?? 0;
      const total = body.total ?? 0;

      if (quizType === "event") {
        if (!uid) return badRequest("uid wajib diisi untuk event");

        const [event] = await db
          .select()
          .from(quizEvent)
          .where(eq(quizEvent.id, quizId))
          .limit(1);
        if (!event) return badRequest("Event tidak ditemukan");
        validateEventStatus(event);

        const [updated] = await db
          .update(quizParticipant)
          .set({
            answers,
            score,
            total,
            completed_at: new Date(),
          })
          .where(
            and(
              eq(quizParticipant.quiz_type, quizType),
              eq(quizParticipant.quiz_id, quizId),
              eq(quizParticipant.uid, uid)
            )
          )
          .returning();

        if (!updated) return badRequest("Kamu belum join event ini");

        // perilaku lama: kalau semua peserta selesai, event auto-closed
        const all = await db
          .select({ completed_at: quizParticipant.completed_at })
          .from(quizParticipant)
          .where(
            and(
              eq(quizParticipant.quiz_type, quizType),
              eq(quizParticipant.quiz_id, quizId)
            )
          );
        const allCompleted = all.every((p) => p.completed_at !== null);
        if (allCompleted && event.status !== "closed") {
          await db
            .update(quizEvent)
            .set({ status: "closed", updated_at: new Date() })
            .where(eq(quizEvent.id, quizId));
        }

        return okMessage("Jawaban berhasil disubmit!", { score });
      }

      // materi/global: simpan hasil baru (browser lama langsung addDoc)
      const [row] = await db
        .insert(quizParticipant)
        .values({
          quiz_type: quizType,
          quiz_id: quizId,
          name: body.name || "Anon",
          score,
          total,
          answers,
          completed_at: new Date(),
        })
        .returning();

      return okMessage("Hasil quiz berhasil disimpan!", { id: row.id });
    }

    return badRequest("action tidak dikenal");
  } catch (err) {
    return serverError(err, "POST quiz_participant");
  }
}
