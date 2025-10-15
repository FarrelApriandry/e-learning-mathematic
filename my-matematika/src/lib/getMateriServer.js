// src/lib/getMateriServer.js
// Server-side helper (uses firebase-admin)
import admin from "firebase-admin";
import fs from "fs";

// If you prefer JSON import, use assert/import technique. Using fs is more robust for some bundlers.
const keyPath = new URL("./serviceAccountKey.json", import.meta.url);
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

/**
 * Fetch materi (server-side)
 * @param {Object} opts
 * @param {string} opts.orderByField
 * @param {'asc'|'desc'} opts.order
 * @param {number} opts.limit
 */
export async function getMateriServer({ orderByField = "created_at", order = "desc", limit = 100 } = {}) {
  try {
    let q = db.collection("materi").orderBy(orderByField, order).limit(limit);
    const snap = await q.get();

    const docs = snap.docs.map((doc) => {
      const data = doc.data();

      const normalizeTs = (val) => {
        if (!val) return null;
        if (val.toDate) return val.toDate().toISOString();
        // fallback
        return val;
      };

      return {
        id: doc.id,
        ...data,
        created_at: normalizeTs(data.created_at),
        updated_at: normalizeTs(data.updated_at),
      };
    });

    return { ok: true, data: docs };
  } catch (err) {
    console.error("getMateriServer error:", err);
    return { ok: false, error: err.message || String(err) };
  }
}

export default getMateriServer;

