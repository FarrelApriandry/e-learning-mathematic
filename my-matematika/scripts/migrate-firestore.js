// scripts/migrate-firestore.js
// Migrasi data Firestore -> Neon Postgres (Drizzle).
//
// Script ini TIDAK butuh akses live ke Firebase. Caranya:
//   1. Export tiap koleksi Firestore jadi file JSON (mis. dari Firebase
//      Console, atau `firebase firestore:export`, lalu konversi ke JSON).
//   2. Taruh di scripts/firestore-export/ dengan nama:
//        materi.json, quiz_materi.json, quiz_global.json,
//        quiz_event.json, quiz_event_questions.json (opsional),
//        users.json (opsional), quiz_participant.json (opsional)
//      Tiap file = array dokumen: [{ id: "<id-lama>", ...field }, ...]
//      Timestamp Firestore boleh {seconds:...} / {_seconds:...} / string ISO.
//   3. Jalankan: npm run migrate:firestore [-- --dry-run] [--only=quiz_materi]
//
// Catatan: ID lama (string Firestore) TIDAK dipertahankan — Postgres pakai
// serial baru. Relasi event->questions di-petakan otomatis selama migrasi.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../src/db/index.js";
import {
  materi,
  quizMateri,
  quizGlobal,
  quizEvent,
  quizEventQuestion,
  quizParticipant,
  users,
} from "../src/db/schema.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const EXPORT_DIR = path.join(root, "scripts", "firestore-export");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const ONLY = (args.find((a) => a.startsWith("--only=")) || "").slice(7);

function load(name) {
  const p = path.join(EXPORT_DIR, `${name}.json`);
  if (!fs.existsSync(p)) return null;
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  return Array.isArray(data) ? data : data.docs || data.data || [];
}

/** Normalkan Timestamp Firestore / ISO / epoch -> Date | null. */
function toDate(v) {
  if (v === null || v === undefined || v === "") return null;
  if (v instanceof Date) return v;
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof v === "object") {
    const s = v.seconds ?? v._seconds ?? v.$seconds;
    if (s !== undefined && s !== null) return new Date(Number(s) * 1000);
    if (v._nanoseconds !== undefined && v._seconds !== undefined) {
      return new Date(Number(v._seconds) * 1000);
    }
  }
  return null;
}

const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

async function put(table, values) {
  if (DRY_RUN) return { id: "(dry-run)" };
  const [row] = await db.insert(table).values(values).returning({ id: table.id });
  return row;
}

const stats = {};
async function migrate(name, docs, fn) {
  if (ONLY && ONLY !== name) return {};
  if (!docs) {
    console.log(`⏭️  ${name}.json tidak ada — dilewati`);
    return {};
  }
  const idMap = {};
  let n = 0;
  for (const doc of docs) {
    const values = fn(doc);
    if (!values) continue;
    const row = await put(
      { materi, quiz_materi: quizMateri, quiz_global: quizGlobal, quiz_event: quizEvent }[name] ||
        (name === "quiz_event_questions" ? quizEventQuestion : name === "users" ? users : quizParticipant),
      values
    );
    if (doc.id !== undefined) idMap[String(doc.id)] = row.id;
    n++;
  }
  stats[name] = n;
  console.log(`✅ ${name}: ${n} baris${DRY_RUN ? " (dry-run)" : ""}`);
  return idMap;
}

// ---------- mapping per koleksi ----------
const mapMateri = (d) => ({
  title: d.title || "(tanpa judul)",
  description: d.description ?? "",
  class: String(d.class ?? ""),
  materi: d.materi ?? "",
  youtube_link: d.youtube_link ?? d.youtubeLink ?? null,
  pdf_link: d.pdf_link ?? d.pdfLink ?? null,
  created_by: d.created_by ? String(d.created_by) : "migrasi",
  created_at: toDate(d.created_at ?? d.createdAt) || undefined,
  updated_at: toDate(d.updated_at ?? d.updatedAt) || undefined,
});

const mapQuizMateri = (d) => ({
  title: d.title || "(tanpa judul)",
  description: d.description ?? "",
  class: String(d.class ?? ""),
  materi: d.materi ?? "",
  status: d.status ?? "draft",
  questions: Array.isArray(d.questions) ? d.questions : [],
  created_at: toDate(d.created_at ?? d.createdAt) || undefined,
  updated_at: toDate(d.updated_at ?? d.updatedAt) || undefined,
});

const mapQuizGlobal = (d) => ({
  title: d.title || "(tanpa judul)",
  visibilty: d.visibilty ?? d.visibility ?? "draft", // typo lama dipertahankan
  questions: Array.isArray(d.questions) ? d.questions : [],
  created_at: toDate(d.created_at ?? d.createdAt) || undefined,
  updated_at: toDate(d.updated_at ?? d.updatedAt) || undefined,
});

const mapUsers = (d) => ({
  uid: String(d.uid || d.id || `legacy-${Date.now()}`),
  email: d.email ?? null,
  display_name: d.display_name ?? d.displayName ?? null,
  role: d.role ?? "student",
  // password_hash sengaja null — user legacy login ulang / dibuatkan baru
});

// ---------- main ----------
console.log(DRY_RUN ? "🔍 DRY-RUN (tidak menulis ke DB)\n" : "🚀 Migrasi Firestore -> Neon\n");

await migrate("materi", load("materi"), mapMateri);
await migrate("quiz_materi", load("quiz_materi"), mapQuizMateri);
await migrate("quiz_global", load("quiz_global"), mapQuizGlobal);
await migrate("users", load("users"), mapUsers);

// Event dulu (butuh peta id lama -> id baru untuk questions).
const eventDocs = ONLY && ONLY !== "quiz_event" ? null : load("quiz_event");
let eventMap = {};
if (eventDocs) {
  eventMap = {};
  let n = 0;
  for (const d of eventDocs) {
    const row = await put(quizEvent, {
      title: d.title || "(tanpa judul)",
      description: d.description ?? "",
      category: d.category ?? "",
      duration_minutes: num(d.duration_minutes ?? d.durationMinutes, 0),
      access_code: d.access_code ?? d.accessCode ?? String(Math.floor(100000 + Math.random() * 900000)),
      status: d.status ?? "draft",
      start_time: toDate(d.start_time ?? d.startTime),
      end_time: toDate(d.end_time ?? d.endTime),
      randomize_order: d.randomize_order ?? false,
      shuffle_options: d.shuffle_options ?? false,
      is_public_results: d.is_public_results ?? true,
      max_participants: num(d.max_participants ?? 0, 0),
      participant_count: num(d.participant_count ?? 0, 0),
      created_by: d.created_by ? String(d.created_by) : "migrasi",
    });
    if (d.id !== undefined) eventMap[String(d.id)] = row.id;
    n++;
    // Soal inline di dokumen event (format lama: questions: [...])
    if (Array.isArray(d.questions)) {
      for (let i = 0; i < d.questions.length; i++) {
        const q = d.questions[i];
        await put(quizEventQuestion, {
          event_id: row.id === "(dry-run)" ? 0 : row.id,
          question: q.question ?? "",
          options: Array.isArray(q.options) ? q.options : [],
          answer: String(q.answer ?? ""),
          order: num(q.order, i),
        });
      }
    }
  }
  stats["quiz_event"] = n;
  console.log(`✅ quiz_event: ${n} baris${DRY_RUN ? " (dry-run)" : ""}`);
} else if (!ONLY) {
  console.log("⏭️  quiz_event.json tidak ada — dilewati");
}

// File questions terpisah: [{ eventId/event_id, question, options, answer, order }]
const qDocs = ONLY && ONLY !== "quiz_event_questions" ? null : load("quiz_event_questions");
if (qDocs) {
  let n = 0;
  for (const d of qDocs) {
    const newEventId = eventMap[String(d.eventId ?? d.event_id)] ?? num(d.eventId ?? d.event_id, 0);
    if (!newEventId) continue;
    await put(quizEventQuestion, {
      event_id: newEventId,
      question: d.question ?? "",
      options: Array.isArray(d.options) ? d.options : [],
      answer: String(d.answer ?? ""),
      order: num(d.order, n),
    });
    n++;
  }
  stats["quiz_event_questions"] = n;
  console.log(`✅ quiz_event_questions: ${n} baris${DRY_RUN ? " (dry-run)" : ""}`);
}

// Participants lama (opsional, butuh peta id quiz — hanya materi/global yang stabil;
const pDocs = ONLY && ONLY !== "quiz_participant" ? null : load("quiz_participant");
if (pDocs) {
  console.log("⚠️  quiz_participant: dilewati otomatis (id quiz lama tidak stabil).");
  console.log("    Kalau butuh, migrasi manual per quiz setelah cek id baru di Neon.");
}

console.log("\n📊 Ringkasan:", JSON.stringify(stats));
if (DRY_RUN) console.log("Selesai dry-run — tidak ada data ditulis.");
else console.log("Selesai. Cek data di Neon, lalu seed admin bila perlu.");
process.exit(0);
