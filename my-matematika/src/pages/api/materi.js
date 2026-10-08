// src/pages/api/materi.js
import { verifyAdmin } from "../../lib/auth.js";
import {
  ok,
  okMessage,
  badRequest,
  serverError,
  readBody,
  toId,
  eq,
  desc,
  materi,
} from "../../lib/apiHelpers.js";
import { db } from "../../db/index.js";

// ===============================
// GET — Ambil semua materi, atau 1 materi via ?id=
// ===============================
export async function GET({ request }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = toId(searchParams.get("id"));

    if (id) {
      const rows = await db.select().from(materi).where(eq(materi.id, id)).limit(1);
      if (rows.length === 0) return badRequest("Materi tidak ditemukan.");
      return ok(rows[0]);
    }

    const data = await db
      .select()
      .from(materi)
      .orderBy(desc(materi.created_at));

    return ok(data);
  } catch (err) {
    return serverError(err, "GET materi");
  }
}

// ===============================
// POST — Tambah materi baru
// ===============================
export async function POST({ request }) {
  try {
    const gate = verifyAdmin(request);
    if (gate.error) return gate.error;
    const body = await readBody(request);

    if (!body.title) {
      return badRequest("Title wajib diisi.");
    }

    const [row] = await db
      .insert(materi)
      .values({
        title: body.title,
        description: body.description ?? "",
        class: body.class ?? "",
        materi: body.materi ?? "",
        youtube_link: body.youtube_link ?? null,
        pdf_link: body.pdf_link ?? null,
        created_by: body.created_by ? String(body.created_by) : "system",
      })
      .returning();

    return okMessage("Materi berhasil ditambahkan!", { id: row.id });
  } catch (err) {
    return serverError(err, "POST materi");
  }
}

// ===============================
// PUT — Update materi by ID
// ===============================
export async function PUT({ request }) {
  try {
    const gate = verifyAdmin(request);
    if (gate.error) return gate.error;
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("ID materi tidak ditemukan.");

    const updates = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.class !== undefined) updates.class = body.class;
    if (body.materi !== undefined) updates.materi = body.materi;
    if (body.youtube_link !== undefined) updates.youtube_link = body.youtube_link;
    if (body.pdf_link !== undefined) updates.pdf_link = body.pdf_link;
    updates.updated_at = new Date();

    await db.update(materi).set(updates).where(eq(materi.id, id));

    return okMessage("Materi berhasil diperbarui!");
  } catch (err) {
    return serverError(err, "PUT materi");
  }
}

// ===============================
// DELETE — Hapus materi by ID
// ===============================
export async function DELETE({ request }) {
  try {
    const gate = verifyAdmin(request);
    if (gate.error) return gate.error;
    const body = await readBody(request);
    const id = toId(body.id);
    if (!id) return badRequest("ID materi tidak ditemukan.");

    await db.delete(materi).where(eq(materi.id, id));

    return okMessage("Materi berhasil dihapus!");
  } catch (err) {
    return serverError(err, "DELETE materi");
  }
}
