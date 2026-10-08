// scripts/seed-admin.js
// Bikin / update akun admin di tabel `users` (Neon Postgres).
//
// Cara pakai:
//   ADMIN_EMAIL=admin@admin.id ADMIN_PASSWORD='rahasia-min-8-kar' npm run seed:admin
// (.env juga dibaca otomatis, jadi bisa taruh ADMIN_EMAIL/ADMIN_PASSWORD di sana.)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Muat .env sederhana tanpa dep tambahan (jangan timpa env yang sudah ada).
const envPath = path.join(root, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}

const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";

if (!email || !password) {
  console.error(
    "❌ ADMIN_EMAIL & ADMIN_PASSWORD wajib diisi (env atau .env).\n" +
      "   Contoh: ADMIN_EMAIL=admin@admin.id ADMIN_PASSWORD='...' npm run seed:admin"
  );
  process.exit(1);
}
if (password.length < 8) {
  console.error("❌ ADMIN_PASSWORD minimal 8 karakter.");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL belum diset di .env.");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const hash = await bcrypt.hash(password, 10);
const uid = `admin-${email}`;

const rows = await sql`
  INSERT INTO users (uid, email, display_name, password_hash, role)
  VALUES (${uid}, ${email}, 'Administrator', ${hash}, 'admin')
  ON CONFLICT (uid) DO UPDATE SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    role = 'admin'
  RETURNING id, email, role
`;
console.log(`✅ Admin siap: ${rows[0].email} (id=${rows[0].id}, role=${rows[0].role})`);
await sql.end();
