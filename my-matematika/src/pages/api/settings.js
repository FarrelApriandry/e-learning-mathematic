// src/pages/api/settings.js
// Key-value settings situs. GET publik hanya untuk key yang di-whitelist
// (dipakai IntroPopup); perubahan wajib admin.
import { db } from "../../db/index.js";
import { siteSettings } from "../../lib/apiHelpers.js";
import { eq } from "drizzle-orm";
import { verifyAdmin } from "../../lib/auth.js";

// Key yang boleh dibaca publik (tanpa token)
const PUBLIC_KEYS = ["intro_video_url"];

export async function GET({ url }) {
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response(
      JSON.stringify({ success: false, message: "Parameter key wajib diisi." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!PUBLIC_KEYS.includes(key)) {
    return new Response(
      JSON.stringify({ success: false, message: "Key tidak tersedia." }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);

  return new Response(
    JSON.stringify({
      success: true,
      data: { key, value: row?.value ?? null, updated_at: row?.updated_at ?? null },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function PUT({ request }) {
  const gate = await verifyAdmin(request);
  if (gate.error) return gate.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: "Body harus JSON valid." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const key = typeof body?.key === "string" ? body.key.trim() : "";
  const value = typeof body?.value === "string" ? body.value.trim() : "";

  if (!key) {
    return new Response(
      JSON.stringify({ success: false, message: "Parameter key wajib diisi." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validasi URL video: kosong boleh (menonaktifkan popup),
  // kalau diisi harus embeddable (YouTube atau Google Drive).
  if (value) {
    const ok =
      /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/.test(value) ||
      /^https:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/.test(value) ||
      /^https:\/\/youtu\.be\/[\w-]+/.test(value) ||
      /^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view(\?.*)?$/.test(value);
    if (!ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "URL harus link YouTube (watch/youtu.be) atau Google Drive (/file/d/.../view).",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  await db
    .insert(siteSettings)
    .values({ key, value: value || null })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: value || null, updated_at: new Date() },
    });

  return new Response(
    JSON.stringify({ success: true, message: "Pengaturan tersimpan." }),
    { headers: { "Content-Type": "application/json" } }
  );
}
