// src/lib/auth.js
// Auth admin mandiri: password = bcrypt hash di tabel `users`,
// sesi = JWT (Authorization: Bearer <token>). Firebase dilepas total.
//
// Env: AUTH_SECRET (string acak panjang, lihat .env.example).
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    throw new Error(
      "AUTH_SECRET belum diset. Isi di .env (lihat .env.example)."
    );
  }
  return s;
}

export const hashPassword = (plain) => bcrypt.hash(plain, 10);

export async function checkPassword(plain, hash) {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
}

/** Bikin token sesi admin (berlaku 7 hari). */
export function signAdminToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    getSecret(),
    { expiresIn: "7d" }
  );
}

/**
 * Verifikasi header Authorization dari request Astro.
 * Return { user } kalau valid, atau { error: Response 401 } kalau tidak.
 */
export function verifyAdmin(request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) return { error: unauth("Belum login. Silakan login dulu.") };
  try {
    const payload = jwt.verify(token, getSecret());
    if (payload.role !== "admin") {
      return { error: unauth("Akun ini bukan admin.") };
    }
    return { user: payload };
  } catch {
    return { error: unauth("Sesi kadaluarsa. Silakan login ulang.") };
  }
}

export function unauth(message) {
  return new Response(JSON.stringify({ success: false, message }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
