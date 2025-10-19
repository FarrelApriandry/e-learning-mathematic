// server/setAdminRole.js
import admin from "./firebaseAdmin.js";

async function setAdminRole(uid) {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    console.log(`✅ Role admin berhasil diberikan ke user ${uid}`);
}

setAdminRole("UID_USER_YANG_MAU_JADI_ADMIN");
