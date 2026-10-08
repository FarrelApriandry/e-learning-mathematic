import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import {
  materi,
  quizMateri,
  quizGlobal,
  quizEvent,
  quizEventQuestion,
  quizParticipant,
} from "../db/schema.js";

/**
 * Helpers bersama untuk API routes.
 * Semua response mengikuti format lama: { success: true/false, data?, message? }
 * sehingga komponen client tidak perlu berubah pada tahap ini.
 */

export function ok(data, extra = {}) {
  return new Response(JSON.stringify({ success: true, data, ...extra }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export function okMessage(message, extra = {}) {
  return new Response(JSON.stringify({ success: true, message, ...extra }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export function badRequest(message) {
  return new Response(JSON.stringify({ success: false, message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export function serverError(err, label = "API") {
  console.error(`🔥 Error ${label}:`, err);
  return new Response(
    JSON.stringify({ success: false, message: err?.message || String(err) }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

export async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

/** Ambil angka id dari body/path; balik null kalau tidak valid. */
export function toId(value) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** SOAL QUIZ — strip kunci jawaban sebelum dikirim ke client publik. */
export function stripAnswers(questions = []) {
  return questions.map(({ answer, ...rest }) => rest);
}

/** Generate access_code 6 digit unik untuk quiz event. */
export async function generateAccessCode() {
  for (let i = 0; i < 10; i++) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const existing = await db
      .select({ id: quizEvent.id })
      .from(quizEvent)
      .where(eq(quizEvent.access_code, code))
      .limit(1);
    if (existing.length === 0) return code;
  }
  throw new Error("Gagal generate access code unik");
}

export { eq, and, desc, asc, sql, materi, quizMateri, quizGlobal, quizEvent, quizEventQuestion, quizParticipant };
