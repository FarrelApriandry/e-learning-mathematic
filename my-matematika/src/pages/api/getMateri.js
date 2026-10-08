// src/pages/api/getMateri.js
// Alias publik dari /api/materi (dipakai src/lib/getMateri.js).
import {
  ok,
  serverError,
  desc,
  materi,
} from "../../lib/apiHelpers.js";
import { db } from "../../db/index.js";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(materi)
      .orderBy(desc(materi.created_at));

    return ok(data);
  } catch (err) {
    return serverError(err, "GET getMateri");
  }
}
