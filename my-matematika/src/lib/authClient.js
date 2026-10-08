/**
 * Helper auth sisi client (React) — pengganti firebaseConfig.
 * Token JWT disimpan di localStorage, dikirim otomatis oleh apiClient
 * lewat header `Authorization: Bearer <token>`.
 */

const TOKEN_KEY = "elmath_admin_token";
const USER_KEY = "elmath_admin_user";

const hasStorage = () => typeof localStorage !== "undefined";

export const getToken = () =>
  hasStorage() ? localStorage.getItem(TOKEN_KEY) : null;

/** Header auth untuk fetch manual (apiClient sudah otomatis). */
export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function loginAdmin(email, password) {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Login gagal.");
  }
  if (hasStorage()) {
    localStorage.setItem(TOKEN_KEY, json.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(json.data.user));
  }
  return json.data.user;
}

/** Validasi token ke server. Return user, atau null (token dibersihkan). */
export async function fetchMe() {
  const t = getToken();
  if (!t) return null;
  try {
    const res = await fetch("/api/auth?action=me", {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (!res.ok) {
      clearAuth();
      return null;
    }
    const json = await res.json();
    return json.data?.user ?? null;
  } catch {
    return null;
  }
}

/** User dari cache lokal (cepat, untuk tampil nama di navbar). */
export function getStoredUser() {
  if (!hasStorage()) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (!hasStorage()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function logoutAdmin() {
  clearAuth();
  window.location.href = "/admin/";
}
