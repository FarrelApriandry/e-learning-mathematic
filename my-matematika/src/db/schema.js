import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  index,
} from "drizzle-orm/pg-core";

/**
 * Skema Drizzle — migrasi Firestore -> Neon Postgres
 *
 * Konvensi:
 * - ID memakai serial (angka auto-increment) menggantikan ID string Firestore.
 * - Firestore `Timestamp` -> Postgres `timestamp with time zone`.
 * - Soal quiz disimpan sebagai JSONB (bentuknya identik dengan array `questions`
 *   di Firestore, jadi komponen client tidak perlu banyak berubah).
 * - `participants` yang sebelumnya array di dalam dokumen event dipromosikan
 *   menjadi tabel sendiri supaya bisa ditulis tanpa race condition.
 */

// =====================
// MATERI
// =====================
export const materi = pgTable(
  "materi",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").default("").notNull(),
    class: text("class").default("").notNull(), // "10" | "11" | "12"
    materi: text("materi").default("").notNull(), // topik/bab materi
    youtube_link: text("youtube_link"),
    pdf_link: text("pdf_link"),
    downloads: integer("downloads").default(0).notNull(),
    views: integer("views").default(0).notNull(),
    created_by: text("created_by").default("system").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => [index("materi_class_idx").on(t.class)]
);

// =====================
// QUIZ (materi / global)
// =====================
// Soal: [{ question, options: [string x4], answer: number }]
const questionsJson = jsonb("questions").default([]).notNull();

export const quizMateri = pgTable(
  "quiz_materi",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").default("").notNull(),
    class: text("class").default("").notNull(), // "10" | "11" | "12"
    materi: text("materi").default("").notNull(), // topik/bab materi
    related_materi: text("related_materi").default("").notNull(),
    is_public: boolean("is_public").default(false).notNull(),
    status: text("status").default("draft").notNull(), // draft | published | closed
    questions: questionsJson,
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => [index("quiz_materi_class_status_idx").on(t.class, t.status)]
);

export const quizGlobal = pgTable("quiz_global", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default("").notNull(),
  // NOTE: menyalin ejaan dari Firestore ("visibilty") supaya payload client
  // lama tetap kompatibel. Betulkan ejaannya kalau mau sekalian refactor.
  visibilty: text("visibilty").default("").notNull(),
  category: text("category").default("").notNull(),
  questions: questionsJson,
  randomize_order: boolean("randomize_order").default(true).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});

// =====================
// QUIZ EVENT
// =====================
export const quizEvent = pgTable(
  "quiz_event",
  {
    id: serial("id").primaryKey(),
    title: text("title").default("Untitled Quiz Event").notNull(),
    description: text("description").default("").notNull(),
    category: text("category").default("").notNull(),
    duration_minutes: integer("duration_minutes").default(0).notNull(),
    start_time: timestamp("start_time", { withTimezone: true }),
    end_time: timestamp("end_time", { withTimezone: true }),
    access_code: text("access_code").notNull(),
    status: text("status").default("draft").notNull(), // draft | open | closed
    randomize_order: boolean("randomize_order").default(false).notNull(),
    shuffle_options: boolean("shuffle_options").default(false).notNull(),
    is_public_results: boolean("is_public_results").default(false).notNull(),
    max_participants: integer("max_participants").default(0).notNull(),
    last_modified_by: text("last_modified_by"),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => [index("quiz_event_access_code_idx").on(t.access_code)]
);

// Subcollection `quiz_event/{id}/questions`
// Soal: [{ question, options: [string x4], answer: string|number }]
export const quizEventQuestion = pgTable(
  "quiz_event_question",
  {
    id: serial("id").primaryKey(),
    event_id: integer("event_id")
      .notNull()
      .references(() => quizEvent.id, { onDelete: "cascade" }),
    question: text("question").default("").notNull(),
    options: jsonb("options").default([]).notNull(),
    answer: text("answer").default("").notNull(),
    order: integer("order").default(0).notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => [index("quiz_event_question_event_idx").on(t.event_id)]
);

// =====================
// PARTICIPANTS
// =====================
// Dulu: array `participants` di dokumen quiz_event + subcollection
// `participants` di quiz_materi / quiz_global (isi: name, score, total, createdAt).
// Sekarang: satu tabel untuk semua tipe quiz.
export const quizParticipant = pgTable(
  "quiz_participant",
  {
    id: serial("id").primaryKey(),
    quiz_type: text("quiz_type").notNull(), // "materi" | "global" | "event"
    quiz_id: integer("quiz_id").notNull(),
    // identitas peserta: uid (event) atau nama bebas (materi/global)
    uid: text("uid"),
    name: text("name"),
    score: integer("score").default(0).notNull(),
    total: integer("total").default(0).notNull(),
    answers: jsonb("answers").default([]).notNull(),
    joined_at: timestamp("joined_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    completed_at: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [index("quiz_participant_quiz_idx").on(t.quiz_type, t.quiz_id)]
);

// =====================
// USERS
// =====================
// Koleksi `users` — juga dipakai untuk auth admin mandiri (bcrypt + JWT).
// Admin dibuat via `npm run seed:admin` (baca ADMIN_EMAIL/ADMIN_PASSWORD dari env).
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").unique().notNull(),
  email: text("email"),
  display_name: text("display_name"),
  // hash bcrypt untuk login admin mandiri; null = user legacy tanpa password
  password_hash: text("password_hash"),
  role: text("role").default("student").notNull(), // student | admin
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});

// =====================
// SITE SETTINGS
// =====================
// Key-value store untuk pengaturan situs (video tutorial, pengumuman, dll).
// Key publik dibatasi lewat whitelist di src/pages/api/settings.js.
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});

// =====================
// INDEXES
// =====================
// Index didefinisikan langsung di masing-masing tabel di atas (drizzle-kit
// yang kelola). Blok ini tinggalan versi pertama; tidak dipakai lagi.
