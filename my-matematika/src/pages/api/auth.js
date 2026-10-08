// src/pages/api/auth.js
// POST { email, password } -> login admin, return { token, user }
// GET ?action=me (header Authorization: Bearer <token>) -> profil admin
import {
  ok,
  badRequest,
  serverError,
  readBody,
  eq,
  users,
} from "../../lib/apiHelpers.js";
import { db } from "../../db/index.js";
import {
  checkPassword,
  signAdminToken,
  verifyAdmin,
  unauth,
} from "../../lib/auth.js";

export async function POST({ request }) {
  try {
    const body = await readBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || !body.password) {
      return badRequest("Email & password wajib diisi.");
    }

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = rows[0];

    const valid =
      user &&
      user.role === "admin" &&
      (await checkPassword(body.password, user.password_hash));
    if (!valid) {
      return unauth("Email atau password salah.");
    }

    const token = signAdminToken(user);
    return ok({
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
      },
    });
  } catch (err) {
    return serverError(err, "POST auth");
  }
}

export async function GET({ request }) {
  try {
    const gate = verifyAdmin(request);
    if (gate.error) return gate.error;
    return ok({ user: gate.user });
  } catch (err) {
    return serverError(err, "GET auth");
  }
}
