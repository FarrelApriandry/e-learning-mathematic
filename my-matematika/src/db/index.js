import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

/**
 * Koneksi DB terpusat (Neon Postgres).
 *
 * Pakai:
 *   import { db } from "src/db/index.js";
 *
 * Env yang dibutuhkan (.env):
 *   DATABASE_URL=postgres://user:pass@host/db?sslmode=require
 *
 * NOTE Neon: pooling via websocket (postgres-js + neon serverless driver)
 * tidak wajib; cukup pastikan host-nya endpoint pooled
 * (`...pooler.<region>.aws.neon.tech`) kalau dipakai di serverless.
 */

let _db = null;
let _sql = null;

export function getDb() {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL belum diset. Salin .env.example jadi .env lalu isi DATABASE_URL dengan connection string Neon."
    );
  }

  _sql = postgres(url, {
    // supaya error-nya jelas kalau koneksi gagal di dev
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  _db = drizzle(_sql, { schema });
  return _db;
}

/** Akses klien postgres mentah (mis. untuk transaksi khusus). */
export function getSql() {
  getDb();
  return _sql;
}

// Shortcut ergonomis untuk import langsung di API routes.
export const db = new Proxy(
  {},
  {
    get(_t, prop) {
      const real = getDb();
      const v = real[prop];
      return typeof v === "function" ? v.bind(real) : v;
    },
  }
);

export { schema };
