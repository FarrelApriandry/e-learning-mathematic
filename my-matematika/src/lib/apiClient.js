/**
 * Client-side helper buat komponen React — pengganti akses Firestore langsung.
 * Semua lewat fetch ke /api/* (format response: { success, data?, message? }).
 * Token admin (localStorage) dikirim otomatis via Authorization: Bearer.
 *
 * Konvensi penting: ID sekarang ANGKA (serial Postgres), bukan string Firestore.
 * Fungsi fetch* di sini sudah menormalkan timestamp ke string ISO dan
 * menyediakan alias field yang dipakai komponen lama.
 */

function adminToken() {
  try {
    return typeof localStorage !== "undefined"
      ? localStorage.getItem("elmath_admin_token")
      : null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = adminToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Response bukan JSON dari ${path} (HTTP ${res.status})`);
  }
  if (!res.ok || json.success === false) {
    throw new Error(json?.message || `HTTP ${res.status} dari ${path}`);
  }
  return json;
}

// Versi publik dari request(): dipakai komponen non-admin
export async function apiRequest(path, options = {}) {
  return request(path, options);
}

/** Normalkan baris Postgres ke bentuk yang diharapkan komponen lama. */
function normalize(row) {
  if (!row || typeof row !== "object") return row;
  return {
    ...row,
    // Firestore memberi timestamp {seconds}; komponen lama memakai
    // `ts.seconds * 1000`. ISO string -> pertahankan angka-angka itu:
    created_at: ts(row.created_at),
    updated_at: ts(row.updated_at),
    start_time: ts(row.start_time),
    end_time: ts(row.end_time),
    joined_at: ts(row.joined_at),
    completed_at: ts(row.completed_at),
  };
}

function ts(value) {
  if (value === null || value === undefined) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  // Kompatibel dua pola lama sekaligus:
  //  - `new Date(x.created_at)` / render langsung (Date -> ISO otomatis)
  //  - `x.created_at.seconds * 1000` (warisan Firestore, komponen admin)
  // Date object aman buat kedua-duanya; string primitive tidak (strict mode
  // melempar error saat defineProperty di string).
  Object.defineProperty(d, "seconds", {
    value: Math.floor(d.getTime() / 1000),
    enumerable: false,
  });
  return d;
}

// ---------- MATERI ----------
export const fetchMateri = async () =>
  (await request("/api/materi")).data.map(normalize);

export const fetchMateriById = async (id) =>
  normalize((await request(`/api/materi?id=${id}`)).data);

export const createMateri = (payload) =>
  request("/api/materi", { method: "POST", body: JSON.stringify(payload) });

export const updateMateri = (id, payload) =>
  request("/api/materi", {
    method: "PUT",
    body: JSON.stringify({ id, ...payload }),
  });

export const deleteMateri = (id) =>
  request("/api/materi", { method: "DELETE", body: JSON.stringify({ id }) });

// ---------- QUIZ MATERI ----------
export const fetchQuizMateri = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  ).toString();
  const data = (await request(`/api/quiz_materi${qs ? `?${qs}` : ""}`)).data;
  return Array.isArray(data) ? data.map(normalize) : normalize(data);
};

export const createQuizMateri = (payload) =>
  request("/api/quiz_materi", { method: "POST", body: JSON.stringify(payload) });

export const updateQuizMateri = (id, payload) =>
  request("/api/quiz_materi", {
    method: "PUT",
    body: JSON.stringify({ id, ...payload }),
  });

export const deleteQuizMateri = (id) =>
  request("/api/quiz_materi", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

// ---------- QUIZ GLOBAL ----------
export const fetchQuizGlobal = async () =>
  (await request("/api/quiz_global")).data.map(normalize);

export const fetchQuizGlobalById = async (id) =>
  normalize((await request(`/api/quiz_global?id=${id}`)).data);

export const createQuizGlobal = (payload) =>
  request("/api/quiz_global", { method: "POST", body: JSON.stringify(payload) });

export const updateQuizGlobal = (id, payload) =>
  request("/api/quiz_global", {
    method: "PUT",
    body: JSON.stringify({ id, ...payload }),
  });

export const deleteQuizGlobal = (id) =>
  request("/api/quiz_global", { method: "DELETE", body: JSON.stringify({ id }) });

// ---------- QUIZ EVENT ----------
export const fetchQuizEvent = async () =>
  (await request("/api/quiz_event")).data.map(normalize);

export const fetchQuizEventById = async (id) =>
  normalize((await request(`/api/quiz_event?id=${id}`)).data);

export const createQuizEvent = (payload) =>
  request("/api/quiz_event", { method: "POST", body: JSON.stringify(payload) });

export const updateQuizEvent = (id, updates, last_modified_by) =>
  request("/api/quiz_event", {
    method: "PUT",
    body: JSON.stringify({ id, updates, last_modified_by }),
  });

export const deleteQuizEvent = (id) =>
  request("/api/quiz_event", { method: "DELETE", body: JSON.stringify({ id }) });

// ---------- QUIZ EVENT QUESTIONS ----------
export const fetchEventQuestions = async (eventId) =>
  (await request(`/api/quiz_event_question?eventId=${eventId}`)).data;

export const createEventQuestions = (eventId, questions) =>
  request("/api/quiz_event_question", {
    method: "POST",
    body: JSON.stringify({ eventId, questions }),
  });

export const updateEventQuestion = (eventId, questionId, updates) =>
  request("/api/quiz_event_question", {
    method: "PUT",
    body: JSON.stringify({ eventId, questionId, updates }),
  });

export const deleteEventQuestion = (eventId, questionId) =>
  request("/api/quiz_event_question", {
    method: "DELETE",
    body: JSON.stringify({ eventId, questionId }),
  });

// ---------- PARTICIPANTS ----------
export const joinQuizEvent = (quiz_id, uid, access_code, name) =>
  request("/api/quiz_participant", {
    method: "POST",
    body: JSON.stringify({ action: "join", quiz_type: "event", quiz_id, uid, access_code, name }),
  });

export const submitQuizEvent = (quiz_id, uid, answers, score, total) =>
  request("/api/quiz_participant", {
    method: "POST",
    body: JSON.stringify({ action: "submit", quiz_type: "event", quiz_id, uid, answers, score, total }),
  });

export const submitQuizResult = (quiz_type, quiz_id, name, answers, score, total) =>
  request("/api/quiz_participant", {
    method: "POST",
    body: JSON.stringify({ action: "submit", quiz_type, quiz_id, name, answers, score, total }),
  });

export const fetchParticipants = async (quiz_type, quiz_id) =>
  (await request(`/api/quiz_participant?action=all&quiz_type=${quiz_type}&quiz_id=${quiz_id}`)).data.map(normalize);
